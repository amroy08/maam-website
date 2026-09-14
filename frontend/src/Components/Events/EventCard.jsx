import CountDown from "./CountDown";
import {Link} from "react-router-dom";
import {AiOutlineShoppingCart} from "react-icons/ai";
import {backend_url} from "../../server.jsx";
import {addToCart} from "../../redux/Actions/cart.js";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";

const EventCard = ({ active, data }) => {
    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // Check if data is undefined or null
    if (!data) {
        return (
            <div className="w-full bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-600">No event data available.</p>
            </div>
        );
    }

    const hasDiscount = data.discountPrice > 0;

    const addToCartHandler = () => {
        if (data.stock < 1) {
            toast.error("Product stock limited!");
            return;
        }
        if (cart?.find((i) => i._id === data._id)) {
            toast.error("Item already in Cart! Please check your cart. ");
            return;
        }
        dispatch(addToCart({...data, qty: 1})); // Use `count` instead of hardcoded `qty: 1`
        toast.success("Item added to Cart!");
    };

    // Calculate discount percentage
    const discountPercentage = hasDiscount
        ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
        : 0;

    return (
        <div
            className={`w-full bg-white rounded-xl ${active ? "mb-8" : "mb-4"} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200`}
        >
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-[45%] relative group overflow-hidden">
                    <img
                        src={`${backend_url}uploads/${data?.images?.[0]}`}
                        alt="Events"
                        className="w-full h-64 md:h-[32rem] object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div>
                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm">
                                {discountPercentage}% OFF
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-[55%] p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900 font-display">
                            {data.name}
                        </h2>

                        <p className="text-gray-600 mb-4 text-base line-clamp-3 leading-relaxed">
                            {data.description}
                        </p>

                        <div className="flex flex-row items-start md:items-center justify-between mb-6 gap-3">
                            <div className="flex items-baseline gap-3">
                <span
                    className="text-3xl font-bold font-sans bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{data.discountPrice}
                </span>
                                <span className=" font-sans text-xl line-through font-medium text-red-400">
                  ₹{data.originalPrice}
                </span>
                            </div>
                            <span
                                className="bg-pink-100 text-pink-800 px-3 py-1.5 rounded-full text-sm md:text-md font-medium inline-flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                {data.sold_out} units sold
              </span>
                        </div>
                    </div>

                    <div>
                        <div className="mb-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                                    ⏳ Hurry up! Sale ends in
                                </h3>
                                <div className="flex justify-center">
                                    <CountDown data={data} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                onClick={addToCartHandler} // Add click handler
                                disabled={data.stock < 1} // Disable button if out of stock
                            >
                                <AiOutlineShoppingCart className="text-xl"/>
                                Add to Cart
                            </button>
                            <Link
                                to={`/product/${data._id}?isEvent=true`}
                                className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-center"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;