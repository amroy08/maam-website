import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {toast} from "react-toastify";
import Loader from "../Components/Layout/Loader.jsx";

const ProtectedRoute = ({children}) => {
    const {loading, isAuthenticated} = useSelector((state) => state.user);
    if (loading === true) {
        return (
            <Loader/>
        )
    } else {
        if (!isAuthenticated) {
            toast.info(`Please login to Continue`);
            return <Navigate to="/login" replace/>;
        }
        return children;
    }
};

export default ProtectedRoute;
