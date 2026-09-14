import {useState} from "react";
import {Link} from "react-router-dom";
import {RxCross1} from "react-icons/rx";
import {IoMenu} from "react-icons/io5";
import {AiFillGift, AiFillSetting} from "react-icons/ai";
import {MdDashboard, MdLocalOffer} from "react-icons/md";
import {RiShoppingBag4Fill} from "react-icons/ri";
import {BsBoxSeamFill} from "react-icons/bs";
import {HiFolderPlus, HiMiniReceiptRefund} from "react-icons/hi2";
import {FaFileCirclePlus} from "react-icons/fa6";
import {FaMoneyBillAlt} from "react-icons/fa";
import {TbMessageChatbotFilled} from "react-icons/tb";

const DashboardSideBar = ({active}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);

    return (
        <div className="relative">
            {/* Menu Button for Mobile & Desktop */}
            <button
                className="block text-gray-700 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <RxCross1 size={30} className="text-purple-600"/> :
                    <IoMenu size={30} className="text-purple-600"/>}
            </button>

            <button
                className="hidden md:block p-2 m-2 text-gray-700"
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            >
                {isDesktopSidebarOpen ? <RxCross1 size={30} className="text-purple-600"/> :
                    <IoMenu size={30} className="text-purple-600"/>}
            </button>

            {/* Sidebar for Mobile */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-500 bg-black/50" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute top-0 left-0 md:left-6 w-72 h-full z-50 rounded-lg bg-white shadow-lg"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end items-center p-4">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-purple-500 hover:shadow-lg"
                            >
                                <RxCross1 size={24}/>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                            <ul className="space-y-2 font-medium">
                                {[
                                    {id: 1, icon: <MdDashboard size={24}/>, text: "Dashboard", to: "/dashboard"},
                                    {
                                        id: 2,
                                        icon: <RiShoppingBag4Fill size={24}/>,
                                        text: "All Orders",
                                        to: "/dashboard-orders"
                                    },
                                    {
                                        id: 3,
                                        icon: <BsBoxSeamFill size={24}/>,
                                        text: "All Products",
                                        to: "/dashboard-products"
                                    },
                                    {
                                        id: 4,
                                        icon: <HiFolderPlus size={24}/>,
                                        text: "Create Product",
                                        to: "/dashboard-create-product"
                                    },
                                    {
                                        id: 5,
                                        icon: <MdLocalOffer size={24}/>,
                                        text: "All Events",
                                        to: "/dashboard-events"
                                    },
                                    {
                                        id: 6,
                                        icon: <FaFileCirclePlus size={24}/>,
                                        text: "Create Event",
                                        to: "/dashboard-create-event"
                                    },
                                    {
                                        id: 7,
                                        icon: <FaMoneyBillAlt size={24}/>,
                                        text: "Withdraw Money",
                                        to: "/dashboard-withdraw-money"
                                    },
                                    {
                                        id: 8,
                                        icon: <TbMessageChatbotFilled size={24}/>,
                                        text: "Shop Inbox",
                                        to: "/dashboard-messages"
                                    },
                                    {
                                        id: 9,
                                        icon: <AiFillGift size={24}/>,
                                        text: "Coupon Codes",
                                        to: "/dashboard-coupons"
                                    },
                                    {
                                        id: 10,
                                        icon: <HiMiniReceiptRefund size={24}/>,
                                        text: "Refunds",
                                        to: "/dashboard-refunds"
                                    },
                                    {id: 11, icon: <AiFillSetting size={24}/>, text: "Settings", to: "/settings"},
                                ].map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center p-3 text-gray-500 rounded-lg hover:bg-purple-100 hover:text-white group transition-colors"
                                        >
                                            <span
                                                className="text-purple-500 group-hover:text-purple-700">{item.icon}</span>
                                            <span
                                                className={`ml-3 ${active === item.id ? "text-purple-700 font-bold drop-shadow-md group-hover:text-white" : ""}`}>
                    {item.text}
                  </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar for Desktop */}
            {isDesktopSidebarOpen && (
                <div
                    className="hidden fixed top-0 left-0  w-80 h-full md:block bg-white shadow-lg rounded-lg p-4 overflow-y-auto"
                    onClick={() => setIsDesktopSidebarOpen(false)}
                >
                    <div className="flex justify-end items-center p-4">
                        <button
                            onClick={() => setIsDesktopSidebarOpen(false)}
                            className="text-purple-500 hover:drop-shadow-sm"
                        >
                            <RxCross1 size={24}/>
                        </button>
                    </div>
                    <ul className="space-y-2 font-medium">
                        {[
                            {id: 1, icon: <MdDashboard size={24}/>, text: "Dashboard", to: "/dashboard"},
                            {id: 2, icon: <RiShoppingBag4Fill size={24}/>, text: "All Orders", to: "/dashboard-orders"},
                            {id: 3, icon: <BsBoxSeamFill size={24}/>, text: "All Products", to: "/dashboard-products"},
                            {
                                id: 4,
                                icon: <HiFolderPlus size={24}/>,
                                text: "Create Product",
                                to: "/dashboard-create-product"
                            },
                            {id: 5, icon: <MdLocalOffer size={24}/>, text: "All Events", to: "/dashboard-events"},
                            {
                                id: 6,
                                icon: <FaFileCirclePlus size={24}/>,
                                text: "Create Event",
                                to: "/dashboard-create-event"
                            },
                            {
                                id: 7,
                                icon: <FaMoneyBillAlt size={24}/>,
                                text: "Withdraw Money",
                                to: "/dashboard-withdraw-money"
                            },
                            {
                                id: 8,
                                icon: <TbMessageChatbotFilled size={24}/>,
                                text: "Shop Inbox",
                                to: "/dashboard-messages"
                            },
                            {id: 9, icon: <AiFillGift size={24}/>, text: "Coupon Codes", to: "/dashboard-coupons"},
                            {id: 10, icon: <HiMiniReceiptRefund size={24}/>, text: "Refunds", to: "/dashboard-refunds"},
                            {id: 11, icon: <AiFillSetting size={24}/>, text: "Settings", to: "/settings"},
                        ].map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.to}
                                    className="flex items-center p-3 text-gray-500 rounded-lg hover:bg-purple-100 hover:text-white group transition-colors"
                                >
                                    <span className="text-purple-500 group-hover:text-purple-700">{item.icon}</span>
                                    <span
                                        className={`ml-3 ${active === item.id ? "text-purple-700 font-bold drop-shadow-md group-hover:text-white" : ""}`}>
                    {item.text}
                  </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DashboardSideBar;
