import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";
import CheckoutSteps from "../Components/Checkout/CheckoutSteps.jsx";
import Checkout from "../Components/Checkout/Checkout.jsx";

const CheckoutPage = () => {
    return (
        <>
            <div>
                <Header/>
                <br/>
                <CheckoutSteps active={1}/>
                <Checkout/>
                <Footer/>
            </div>
        </>
    )
}

export default CheckoutPage;
