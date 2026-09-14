import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllShops from "../../Components/Admin/AllShops.jsx";

const AdminDashboardSellers = () => {
    return (
        <div>
            <AdminHeader active={3}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllShops />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSellers;
