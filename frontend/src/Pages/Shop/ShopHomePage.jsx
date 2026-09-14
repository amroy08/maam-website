import ShopInfo from "../../Components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../Components/Shop/ShopProfileData.jsx";

const ShopHomePage = () => {
    return (
        <div className="w-full px-4 md:px-10 mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="w-full flex flex-col md:flex-row py-5 md:py-10 justify-around gap-5 md:gap-8">
                {/* Left Sidebar - Mobile First */}
                <div className="w-full md:w-[25%] bg-white rounded-xl shadow-lg md:h-[90vh] md:overflow-y-scroll
                    md:sticky md:top-10 left-0 z-10 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <ShopInfo isOwner={true}/>
                </div>

                {/* Right Content */}
                <div className="w-full md:w-[72%] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg
                    p-4 md:p-8 transition-all duration-300 hover:shadow-xl">
                    <ShopProfileData isOwner={true}/>
                </div>
            </div>
        </div>
    )
}

export default ShopHomePage