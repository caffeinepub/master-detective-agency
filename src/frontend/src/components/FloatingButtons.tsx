import { MessageCircle, Phone } from "lucide-react";

interface FloatingButtonsProps {
  whatsappNumber?: string;
  callNumber?: string;
}

export function FloatingButtons({
  whatsappNumber = "919876543210",
  callNumber = "+919876543210",
}: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "#25D366", width: 52, height: 52 }}
        aria-label="Chat on WhatsApp"
        data-ocid="nav.link"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
      {/* Call */}
      <a
        href={`tel:${callNumber}`}
        className="w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "oklch(0.42 0.16 25)", width: 52, height: 52 }}
        aria-label="Call Now"
        data-ocid="nav.link"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
