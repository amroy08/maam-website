import DashboardHeader from "../../Components/Shop/Layout/DashboardHeader.jsx";
import AllCoupons from "../../Components/Shop/AllCoupons.jsx";

const ShopAllCoupons = () => {
    return (
        <>
            <div>
                <DashboardHeader active={9}/>

                <div className="flex items-center justify-between w-full">
                    <div className="w-full justify-center flex mb-4 sm:mb-8">
                        <AllCoupons/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopAllCoupons;
