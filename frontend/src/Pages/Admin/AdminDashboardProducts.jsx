import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllProducts from "../../Components/Admin/AllProducts.jsx";

const AdminDashboardProducts = () => {
    return (
        <div>
            <AdminHeader active={6}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllProducts />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardProducts;
