import DashboardHeader from '../../Components/Shop/Layout/DashboardHeader'
import ShopSettings from "../../Components/Shop/ShopSettings.jsx";

const ShopSettingsPage = () => {
    return (
        <div>
            <DashboardHeader active={11}/>

            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex px-3 mb-4 mt-4 sm:mb-8">
                    <ShopSettings />
                </div>
            </div>
        </div>
    )
}

export default ShopSettingsPage