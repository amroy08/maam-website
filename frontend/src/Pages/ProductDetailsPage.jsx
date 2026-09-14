import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";
import ProductDetails from "../Components/Products/ProductDetails";
import SuggestedProduct from "../Components/Products/SuggestedProduct.jsx";
import {useSelector} from "react-redux";
import Loader from "../Components/Layout/Loader.jsx";

const ProductDetailsPage = () => {
    const {allProducts} = useSelector((state) => state.products);
    const {allEvents} = useSelector((state) => state.events);
    const {id} = useParams();
    const [productData, setProductData] = useState(null);
    const [searchParams] = useSearchParams();
    const eventData = searchParams.get("isEvent");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (eventData !== null) {
            if (allEvents?.length > 0) {
                const foundProduct = allEvents.find((product) => product._id === id);
                setProductData(foundProduct || null);
            }
        }
        else {
            if (allProducts?.length > 0) {
                const foundProduct = allProducts.find((product) => product._id === id);
                setProductData(foundProduct || null);
            }
        }
    }, [allEvents, allProducts, eventData, id]);

    return (
        <div>
            <Header/>
            {productData ? <ProductDetails data={productData}/> : <Loader/>}
            {
                !eventData && productData && (
                    <SuggestedProduct data={productData}/>
                )
            }
            <Footer/>
        </div>
    );
};

export default ProductDetailsPage;
