import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";

const OrderSuccessPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <Success/>
            <Footer/>
        </div>
    );
};

const Success = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
            <div className="relative flex items-center justify-center">
                <img className={"w-[28rem]"}
                     src={"https://img.freepik.com/free-vector/order-confirmed-concept-illustration_114360-1486.jpg"}
                     alt={""}/>
            </div>
            <h5 className="text-center mt-6 mb-14 text-3xl font-semibold text-emerald-600">
                Your order was successful! 😍🎉🎊
            </h5>
        </div>
    );
};

export default OrderSuccessPage;