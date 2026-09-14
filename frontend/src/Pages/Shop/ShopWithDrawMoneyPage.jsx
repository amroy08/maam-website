import DashboardHeader from "../../Components/Shop/Layout/DashboardHeader.jsx";
import WithdrawMoney from "../../Components/Shop/WithdrawMoney.jsx";

const ShopWithDrawMoneyPage = () => {
    return (
        <div>
            <DashboardHeader active={7}/>
            <div className="flex items-center justify-between w-full">
                <div className="w-full justify-center flex mb-4">
                    <WithdrawMoney/>
                </div>
            </div>
        </div>
    )
}

export default ShopWithDrawMoneyPage;
