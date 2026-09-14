import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllCategories from "../../Components/Admin/AllCategories.jsx";

const AdminDashboardCategories = () => {
    return (
        <div>
            <AdminHeader active={11}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllCategories />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardCategories;
