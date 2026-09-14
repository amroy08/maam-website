import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    AiFillHeart,
    AiFillStar,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
    AiOutlineStar,
    AiOutlineDelete
} from "react-icons/ai";
import styles from "../../Styles/Styles.jsx";
import {backend_url, server} from "../../server.jsx";
import {toast} from "react-toastify";
import {addToCart} from "../../redux/Actions/cart.js";
import {useDispatch, useSelector} from "react-redux";
import {addToWishlist, removeFromWishlist} from "../../redux/Actions/wishlist.js";
import {getAllProducts} from "../../redux/Actions/product.js";
import axios from "axios";

const ProductDetails = ({data}) => {
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(0);
    const {cart} = useSelector((state) => state.cart);
    const {shop} = useSelector((state) => state.shop);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const {products} = useSelector((state) => state.products);
    const {wishlist} = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Zoom state
    const [zoomStyle, setZoomStyle] = useState({ display: "none" });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomStyle({
            display: "block",
            backgroundImage: `url(${backend_url}uploads/${data.images[select]})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: "200%"
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: "none" });
    };

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const incrementCount = () => {
        if (count < data.stock) {
            setCount(count + 1);
        } else {
            toast.error("Cannot exceed available stock!");
        }
    };

    const addToCartHandler = () => {
        if (data.stock < 1) {
            toast.error("Product stock limited!");
            return;
        }
        if (cart?.find((i) => i._id === data._id)) {
            toast.error("Item already in Cart! Please check your cart. ");
            return;
        }
        dispatch(addToCart({...data, qty: count})); // Use `count` instead of hardcoded `qty: 1`
        toast.success("Item added to Cart!");
    };

    useEffect(() => {
        window.scroll(0, 0);

        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist, data._id]); // Added data._id to dependency array

    const handleWishlist = () => {
        if (click) {
            dispatch(removeFromWishlist(data)); // Pass ID instead of full object
            toast.success("Item removed from Wishlist!");
        } else {
            dispatch(addToWishlist(data));
            toast.success("Item added to Wishlist!");
        }
        setClick(!click);
    };


    const totalReviewsLength =
        products &&
        products.reduce((acc, product) => acc + product.reviews.length, 0);

    const totalRatings =
        products &&
        products.reduce(
            (acc, product) =>
                acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
            0
        );

    const avg = totalRatings / totalReviewsLength || 0;

    const averageRating = avg.toFixed(2);

    const handleMessageSubmit = async () => {
        if (isAuthenticated) {
            const groupTitle = data._id + user._id;
            const userId = user._id;
            const shopId = data?.shop._id;
            await axios
                .post(`${server}/conversation/create-new-conversation`, {
                    groupTitle,
                    userId,
                    shopId,
                })
                .then((res) => {
                    navigate(`/inbox?${res.data.conversation._id}`);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        } else {
            toast.error("Please login to create a conversation");
        }
    };

    // Filter related products
    const relatedProducts = products 
        ? products.filter(p => p.category === data.category && p._id !== data._id).slice(0, 4) 
        : [];

    return (
        <section className="py-8 bg-white md:py-16 antialiased">
            {data ? (
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        {/* Image Gallery */}
                        <div className="shrink-0 max-w-sm lg:max-w-lg mx-auto w-full">
                            <div className="bg-gray-50 p-4 rounded-xl relative overflow-hidden group select-none">
                                {data.images && data.images.length > 0 && (
                                    <div className="relative overflow-hidden cursor-zoom-in">
                                        <img
                                            src={`${backend_url}uploads/${data.images[select]}`}
                                            alt="Main product display"
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                            className="w-full h-[300px] sm:h-[400px] object-contain rounded-lg transition-transform duration-200"
                                        />
                                        {/* Zoom Box Overlay */}
                                        <div 
                                            style={zoomStyle} 
                                            className="absolute inset-0 pointer-events-none rounded-lg bg-no-repeat hidden md:block"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-4 overflow-x-auto py-1">
                                {data.images &&
                                    data.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`border-2 rounded-lg p-1 cursor-pointer transition-colors ${
                                                select === index ? "border-violet-600" : "border-gray-200 hover:border-gray-400"
                                            }`}
                                            onMouseEnter={() => setSelect(index)}
                                            onClick={() => setSelect(index)}
                                        >
                                            <img
                                                src={`${backend_url}uploads/${img}`}
                                                alt={`Product thumbnail ${index + 1}`}
                                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-md"
                                            />
                                        </div>
                                    ))}

                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="w-full 800px:w-[50%] pt-5">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
                            <p className="text-gray-600 mb-4">{data.description}</p>
                            {/* Price Section */}
                            <div className="flex items-baseline mb-6">
                                <h4 className="text-3xl font-sans font-bold text-gray-900">
                                    ₹{data.discountPrice || data.originalPrice}
                                </h4>
                                {data.discountPrice && data.originalPrice > data.discountPrice && (
                                    <span className="text-sm text-gray-400 line-through ml-3">
                                        ₹{data.originalPrice}
                                    </span>
                                )}
                            </div>

                            {/* Quantity selection */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-semibold text-gray-500">Quantity:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={decrementCount}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors rounded-l-lg"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-gray-900">
                                        {count}
                                    </span>
                                    <button
                                        onClick={incrementCount}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">
                                    ({data.stock} items left)
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                <button
                                    className="flex items-center justify-center w-full py-2.5 px-5 mb-4 sm:mb-0 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
                                    onClick={handleWishlist} // Use single handler
                                >
                                    {click ? (
                                        <AiFillHeart
                                            size={20}
                                            className="cursor-pointer mr-2 hover:scale-110 transition-transform"
                                            color="red"
                                            title="Remove from wishlist"
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            size={20}
                                            className="cursor-pointer mr-2 hover:scale-110 transition-transform"
                                            color="gray"
                                            title="Add to wishlist"
                                        />
                                    )}
                                    {click ? "Remove from favorites" : "Add to favorites"}
                                </button>

                                <button
                                    onClick={addToCartHandler} // Add click handler
                                    disabled={data.stock < 1} // Disable button if out of stock
                                    className="w-full flex items-center justify-center text-white bg-violet-600 hover:bg-violet-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                >
                                    <AiOutlineShoppingCart className="w-5 h-5 mr-2"/>
                                    Add to cart
                                </button>

                                <button
                                    onClick={() => {
                                        if (data.stock < 1) {
                                            toast.error("Product is out of stock!");
                                            return;
                                        }
                                        // Save quantity to cart first
                                        dispatch(addToCart({ ...data, qty: count }));
                                        // Directly route to checkout
                                        navigate("/checkout");
                                    }}
                                    disabled={data.stock < 1}
                                    className="w-full flex items-center justify-center text-white bg-[#0a0a0a] hover:bg-black font-semibold rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Seller Info Removed */}
                        </div>
                    </div>

                    <ProductDetailsInfo
                        data={data} products={products}
                        totalReviewsLength={totalReviewsLength}
                        averageRating={averageRating}
                    />

                    {/* Related Products Recommendation */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                You May Also Like
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {relatedProducts.map((item) => (
                                    <ProductCard key={item._id} data={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </section>
    );
};

const ProductDetailsInfo = ({data, products, averageRating, totalReviewsLength}) => {
    const [active, setActive] = useState(1);

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mt-8">
            <div className="w-full flex justify-between border-b border-gray-200">
                {[1, 2].map((tab) => (
                    <div key={tab} className="relative flex-1 text-center">
                        <button
                            className={`w-full py-6 text-lg font-medium transition-colors ${
                                active === tab
                                    ? "text-pink-600 bg-pink-50/50"
                                    : "text-gray-600 hover:bg-gray-50"
                             }`}
                            onClick={() => setActive(tab)}
                        >
                            {['Product Details', 'Product Reviews'][tab - 1]}
                            {active === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"/>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="p-4 bg-gray-50/50">
                {active === 1 && (
                    <article className="prose prose-lg max-w-none text-gray-600">
                        <div className="space-y-4 leading-relaxed whitespace-pre-line">
                            {data.description}
                            <br/>
                            <br/>
                            {data.description}
                        </div>
                    </article>
                )}

                {active === 2 && (
                    <div className="w-full h-[35vh] flex flex-col items-center py-4 overflow-y-scroll">
                        {data && data.reviews.map((item) => (
                            <div key={item._id} className="w-full bg-white rounded-lg p-4 shadow-sm mb-3">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={
                                            item?.user?.avatar
                                                ? item.user.avatar.startsWith("http")
                                                    ? item.user.avatar
                                                    : `${backend_url}${item.user.avatar.startsWith("/") ? item.user.avatar.slice(1) : item.user.avatar}`
                                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                        }
                                        alt={item.user.name}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-3 mb-1">
                                                <h3 className="text-gray-900 font-medium">{item.user.name}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
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

                        {data && data.reviews.length === 0 && (
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
        </div>
    );
};

export default ProductDetails;