import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllWithdraw from "../../Components/Admin/AllWithdraw.jsx";

const AdminDashboardWithdraw = () => {
    return (
        <div>
            <AdminHeader active={7}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllWithdraw />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardWithdraw;
