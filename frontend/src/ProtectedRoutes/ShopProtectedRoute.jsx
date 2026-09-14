import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {toast} from "react-toastify";
import Loader from "../Components/Layout/Loader.jsx";

const ShopProtectedRoute = ({children}) => {
    const {isLoading, isShop} = useSelector((state) => state.shop);
    if (isLoading === true) {
        return (
            <Loader/>
        )
    } else {
        if (!isShop) {
            toast.info(`Please login to Continue`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return <Navigate to={`/`} replace/>;
        }
        return children;
    }
};

export default ShopProtectedRoute;
