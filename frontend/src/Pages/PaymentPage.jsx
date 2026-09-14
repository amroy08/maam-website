import CheckoutSteps from '../Components/Checkout/CheckoutSteps'
import Footer from '../Components/Layout/Footer'
import Header from '../Components/Layout/Header'
import Payment from "../Components/Payment/Payment";

const PaymentPage = () => {
    return (
        <div className=' '>
            <Header/>
            <br/>
            <CheckoutSteps active={2}/>
            <Payment/>
            <br/>
            <Footer/>
        </div>
    )
}

export default PaymentPage