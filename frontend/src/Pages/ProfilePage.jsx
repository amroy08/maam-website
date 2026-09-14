import {useState} from "react";
import Header from "../Components/Layout/Header";
import Loader from "../Components/Layout/Loader";
import ProfileSideBar from "../Components/Profile/ProfileSidebar";
import ProfileContent from "../Components/Profile/ProfileContent";
import { useSelector } from "react-redux";
import {Link} from "react-router-dom";
import {RiShieldStarFill} from "react-icons/ri";


const ProfilePage = () => {
    const { loading, user } = useSelector((state) => state.user);
    const [active, setActive] = useState(1);

    return (
        <div>
          {loading ? (
            <Loader />
          ) : (
        <>
            <Header/>
            <div className="w-11/12 mx-auto bg-white py-10">
                <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8 items-start">
                    {/* Sidebar */}
                    <div className="w-full flex flex-col gap-4 sticky top-24">
                        <ProfileSideBar active={active} setActive={setActive}/>
                        {/* Admin Dashboard Button (only for admin users) */}
                        {user?.role?.toLowerCase() === "admin" && (
                            <Link to="/admin/dashboard" className="w-full">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200">
                                    <span>Admin Dashboard</span>
                                    <RiShieldStarFill className="text-base" />
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-full min-w-0 bg-white rounded-xl border border-gray-150 p-6 md:p-8 shadow-sm">
                        <ProfileContent active={active}/>
                    </div>
                </div>
            </div>
        </>

          )}
        </div>
    );
};

export default ProfilePage;
