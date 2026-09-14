import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import styles from "../../Styles/Styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import {getAllProductsShop} from "../../redux/Actions/product.js";
import {getAllEventsShop} from "../../redux/Actions/event.js";
import {backend_url} from "../../server.jsx";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";

const ShopProfileData = ({isOwner}) => {
    const {products} = useSelector((state) => state.products);
    const {events} = useSelector((state) => state.events);
    const {id} = useParams();
    const dispatch = useDispatch();

    const [active, setActive] = useState(1);
    const allReviews = products
        ? products.map((product) => product.reviews || []).flat()
        : [];

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        dispatch(getAllEventsShop(id));
    }, [dispatch, id]);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row w-full items-center sm:items-center justify-around">
                <div className="w-full flex pb-2 sm:pb-0">
                    <div className="flex " onClick={() => setActive(1)}>
                        <h5 className={`font-semibold text-[18px] sm:text-[20px] ${
                            active === 1 ? "text-red-500" : "text-[#333]"
                        } cursor-pointer pr-[20px] sm:pr-[20px]`}>
                            Shop Products
                        </h5>
                    </div>
                    <div className="flex " onClick={() => setActive(2)}>
                        <h5 className={`font-semibold text-[18px] sm:text-[20px] ${
                            active === 2 ? "text-red-500" : "text-[#333]"
                        } cursor-pointer pr-[20px] sm:pr-[20px]`}>
                            Running Events
                        </h5>
                    </div>
                    <div className="flex " onClick={() => setActive(3)}>
                        <h5 className={`font-semibold text-[18px] sm:text-[20px] ${
                            active === 3 ? "text-red-500" : "text-[#333]"
                        } cursor-pointer pr-[20px] sm:pr-[20px]`}>
                            Shop Reviews
                        </h5>
                    </div>
                </div>

                <div className="w-full sm:w-auto sm:mt-0">
                    {isOwner && (
                        <div>
                            <Link to="/dashboard">
                                <div
                                    className={`${styles.button} !rounded-lg h-[36px] sm:h-[42px] text-lg sm:text-base`}>
                                    <span className="text-[#fff]">Go Dashboard</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>


            {active === 1 && (
                <div
                    className="grid grid-cols-1 gap-[15px] xs:gap-[20px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12 border-0">
                    {products?.map((product, index) => (
                        <ProductCard data={product} key={index} isShop={true}/>
                    ))}
                </div>
            )}

            {active === 2 && (
                <div className="w-full">
                    <div
                        className="grid grid-cols-1 gap-[15px] xs:gap-[20px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12 border-0">
                        {events?.map((event, index) => (
                            <ProductCard
                                data={event}
                                key={index}
                                isShop={true}
                                isEvent={true}
                            />
                        ))}
                    </div>
                    {events?.length === 0 && (
                        <h5 className="w-full text-center py-5 text-[18px]">
                            No Events available for this shop!
                        </h5>
                    )}
                </div>
            )}

            {active === 3 && (
                <div className="w-full h-full flex flex-col items-center py-4 overflow-y-scroll">
                    {allReviews.map((item) => (  // Fixed: Remove .reviews
                        <div key={item._id} className="w-full bg-white rounded-lg p-4 shadow-sm mb-3">
                            <div className="flex items-start gap-3">
                                <img
                                    src={`${backend_url}${item?.user?.avatar}`}
                                    alt={item.user.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                                />
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <h3 className="text-gray-900 font-medium">{item.user.name}</h3>
                                        <span className="text-xs text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {products.name}
                                        </span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <AiFillStar
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < item.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {allReviews.length === 0 && (  // Fixed: Check allReviews directly
                        <div className="w-full text-center py-8">
                            <div className="max-w-md mx-auto text-gray-500">
                                <AiOutlineStar className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                                <p className="font-medium">
                                    No reviews yet. Be the first to share your experience!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopProfileData;