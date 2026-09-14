import DashboardHeader from "../../Components/Shop/Layout/DashboardHeader.jsx";
import AllEvents from "../../Components/Shop/AllEvents.jsx";

const ShopAllEvents = () => {
    return (
        <>
            <div>
                <DashboardHeader active={5}/>

                <div className="flex items-center justify-between w-full">
                    <div className="w-full justify-center flex mb-4 sm:mb-8">
                        <AllEvents/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopAllEvents;
