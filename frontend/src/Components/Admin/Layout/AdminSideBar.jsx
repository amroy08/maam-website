import {useState} from "react";
import {Link} from "react-router-dom";
import {RxCross1} from "react-icons/rx";
import {IoMenu, IoChatbubblesSharp} from "react-icons/io5";
import {AiFillSetting} from "react-icons/ai";
import {MdDashboard, MdLocalOffer, MdAddBox} from "react-icons/md";
import {RiShoppingBag4Fill} from "react-icons/ri";
import {BsBoxSeamFill, BsFillPeopleFill, BsTagFill} from "react-icons/bs";
import {FaClipboardList, FaPlus} from "react-icons/fa";
import {FaRegImage} from "react-icons/fa6";

const navItems = [
    {id: 1, icon: <MdDashboard size={22}/>, text: "Dashboard", to: "/admin/dashboard"},
    {id: 2, icon: <BsBoxSeamFill size={20}/>, text: "All Orders", to: "/admin-orders"},
    {id: 3, icon: <RiShoppingBag4Fill size={22}/>, text: "All Products", to: "/admin-products"},
    {id: 4, icon: <MdAddBox size={22}/>, text: "Add Product", to: "/admin-create-product"},
    {id: 5, icon: <MdLocalOffer size={22}/>, text: "All Events", to: "/admin-events"},
    {id: 6, icon: <FaPlus size={18}/>, text: "Create Event", to: "/admin-create-event"},
    {id: 7, icon: <BsTagFill size={20}/>, text: "Categories", to: "/admin-categories"},
    {id: 8, icon: <BsTagFill size={20}/>, text: "Coupons", to: "/admin-manage-coupons"},
    {id: 9, icon: <FaClipboardList size={20}/>, text: "Refunds", to: "/admin-refunds"},
    {id: 10, icon: <BsFillPeopleFill size={22}/>, text: "All Users", to: "/admin-users"},
    {id: 12, icon: <IoChatbubblesSharp size={20}/>, text: "Support Inbox", to: "/admin-support-inbox"},
    {id: 13, icon: <FaRegImage size={20}/>, text: "Hero Slides", to: "/admin-hero-settings"},
    {id: 11, icon: <AiFillSetting size={22}/>, text: "Settings", to: "/profile"},
];

const SidebarLink = ({item, active, onClick}) => (
    <li>
        <Link
            to={item.to}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active === item.id
                ? "bg-purple-100 text-purple-700 font-semibold shadow-sm"
                : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"}`}
        >
            <span className={`transition-colors ${active === item.id ? "text-purple-700" : "text-purple-400 group-hover:text-purple-600"}`}>
                {item.icon}
            </span>
            <span className="text-sm">{item.text}</span>
        </Link>
    </li>
);

const SidebarContent = ({active, onClose}) => (
    <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
            <span className="text-purple-700 font-bold text-lg">Admin Panel</span>
            <button onClick={onClose} className="text-gray-400 hover:text-purple-600 transition-colors">
                <RxCross1 size={20}/>
            </button>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
                {navItems.map((item) => (
                    <SidebarLink key={item.id} item={item} active={active} onClick={onClose}/>
                ))}
            </ul>
        </nav>
    </div>
);

const AdminSideBar = ({active}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);

    return (<div className="relative">
        {/* Mobile hamburger */}
        <button
            className="block text-gray-700 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <RxCross1 size={30} className="text-purple-600"/> :
                <IoMenu size={30} className="text-purple-600"/>}
        </button>

        {/* Desktop hamburger */}
        <button
            className="hidden md:block p-2 m-2 text-gray-700"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        >
            {isDesktopSidebarOpen ? <RxCross1 size={30} className="text-purple-600"/> :
                <IoMenu size={30} className="text-purple-600"/>}
        </button>

        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
                <div
                    className="absolute top-0 left-0 w-72 h-full z-50 bg-white shadow-2xl rounded-r-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <SidebarContent active={active} onClose={() => setIsMenuOpen(false)}/>
                </div>
            </div>
        )}

        {/* Desktop Sidebar Overlay */}
        {isDesktopSidebarOpen && (
            <div
                className="hidden md:block fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                onClick={() => setIsDesktopSidebarOpen(false)}
            >
                <div
                    className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl rounded-r-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <SidebarContent active={active} onClose={() => setIsDesktopSidebarOpen(false)}/>
                </div>
            </div>
        )}
    </div>);
};

export default AdminSideBar;
