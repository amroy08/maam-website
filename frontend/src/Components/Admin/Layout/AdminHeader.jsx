import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {backend_url} from "../../../server.jsx";
import {RiShoppingBag4Fill} from "react-icons/ri";
import {BsBoxSeamFill, BsFillPeopleFill} from "react-icons/bs";
import AdminSideBar from "./AdminSideBar.jsx";
import {GiShop} from "react-icons/gi";

const AdminHeader = ({active}) => {
    const {user} = useSelector((state) => state.user);

    return (
        <header
            className="w-full h-[70px] bg-white border-b border-gray-100 sticky top-0 left-0 z-30 flex items-center justify-between px-3 sm:px-6">
            {/* Left section with logo & menu */}
            <div className="flex items-center">
                <AdminSideBar active={active}/>
                
                <Link to="/" className="flex items-center ml-2 sm:ml-4">
                    <span
                        className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                        <div className="flex flex-col sm:flex-row sm:items-baseline leading-tight">
                            <span>DivineSoul</span>
                            <span className="sm:ml-1">Marketplace</span>
                        </div>
                    </span>
                </Link>
            </div>

            {/* Right section with icons and avatar */}
            <div className="flex items-center space-x-1 sm:space-x-4">
                <nav className="flex items-center space-x-1 sm:space-x-3">
                    <Link
                        to="/admin-users"
                        className="p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="All Users"
                    >
                        <BsFillPeopleFill
                            className="text-gray-400 hover:text-purple-600 transition-colors text-[28px] sm:text-[29px]"/>
                    </Link>
                    <Link
                        to="/admin-products"
                        className="p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="All Products"
                    >
                        <RiShoppingBag4Fill
                            className="text-gray-400 hover:text-purple-600 transition-colors text-[27px] sm:text-[28px]"/>
                    </Link>
                    <Link
                        to="/admin-orders"
                        className="p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="Orders"
                    >
                        <BsBoxSeamFill
                            className="text-gray-400 hover:text-purple-600 transition-colors text-[24px] sm:text-[27px]"/>
                    </Link>
                </nav>

                <div className="pl-2 sm:pl-4 border-l border-gray-200">
                    <Link to="/profile" className="flex items-center space-x-0 sm:space-x-3">
                        <img
                            src={user?.avatar?.startsWith("http") ? user.avatar : `${backend_url}${user?.avatar}`}
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

export default AdminHeader;