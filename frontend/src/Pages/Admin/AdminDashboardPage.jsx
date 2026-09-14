import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AdminDashboardMain from "../../Components/Admin/AdminDashboardMain.jsx";

const AdminDashboardPage = () => {
    return (
        <div>
            <AdminHeader active={1}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AdminDashboardMain />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
