import {IoLogoWhatsapp} from "react-icons/io";
import {MdEmail} from "react-icons/md";
import {useLocation} from "react-router-dom";

const FloatingButtons = () => {
    const location = useLocation();
    const whatsappNumber = "+919876543210";
    const emailAddress = "hello@divinesoul.in";
    const whatsappMessage = encodeURIComponent("Hello! I need some assistance with DivineSoul.");

    // Don't show floating buttons on admin pages
    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
            {/* Email Button */}
            <a
                href={`mailto:${emailAddress}?subject=Inquiry&body=Hi Support,`}
                className="w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95 group relative"
                aria-label="Email Support"
            >
                <MdEmail size={24} />
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-250">
                    Email Support
                </span>
            </a>

            {/* WhatsApp Button */}
            <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95 group relative"
                aria-label="Chat on WhatsApp"
            >
                <IoLogoWhatsapp size={26} />
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-250">
                    WhatsApp Chat
                </span>
            </a>
        </div>
    );
};

export default FloatingButtons;
