import {AiFillGift} from "react-icons/ai";
import {MdLocalOffer} from "react-icons/md";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {backend_url} from "../../../server.jsx";
import {RiShoppingBag4Fill} from "react-icons/ri";
import {BsBoxSeamFill} from "react-icons/bs";
import {TbMessageChatbotFilled} from "react-icons/tb";
import AdminSideBar from "../../Admin/Layout/AdminSideBar.jsx";

const DashboardHeader = ({active}) => {
    const {shop} = useSelector((state) => state.shop);
    const {user} = useSelector((state) => state.user);

    const displayName = shop?.name || user?.name || "Admin";
    const displayAvatar = shop?.avatar || user?.avatar || "uploads/default.png";

    return (
        <header className="w-full h-[70px] bg-white border-b border-gray-100 sticky top-0 left-0 z-30 flex items-center justify-between px-3 sm:px-6">
            {/* Left section with Admin Sidebar */}
            <div className="flex items-center">
                <AdminSideBar active={active} />

                <Link to="/" className="flex items-center ml-1.5 sm:ml-4">
                    <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                        <div className="flex flex-col sm:flex-row sm:items-baseline leading-tight">
                            <span>DivineSoul</span>
                            <span className="sm:ml-1">Marketplace</span>
                        </div>
                    </span>
                </Link>
            </div>
            <div className="flex items-center justify-end space-x-2 md:space-x-5">
                <Link to="/admin-manage-coupons" title="Coupons">
                    <AiFillGift className="text-gray-400 hover:text-purple-700 transition-colors" size={25}/>
                </Link>
                <Link to="/admin-events" title="Events">
                    <MdLocalOffer className="text-gray-400 hover:text-purple-700 transition-colors" size={25}/>
                </Link>
                <Link to="/admin-products" title="Products">
                    <RiShoppingBag4Fill className="text-gray-400 hover:text-purple-700 transition-colors" size={25}/>
                </Link>
                <Link to="/admin-orders" title="Orders">
                    <BsBoxSeamFill className="text-gray-400 hover:text-purple-700 transition-colors" size={24}/>
                </Link>
                <div className="sm:pl-4 sm:border-l border-gray-200">
                    <Link to="/profile" className="flex items-center sm:space-x-3">
                        <img
                            src={displayAvatar?.startsWith("http") ? displayAvatar : `${backend_url}${displayAvatar}`}
                            alt="Admin Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-155 shadow-sm hover:scale-105 transition-transform"
                            onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;