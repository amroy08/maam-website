import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllUsers from "../../Components/Admin/AllUsers.jsx";

const AdminDashboardUsers = () => {
    return (
        <div>
            <AdminHeader active={4}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllUsers />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardUsers;
