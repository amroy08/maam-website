import DashboardHeader from '../../Components/Shop/Layout/DashboardHeader'
import CreateProduct from "../../Components/Shop/CreateProduct.jsx";

const ShopCreateProduct = () => {
    return (
        <div>
            <DashboardHeader active={4}/>

            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4 mt-3 sm:mb-8">
                    <CreateProduct />
                </div>
            </div>
        </div>
    )
}

export default ShopCreateProduct