import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllOrders from "../../Components/Admin/AllOrders.jsx";

const AdminDashboardOrders = () => {
    return (
        <div>
            <AdminHeader active={2}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllOrders />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOrders;
