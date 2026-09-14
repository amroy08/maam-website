import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/Actions/wishlist.js";
import { toast } from "react-toastify";
import { backend_url } from "../../server.jsx";
import { addToCart } from "../../redux/Actions/cart.js";

const Wishlist = ({ setOpenWishList }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // Calculate total price from wishlist items
    const totalPrice = wishlist.reduce((acc, item) => acc + item.discountPrice, 0);

    const removeFromWishlistHandler = (item) => {
        dispatch(removeFromWishlist(item));
        toast.error("Item removed from Wishlist!");
    };

    const addToCartHandler = (item) => {
        if (item.stock < 1) {
            toast.error("Product stock limited!");
            return;
        }
        if (cart?.find((i) => i._id === item._id)) {
            toast.error("Item already in Cart! Please check your cart.");
            return;
        }
        dispatch(addToCart({ ...item, qty: 1 }));
        dispatch(removeFromWishlist(item));
        toast.success("Item added to Cart!");
    };

    const addAllToCartHandler = () => {
        let addedItems = 0;
        let errors = 0;

        wishlist.forEach((item) => {
            if (item.stock < 1) {
                errors++;
                return;
            }
            if (cart?.find((i) => i._id === item._id)) {
                errors++;
                return;
            }
            dispatch(addToCart({ ...item, qty: 1 }));
            dispatch(removeFromWishlist(item));
            addedItems++;
        });

        if (addedItems > 0) {
            toast.success(`${addedItems} items added to Cart!`);
        }
        if (errors > 0) {
            toast.error(`${errors} items couldn't be added (already in cart or out of stock)`);
        }
        if (addedItems === 0 && errors === 0) {
            toast.info("No items to add to cart");
        }
    };

    return (
        <Dialog open={true} onClose={() => setOpenWishList(false)} className="relative z-[9999]">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/20 transition-opacity duration-all ease-in-out"
            />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 right-0 max-h flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out"
                        >
                            <div className="flex h-full flex-col rounded-xl overflow-y-scroll bg-gray-50 shadow-xl">
                                <div className="border-b border-gray-200 px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-lg font-medium text-gray-900">
                                            Wishlist [ {wishlist.length} Items ]
                                        </DialogTitle>
                                        <button
                                            type="button"
                                            onClick={() => setOpenWishList(false)}
                                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Close panel</span>
                                            <RxCross1 className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    {wishlist.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <img
                                                src="https://img.freepik.com/premium-vector/premium-flat-illustration-depicting-add-wishlist_67813-6185.jpg"
                                                alt="Empty Wishlist"
                                                className="w-56 h-56 mb-4 mix-blend-multiply"
                                            />
                                            <p className="text-lg text-gray-600">No products in the Wishlist</p>
                                            <div className="flex justify-center text-center text-sm text-gray-500">
                                                <Link to={"/products"}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenWishList(false)}
                                                        className="font-medium text-pink-600 hover:text-indigo-500"
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flow-root">
                                            <ul className="-my-6">
                                                {wishlist.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex rounded-lg bg-gray-100 border-b border-gray-200 hover:scale-105 my-3 p-2"
                                                    >
                                                        <div className="flex flex-col">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                                                <img
                                                                    src={`${backend_url}uploads/${item?.images?.[0]}`}
                                                                    alt={item.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <p className="font-sans mt-2 pl-2 text-lg font-medium text-gray-900">
                                                                ₹{item.discountPrice}
                                                            </p>
                                                        </div>

                                                        <div className="ml-4 flex flex-1 flex-col justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-medium text-gray-900">
                                                                    {item.name}
                                                                </h3>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {item.description.length > 25
                                                                        ? `${item.description.slice(0, 25)}...`
                                                                        : item.description}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <button
                                                                    onClick={() => addToCartHandler(item)}
                                                                    className="text-indigo-600 cursor-pointer text-sm hover:text-indigo-500"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                                <button
                                                                    onClick={() => removeFromWishlistHandler(item)}
                                                                    className="text-red-600 text-sm cursor-pointer hover:text-red-500"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <button
                                        onClick={addAllToCartHandler}
                                        className="flex w-full font-sans cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        Add All to Cart (₹ {totalPrice})
                                    </button>
                                    <div className="mt-3 text-center text-sm text-gray-500">
                                        <Link to={"/products"}>
                                            <button
                                                onClick={() => setOpenWishList(false)}
                                                className="font-medium text-pink-600 hover:text-purple-500"
                                            >
                                                Continue Shopping
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Wishlist;