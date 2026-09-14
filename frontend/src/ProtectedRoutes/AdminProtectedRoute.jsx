import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {toast} from "react-toastify";
import Loader from "../Components/Layout/Loader.jsx";

const ProtectedAdminRoute = ({children}) => {
    const {loading, isAuthenticated, user} = useSelector((state) => state.user);

    if (loading) {
        return <Loader/>;
    }

    if (!isAuthenticated) {
        toast.info(`Please login to Continue`);
        return <Navigate to="/login" replace/>;
    }

    // Case-insensitive check
    if (user.role !== "admin") {
        toast.info(`You're not authorized to access this page`);
        return <Navigate to="/" replace/>;
    }

    return children;
};

export default ProtectedAdminRoute;