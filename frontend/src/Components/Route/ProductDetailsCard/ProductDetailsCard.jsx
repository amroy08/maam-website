import {useEffect, useState} from "react";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import {RxCross1} from "react-icons/rx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {backend_url, server} from "../../../server.jsx";
import {addToCart} from "../../../redux/Actions/cart.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/Actions/wishlist";
import axios from "axios";


const ProductDetailsCard = ({setOpen, data}) => {
    const {cart} = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);
    const {products} = useSelector((state) => state.products);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);

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

    const averageRating = avg.toFixed(1);

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
      if (wishlist && wishlist.find((i) => i._id === data._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    }, [wishlist]);

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
        toast.error("Item removed to Wishlist!");
    };

    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data));
        toast.success("Item added to Wishlist!");
    };

    return (
        <div className="bg-[#fff]">
            {data ? (
                <div
                    className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
                    <div
                        className="w-[90%] 800px:w-[70%] h-[90vh] 800px:h-[85vh] overflow-y-scroll bg-gray-50  rounded-md shadow-sm relative p-2 md:p-6">
                        <RxCross1
                            size={30}
                            className="absolute right-3 top-3 z-50 cursor-pointer"
                            onClick={() => setOpen(false)}
                        />

                        {/* Container without flex at desktop */}
                        <section className="py-8 md:py-16 antialiased">
                            <div className="max-w-screen-xl p-4 mx-auto 2xl:p-0">
                                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                                        <Link to={`/product/${data._id}`}>
                                            <img
                                                src={`${backend_url}uploads/${data?.images?.[0]}`}
                                                alt="Product Image"
                                                className="w-full hidden dark:block rounded-lg"
                                            />
                                        </Link>
                                        <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full">
                                            <Link to={`/shop/preview/${data.shop._id}`}>
                                                <div className="flex items-center mb-4">
                                                    <img
                                                        src={`${backend_url}${data.shop.avatar}`}
                                                        alt=""
                                                        className="w-12 h-12 object-cover rounded-full mr-3"
                                                    />
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{data.shop.name}</h3>
                                                        <h5 className=" text-[15px]">({averageRating}) Ratings</h5>
                                                    </div>
                                                </div>
                                            </Link>
                                            <p className=" text-red-600 text-sm font-medium">
                                                {data.sold_out} units sold
                                            </p>
                                            <button
                                                className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                                onClick={handleMessageSubmit}
                                            >
                                                <AiOutlineMessage className="mr-2"/> Send Message
                                            </button>
                                        </div>
                                    </div>


                                    <div className="mt-6 sm:mt-8 lg:mt-0">
                                        <div className="w-full flex flex-col">
                                            {/* Product Name */}
                                            <h1 className="text-3xl font-bold mb-4">{data.name}</h1>

                                            {/* Description */}
                                            <p className="text-gray-600 mb-4">{data.description}</p>

                                            {/* Pricing Section */}
                                            <div className="flex items-center mb-6">
                                                <span className="font-sans text-2xl font-bold text-black">
                                                  ₹{data.discountPrice}
                                                </span>
                                                {data.originalPrice && (
                                                    <span className="font-sans ml-3 text-red-500 line-through">
                                                        ₹{data.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Increment & Favorite Section */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div
                                                    className="flex items-center border border-gray-200 mr-6 md:mr-0 rounded-lg">
                                                    <button
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                                                        onClick={decrementCount}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-6 py-2">{count}</span>
                                                    <button
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                                                        onClick={incrementCount}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="flex items-center text-gray-600 hover:text-red-600"
                                                    onClick={() => setClick(!click)}
                                                >
                                                    {click ? (
                                                        <AiFillHeart
                                                            size={28}
                                                            className="cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={() => removeFromWishlistHandler(data)}
                                                            color="red"
                                                            title="Remove from wishlist"
                                                        />
                                                    ) : (
                                                        <AiOutlineHeart
                                                            size={28}
                                                            className="cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={() => addToWishlistHandler(data)}
                                                            color="gray"
                                                            title="Add to wishlist"
                                                        />
                                                    )}
                                                    <span className="md:ml-2 text-md">Add to Favorites</span>
                                                </button>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={addToCartHandler} // Add click handler
                                                disabled={data.stock < 1} // Disable button if out of stock
                                                className="w-full bg-teal-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors"
                                            >
                                                <AiOutlineShoppingCart className="mr-2"/> Add to Cart
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : null}
        </div>
    );
    ;

};

export default ProductDetailsCard;
