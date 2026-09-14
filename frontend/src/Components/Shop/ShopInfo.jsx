import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import {backend_url, server} from "../../server";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import Loader from "../Layout/Loader";


const ShopInfo = ({isOwner}) => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {products} = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${server}/shop/get-shop-info/${id}`)
            .then((res) => {
                setData(res.data.shop);
                setIsLoading(false);

            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setIsLoading(false);
            });
    }, [dispatch]);

    const logoutHandler = async () => {
        axios.get(`${server}/shop/logout`, {withCredentials: true})
            .then((res) => {
                toast.success("Log Out successful!");
                navigate(`/shop-login`);
                window.location.reload(true);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    // Rating Calculations
    const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0);
    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);
    const averageRating = totalRatings / totalReviewsLength || 0;

    return (<>
        {isLoading ? (<Loader/>) : (<div className="space-y-6 p-4 md:p-6">
            {/* Shop Avatar */}
            <div className="group relative w-max mx-auto">
                <img
                    src={`${backend_url}${data?.avatar}`}
                    className="w-30 h-30 md:w-36 md:h-36 object-cover rounded-full border-4 border-white
            shadow-xl hover:border-purple-200 transition-all duration-300"
                    alt={data?.name}
                />
            </div>

            {/* Shop Name */}
            <h3 className="text-3xl md:text-3xl drop-shadow-md font-medium text-center text-black mt-4
          bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                {data?.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center leading-relaxed px-4 italic
          border-l-4 border-purple-100 bg-gray-50/50 p-4 rounded-lg">
                {data?.description}
            </p>

            {/* Info Sections */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 0a10 10 0 110 20 10 10 0 010-20zm0 1.875a8.125 8.125 0 100 16.25 8.125 8.125 0 000-16.25zM10 15a5 5 0 110-10 5 5 0 010 10zm0-1.875a3.125 3.125 0 100-6.25 3.125 3.125 0 000 6.25z"/>
                        </svg>
                        <span className="font-medium text-gray-700">Address</span>
                    </div>
                    <p className="text-gray-600 pl-7">{data?.address}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        <span className="font-medium text-gray-700">Phone</span>
                    </div>
                    <p className="text-gray-600 pl-7">{data?.phoneNumber}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-600">Total Products</dt>
                    <dd className="mt-1 text-xl md:text-2xl font-semibold text-purple-600">
                        {products && products.length}
                    </dd>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-600">Average Rating</dt>
                    <dd className="mt-1 text-xl md:text-2xl font-semibold text-blue-600">
                        {averageRating.toFixed(1)}
                    </dd>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-600">Joined On</dt>
                    <dd className="mt-1 text-lg md:text-md font-semibold text-blue-600">
                        {data?.createdAt?.slice(0, 10)}
                    </dd>
                </div>
            </div>

            {/* Action Buttons */}
            {isOwner && (<div className="space-y-4 pt-4 px-2 md:px-0">
                <Link to={`/settings`} className="block">
                    <button className="w-full text-sm md:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 md:py-3 rounded-lg font-medium
                transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-200">
                        Edit Shop
                    </button>
                </Link>
                <button onClick={logoutHandler}
                        className="w-full text-sm md:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 md:py-3 rounded-lg font-medium
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-95">
                    Log Out
                </button>
            </div>)}
        </div>)}
    </>);
};

export default ShopInfo;