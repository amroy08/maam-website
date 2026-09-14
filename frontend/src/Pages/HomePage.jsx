import Header from "../Components/Layout/Header";
import {useLocation} from "react-router";
import {useEffect} from "react";
import {toast} from "react-toastify";
import Hero from "../Components/Route/Hero/Hero.jsx";
import Categories from "../Components/Route/Categories/Categories";
import BestDeals from "../Components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../Components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../Components/Events/Events";
import Sponsored from "../Components/Route/Sponsored";
import Footer from "../Components/Layout/Footer";

const HomePage = () => {
    const location = useLocation();
    window.scrollTo(0, 0);

    useEffect(() => {
        const loginSuccess = sessionStorage.getItem("loginSuccess");
        if (loginSuccess) {
            toast.success("Login Success!", {
                position: "top-right",
                autoClose: 3000,
            });

            setTimeout(() => {
                sessionStorage.removeItem("loginSuccess");
            }, 3000);
        }
    }, [location]);

    return (
        <div className="bg-white page-enter">
            <Header activeHeading={1}/>
            <Hero/>
            <Categories/>
            <BestDeals/>
            <Events/>
            <FeaturedProduct/>
            <Sponsored/>
            <Footer/>
        </div>
    )
}

export default HomePage