import DashboardHeader from "../../Components/Shop/Layout/DashboardHeader.jsx";
import AllOrders from "../../Components/Shop/AllOrders.jsx";

const ShopAllOrders = () => {
    return (
        <>
            <div>
                <DashboardHeader active={2}/>
                <div className="flex items-center justify-between w-full">
                    <div className="w-full justify-center flex mb-4 mt-2 sm:mb-8">
                        <AllOrders/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopAllOrders;
