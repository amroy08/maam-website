import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {server} from "../../server";
import {toast} from "react-toastify";
import {AiFillSetting, AiOutlineHeart, AiOutlineLock} from "react-icons/ai";
import {FiUser, FiShoppingBag, FiCreditCard, FiMapPin, FiLogOut} from "react-icons/fi";
import {MdOutlineTrackChanges, MdOutlineKeyboardArrowRight} from "react-icons/md";

const ProfileSidebar = ({setActive, active}) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        axios
            .get(`${server}/user/logout`, {withCredentials: true})
            .then(() => {
                toast.success("Logged out successfully!");
                navigate(`/login`);
                window.location.reload();
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Logout failed");
            });
    };

    const menuItems = [
        { id: 1, label: "Profile Details", icon: <FiUser size={18} /> },
        { id: 2, label: "All Orders", icon: <FiShoppingBag size={18} /> },
        { id: 3, label: "Refunds Status", icon: <FiCreditCard size={18} /> },
        { id: 4, label: "Inbox Messages", icon: <FiUser size={18} />, action: () => navigate("/inbox") },
        { id: 5, label: "Track My Orders", icon: <MdOutlineTrackChanges size={18} /> },
        { id: 6, label: "Change Password", icon: <AiOutlineLock size={18} /> },
        { id: 7, label: "Manage Address", icon: <FiMapPin size={18} /> },
    ];

    return (
        <div className="w-full bg-white rounded-xl border border-gray-150 p-4 shadow-sm flex flex-col gap-1 shrink-0">
            <div className="px-3 py-2.5 border-b border-gray-50 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account settings</span>
            </div>

            {menuItems.map((item) => {
                const isSelected = active === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.action) item.action();
                            else setActive(item.id);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all group ${
                            isSelected
                                ? "bg-violet-50 text-violet-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={isSelected ? "text-violet-700" : "text-gray-400 group-hover:text-gray-600"}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </div>
                        <MdOutlineKeyboardArrowRight
                            size={16}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                isSelected ? "text-violet-700 opacity-100" : "text-gray-400"
                            }`}
                        />
                    </button>
                );
            })}

            <div style={{height: 1}} className="bg-gray-100 my-2" />

            <button
                onClick={logoutHandler}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <FiLogOut size={18} className="text-red-400 group-hover:text-red-600" />
                    <span>Logout</span>
                </div>
                <MdOutlineKeyboardArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
            </button>
        </div>
    );
};

export default ProfileSidebar;
