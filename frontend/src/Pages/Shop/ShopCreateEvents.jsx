import DashboardHeader from '../../Components/Shop/Layout/DashboardHeader'
import CreateEvent from "../../Components/Shop/CreateEvent.jsx";

const ShopCreateEvents = () => {
    return (
        <div>
            <DashboardHeader active={6}/>

            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4 mt-3 sm:mb-8">
                    <CreateEvent/>
                </div>
            </div>
        </div>
    )
}

export default ShopCreateEvents