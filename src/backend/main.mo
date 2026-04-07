import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type InquiryStatus = {
    #pending;
    #approved;
    #rejected;
    #contacted;
  };

  // CASES
  public type CaseStatus = { #pending; #active; #closed };
  public type Priority = { #low; #medium; #high; #urgent };

  public type Case = { id : Nat; title : Text; description : Text; clientId : Principal; status : CaseStatus; priority : Priority; investigatorId : ?Principal; createdAt : Time.Time; updatedAt : Time.Time };

  // CASE NOTE
  public type CaseNote = { id : Nat; caseId : Nat; content : Text; authorId : Principal; timestamp : Time.Time };

  // CLIENT
  public type KYCStatus = { #pending; #verified; #rejected };
  public type Client = { id : Principal; name : Text; phone : Text; email : Text; address : Text; kycStatus : KYCStatus };

  // INQUIRIES
  public type Inquiry = { id : Text; name : Text; phone : Text; email : Text; message : Text; serviceType : Text; status : InquiryStatus; timestamp : Int };

  // STAFF
  public type StaffRole = { #investigator; #analyst; #admin };
  public type Staff = { id : Principal; name : Text; email : Text; phone : Text; role : StaffRole; lastActive : Time.Time };

  // MEDIA
  public type Media = { id : Text; fileName : Text; fileType : Text; category : Text; uploadedBy : Principal; caseId : ?Nat; uploadedAt : Time.Time; blob : ?Storage.ExternalBlob };

  // SETTINGS
  public type Setting = { key : Text; value : Text };

  // ACTIVITY LOGS
  public type ActivityLog = { id : Nat; userId : Principal; role : AccessControl.UserRole; action : Text; details : Text; timestamp : Time.Time };

  // MESSAGES (CASE CHAT)
  public type Message = { id : Nat; senderId : Principal; role : AccessControl.UserRole; content : Text; caseId : Nat; timestamp : Time.Time };

  // USER PROFILE (required by frontend)
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : Text; // "admin", "staff", or "client"
  };

  // INTERNAL STATE
  let cases = Map.empty<Nat, Case>();
  let caseNotes = Map.empty<Nat, [CaseNote]>();
  let clients = Map.empty<Principal, Client>();
  let staff = Map.empty<Principal, Staff>();
  let inquiries = Map.empty<Text, Inquiry>();
  let media = Map.empty<Text, Media>();
  let settings = Map.empty<Text, Setting>();
  let activityLogs = Map.empty<Nat, ActivityLog>();
  let messages = Map.empty<Nat, [Message]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextCaseId = 1;
  var nextLogId = 1;
  var nextMsgId = 1;
  var nextNoteId = 1;

  // COMPARISON MODULES
  module Case {
    public func compare(a : Case, b : Case) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Client {
    public func compare(a : Client, b : Client) : Order.Order {
      a.name.compare(b.name);
    };
  };

  module Staff {
    public func compare(a : Staff, b : Staff) : Order.Order {
      Principal.compare(a.id, b.id);
    };
  };

  module Inquiry {
    public func compare(a : Inquiry, b : Inquiry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Helper functions to check if user is staff or client
  func isStaff(principal : Principal) : Bool {
    staff.containsKey(principal);
  };

  func isClient(principal : Principal) : Bool {
    clients.containsKey(principal);
  };

  func isStaffOrAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or isStaff(caller);
  };

  // USER PROFILE FUNCTIONS (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CASES
  public shared ({ caller }) func createCase(title : Text, description : Text, clientId : Principal, priority : Priority) : async Nat {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can create cases");
    };

    let caseId = nextCaseId;
    let newCase : Case = { id = caseId; title; description; clientId; status = #pending; priority; investigatorId = null; createdAt = Time.now(); updatedAt = Time.now() };
    cases.add(caseId, newCase);
    nextCaseId += 1;
    logActivity(caller, #user, "Created case", "Case ID: " # caseId.toText());
    caseId;
  };

  // Assign investigator to case
  public shared ({ caller }) func assignInvestigator(caseId : Nat, investigatorId : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can assign investigators");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?existingCase) {
        let updatedCase = { existingCase with investigatorId = ?investigatorId; updatedAt = Time.now() };
        cases.add(caseId, updatedCase);
        logActivity(caller, #admin, "Assigned investigator", "Case ID: " # caseId.toText());
      };
    };
  };

  // Update case status
  public shared ({ caller }) func updateCaseStatus(caseId : Nat, status : CaseStatus) : async () {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can update cases");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?existingCase) {
        let updatedCase = { existingCase with status; updatedAt = Time.now() };
        cases.add(caseId, updatedCase);
        logActivity(caller, #user, "Updated case status", "Case ID: " # caseId.toText());
      };
    };
  };

  // Add case note
  public shared ({ caller }) func addCaseNote(caseId : Nat, content : Text) : async () {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can add case notes");
    };

    if (not cases.containsKey(caseId)) {
      Runtime.trap("Case not found");
    };

    let noteId = nextNoteId;
    let newNote = { id = noteId; caseId; content; authorId = caller; timestamp = Time.now() };
    let existingNotes = switch (caseNotes.get(caseId)) { case (null) { [] }; case (?notes) { notes } };
    caseNotes.add(caseId, existingNotes.concat([newNote]));
    nextNoteId += 1;
    logActivity(caller, #user, "Added case note", "Case ID: " # caseId.toText());
  };

  // Get case by ID
  public query ({ caller }) func getCaseById(caseId : Nat) : async ?Case {
    switch (cases.get(caseId)) {
      case (null) { null };
      case (?c) {
        // Admin and staff can view any case
        if (isStaffOrAdmin(caller)) {
          return ?c;
        };
        // Clients can only view their own cases
        if (c.clientId == caller) {
          return ?c;
        };
        Runtime.trap("Unauthorized: You don't have access to this case");
      };
    };
  };

  // Get all cases (admin/staff)
  public query ({ caller }) func getAllCases() : async [Case] {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can view all cases");
    };
    cases.values().toArray().sort();
  };

  // Get cases by client
  public query ({ caller }) func getCasesByClient(clientId : Principal) : async [Case] {
    // Admin and staff can view any client's cases
    if (isStaffOrAdmin(caller)) {
      return cases.values().toArray().filter(func(c) { c.clientId == clientId });
    };
    // Clients can only view their own cases
    if (caller == clientId) {
      return cases.values().toArray().filter(func(c) { c.clientId == clientId });
    };
    Runtime.trap("Unauthorized: You can only view your own cases");
  };

  // Get cases by investigator
  public query ({ caller }) func getCasesByInvestigator(investigatorId : Principal) : async [Case] {
    // Admin and staff can view any investigator's cases
    if (isStaffOrAdmin(caller)) {
      return cases.values().toArray().filter(func(c) { switch (c.investigatorId) { case (?id) { id == investigatorId }; case (null) { false } } });
    };
    Runtime.trap("Unauthorized: Only staff can view cases by investigator");
  };

  // Get case notes
  public query ({ caller }) func getCaseNotes(caseId : Nat) : async [CaseNote] {
    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) {
        // Admin and staff can view any case notes
        if (isStaffOrAdmin(caller)) {
          return switch (caseNotes.get(caseId)) {
            case (null) { [] };
            case (?notes) { notes };
          };
        };
        // Clients can only view notes for their own cases
        if (c.clientId == caller) {
          return switch (caseNotes.get(caseId)) {
            case (null) { [] };
            case (?notes) { notes };
          };
        };
        Runtime.trap("Unauthorized: You don't have access to these case notes");
      };
    };
  };

  // CLIENTS
  public shared ({ caller }) func createClient(name : Text, phone : Text, email : Text, address : Text) : async () {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can create clients");
    };
    let newClient : Client = { id = caller; name; phone; email; address; kycStatus = #pending };
    clients.add(caller, newClient);
    logActivity(caller, #user, "Created client", "Client ID: " # caller.toText());
  };

  public shared ({ caller }) func updateClient(id : Principal, name : Text, phone : Text, email : Text, address : Text, kycStatus : KYCStatus) : async () {
    // Only admin/staff can update clients, or the client themselves (but not KYC status)
    if (caller == id) {
      // Client updating their own profile - cannot change KYC status
      switch (clients.get(id)) {
        case (null) { Runtime.trap("Client not found") };
        case (?existing) {
          let updatedClient : Client = { id; name; phone; email; address; kycStatus = existing.kycStatus };
          clients.add(id, updatedClient);
          logActivity(caller, #user, "Updated client", "Client ID: " # id.toText());
        };
      };
    } else if (isStaffOrAdmin(caller)) {
      // Staff/admin can update everything including KYC status
      let updatedClient : Client = { id; name; phone; email; address; kycStatus };
      clients.add(id, updatedClient);
      logActivity(caller, #user, "Updated client", "Client ID: " # id.toText());
    } else {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };
  };

  public query ({ caller }) func getClientById(clientId : Principal) : async ?Client {
    // Admin and staff can view any client
    if (isStaffOrAdmin(caller)) {
      return clients.get(clientId);
    };
    // Clients can only view their own profile
    if (caller == clientId) {
      return clients.get(clientId);
    };
    Runtime.trap("Unauthorized: You can only view your own client profile");
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can view all clients");
    };
    clients.values().toArray().sort();
  };

  public query ({ caller }) func getClientCases(clientId : Principal) : async [Case] {
    // Admin and staff can view any client's cases
    if (isStaffOrAdmin(caller)) {
      return cases.values().toArray().filter(func(c) { c.clientId == clientId });
    };
    // Clients can only view their own cases
    if (caller == clientId) {
      return cases.values().toArray().filter(func(c) { c.clientId == clientId });
    };
    Runtime.trap("Unauthorized: You can only view your own cases");
  };

  // STAFF
  public shared ({ caller }) func createStaff(name : Text, email : Text, phone : Text, role : StaffRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create staff");
    };
    let newStaff : Staff = { id = caller; name; email; phone; role; lastActive = Time.now() };
    staff.add(caller, newStaff);
    logActivity(caller, #admin, "Created staff", "Staff ID: " # caller.toText());
  };

  public shared ({ caller }) func updateStaff(id : Principal, name : Text, email : Text, phone : Text, role : StaffRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update staff");
    };
    let updatedStaff : Staff = { id; name; email; phone; role; lastActive = Time.now() };
    staff.add(id, updatedStaff);
    logActivity(caller, #admin, "Updated staff", "Staff ID: " # id.toText());
  };

  public query ({ caller }) func getStaffById(staffId : Principal) : async ?Staff {
    // Admin and staff can view any staff member
    if (isStaffOrAdmin(caller)) {
      return staff.get(staffId);
    };
    Runtime.trap("Unauthorized: Only staff can view staff profiles");
  };

  public query ({ caller }) func getAllStaff() : async [Staff] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all staff");
    };
    staff.values().toArray().sort();
  };

  // INQUIRIES
  public shared ({ caller }) func createInquiry(name : Text, phone : Text, email : Text, message : Text, serviceType : Text) : async Text {
    // Anyone can create an inquiry (including guests)
    let id = name # "-" # Time.now().toText();
    let newInquiry : Inquiry = { id; name; phone; email; message; serviceType; status = #pending; timestamp = Time.now() };
    inquiries.add(id, newInquiry);
    logActivity(caller, #guest, "Created inquiry", "Inquiry ID: " # id);
    id;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all inquiries");
    };
    inquiries.values().toArray().sort();
  };

  public shared ({ caller }) func updateInquiryStatus(id : Text, status : InquiryStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update inquiries");
    };
    switch (inquiries.get(id)) {
      case (null) { () };
      case (?inquiry) {
        let updatedInquiry = { inquiry with status };
        inquiries.add(id, updatedInquiry);
        logActivity(caller, #admin, "Updated inquiry", "Inquiry ID: " # id);
      };
    };
  };

  // MEDIA
  public shared ({ caller }) func addMedia(id : Text, fileName : Text, fileType : Text, category : Text, uploadedBy : Principal, caseId : ?Nat, blob : ?Storage.ExternalBlob) : async () {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can add media");
    };
    let newMedia : Media = { id; fileName; fileType; category; uploadedBy; caseId; uploadedAt = Time.now(); blob };
    media.add(id, newMedia);
    logActivity(caller, #user, "Added media", "Media ID: " # id);
  };

  // Delete media reference
  public shared ({ caller }) func deleteMedia(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete media");
    };
    media.remove(id);
    logActivity(caller, #admin, "Deleted media", "Media ID: " # id);
  };

  // Get media by case
  public query ({ caller }) func getMediaByCase(caseId : Nat) : async [Media] {
    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) {
        // Admin and staff can view any case media
        if (isStaffOrAdmin(caller)) {
          return media.values().toArray().filter(func(m) { switch (m.caseId) { case (?id) { id == caseId }; case (null) { false } } });
        };
        // Clients can only view media for their own cases
        if (c.clientId == caller) {
          return media.values().toArray().filter(func(m) { switch (m.caseId) { case (?id) { id == caseId }; case (null) { false } } });
        };
        Runtime.trap("Unauthorized: You don't have access to this case's media");
      };
    };
  };

  // Get all media
  public query ({ caller }) func getAllMedia() : async [Media] {
    if (not isStaffOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only staff can view all media");
    };
    media.values().toArray();
  };

  // SETTINGS
  public shared ({ caller }) func updateSetting(key : Text, value : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update settings");
    };
    let setting : Setting = { key; value };
    settings.add(key, setting);
    logActivity(caller, #admin, "Updated setting", "Setting key: " # key);
  };

  public query ({ caller }) func getSettingByKey(key : Text) : async ?Setting {
    // Anyone can read settings (public information)
    settings.get(key);
  };

  // ACTIVITY LOGS
  func logActivity(userId : Principal, role : AccessControl.UserRole, action : Text, details : Text) : () {
    let logId = nextLogId;
    let log : ActivityLog = { id = logId; userId; role; action; details; timestamp = Time.now() };
    activityLogs.add(logId, log);
    nextLogId += 1;
  };

  // Get recent logs (admin only), up to 1000
  public query ({ caller }) func getRecentLogs(limit : Nat) : async [ActivityLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view logs");
    };
    let validLimit = if (limit > 1000) { 1000 } else { limit };
    let sortedLogEntries = activityLogs.toArray().reverse();
    let limitedLogEntries = sortedLogEntries.sliceToArray(0, validLimit);
    let logsIter = limitedLogEntries.values();
    logsIter.map(func((_, log)) { log }).toArray();
  };

  public query ({ caller }) func getLogsByUser(userId : Principal) : async [ActivityLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view logs");
    };
    activityLogs.values().toArray().filter(func(log) { log.userId == userId });
  };

  // MESSAGES (CASE CHAT)
  public shared ({ caller }) func sendMessage(senderId : Principal, role : AccessControl.UserRole, content : Text, caseId : Nat) : async () {
    // Verify the sender is the caller
    if (senderId != caller) {
      Runtime.trap("Unauthorized: Cannot send messages on behalf of others");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) {
        // Check if caller is authorized for this case
        let isAuthorized = if (isStaffOrAdmin(caller)) {
          // Staff can message any case they're assigned to or if they're admin
          AccessControl.isAdmin(accessControlState, caller) or (switch (c.investigatorId) {
            case (?id) { id == caller };
            case (null) { false };
          });
        } else {
          // Clients can only message their own cases
          c.clientId == caller;
        };

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: You don't have access to this case");
        };

        let msgId = nextMsgId;
        let message = { id = msgId; senderId; role; content; caseId; timestamp = Time.now() };

        let existingMessages = switch (messages.get(caseId)) { case (null) { [] }; case (?msgs) { msgs } };
        messages.add(caseId, existingMessages.concat([message]));
        nextMsgId += 1;
        logActivity(senderId, role, "Sent message", "Case ID: " # caseId.toText());
      };
    };
  };

  func isClientAuthorizedForCase(clientId : Principal, caseId : Nat) : Bool {
    switch (cases.get(caseId)) {
      case (null) { false };
      case (?c) { c.clientId == clientId };
    };
  };

  func isStaffAuthorizedForCase(staffId : Principal, caseId : Nat) : Bool {
    if (AccessControl.isAdmin(accessControlState, staffId)) {
      return true;
    };
    switch (cases.get(caseId)) {
      case (null) { false };
      case (?c) {
        switch (c.investigatorId) {
          case (null) { false };
          case (?id) { id == staffId };
        };
      };
    };
  };

  public query ({ caller }) func getMessagesForCase(caseId : Nat) : async [Message] {
    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) {
        // Check if caller is authorized for this case
        let isAuthorized = if (isStaffOrAdmin(caller)) {
          // Staff can view messages for cases they're assigned to or if they're admin
          AccessControl.isAdmin(accessControlState, caller) or (switch (c.investigatorId) {
            case (?id) { id == caller };
            case (null) { false };
          });
        } else {
          // Clients can only view messages for their own cases
          c.clientId == caller;
        };

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: You don't have access to this case's messages");
        };

        switch (messages.get(caseId)) {
          case (null) { [] };
          case (?msgs) { msgs };
        };
      };
    };
  };

  public query ({ caller }) func getAllMessagesForCase(caseId : Nat, requesterId : Principal) : async [Message] {
    // Verify the requester is the caller
    if (requesterId != caller) {
      Runtime.trap("Unauthorized: Cannot request messages on behalf of others");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) {
        // Check if caller is authorized for this case
        let isAuthorized = if (isStaffOrAdmin(caller)) {
          // Staff can view messages for cases they're assigned to or if they're admin
          AccessControl.isAdmin(accessControlState, caller) or (switch (c.investigatorId) {
            case (?id) { id == caller };
            case (null) { false };
          });
        } else {
          // Clients can only view messages for their own cases
          c.clientId == caller;
        };

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: You don't have access to this case's messages");
        };

        switch (messages.get(caseId)) {
          case (null) { [] };
          case (?msgs) { msgs };
        };
      };
    };
  };
};
