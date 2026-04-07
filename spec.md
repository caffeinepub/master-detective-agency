# Master Detective – Professional Detective Agency Platform

## Current State
New project. No existing files except scaffolded backend and empty actor.

## Requested Changes (Diff)

### Add
- Multi-role auth system: Admin, Staff/Sub-Admin, Client (mobile + password)
- Admin dashboard with full CMS control (header, footer, menus, pages, sliders)
- Case Management: create, assign, status tracking (Pending/Active/Closed), evidence upload, notes
- Client Management: add/edit clients, KYC uploads, contact details, case history
- Staff Management: add investigators, assign roles, activity tracking
- Inquiry Management: receive/approve/reject inquiries from public form
- Public website: Home, About, Services (4 types), Case Studies, Contact, Gallery, FAQ, Privacy Policy, T&C
- Client portal: case status tracking, document upload
- Media/Gallery system: camera + gallery upload, organized folders
- PWA manifest + service worker for "Add to Home Screen" / APK readiness
- SEO meta tags editor per page
- Settings panel: site name, logo, theme color, SMTP setup placeholders
- Activity logs & role-based access control
- WhatsApp chat button + Call Now button on public pages
- Legal disclaimer on all public pages
- Dark red & black premium detective theme

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User/auth store with roles: admin, staff, client
- Cases store: case CRUD, status, investigator assignment, notes
- Clients store: client profiles, KYC file references
- Staff store: investigator profiles, roles
- Inquiries store: public inquiry submissions, approve/reject
- Media store: file references (blob-storage handles actual files)
- Settings store: key-value site settings
- Activity logs store

### Frontend
- Dark red+black premium theme (OKLCH tokens)
- Public pages: Home, About, Services, Case Studies, Contact, Gallery, FAQ, Privacy, Terms
- Auth pages: Admin login, Client login
- Admin dashboard: Cases, Clients, Staff, Inquiries, Media, Settings, Logs
- Client portal: My Cases, Upload Documents
- PWA: manifest.json, service-worker.js
- Floating WhatsApp + Call buttons
- Legal disclaimer footer
