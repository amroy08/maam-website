import DashboardHeader from "../../Components/Shop/Layout/DashboardHeader.jsx";
import AllRefunds from "../../Components/Shop/AllRefunds.jsx";

const ShopAllRefunds = () => {
    return (
        <>
            <div>
                <DashboardHeader active={10}/>

                <div className="flex items-center justify-between w-full">
                    <div className="w-full justify-center flex mb-4 sm:mb-8 mt-2">
                        <AllRefunds/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopAllRefunds;
