import AdminHeader from "../../Components/Admin/Layout/AdminHeader.jsx";
import AllEvents from "../../Components/Admin/AllEvents.jsx";

const AdminDashboardEvents = () => {
    return (
        <div>
            <AdminHeader active={6}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <AllEvents />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardEvents;
