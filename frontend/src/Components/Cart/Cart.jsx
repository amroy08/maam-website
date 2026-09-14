      import {useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {RxCross1} from "react-icons/rx";
import {HiOutlineMinus, HiPlus} from "react-icons/hi";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {backend_url} from "../../server.jsx";
import {toast} from "react-toastify";
import {addToCart, removeFromCart} from "../../redux/Actions/cart.js";

 
const Cart = ({setOpenCart}) => {
    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();


    const totalPrice = cart.reduce((acc, item) => acc + item.discountPrice * item.qty, 0);

    const removeFromCartHandler = (data) => {
        toast.success("Item removed from cart!");
        dispatch(removeFromCart(data));
    };

    const quantityChangeHandler = (data) => {
        dispatch(addToCart(data));
    };

    return (
        <Dialog open={true} onClose={() => setOpenCart(false)} className="relative z-[9999]">
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
                                            Shopping Cart [ {cart.length} Items ]
                                        </DialogTitle>

                                        <button
                                            type="button"
                                            onClick={() => setOpenCart(false)}
                                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="absolute -inset-0.5"/>
                                            <span className="sr-only">Close panel</span>
                                            <RxCross1 className="h-6 w-6"/>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    {cart.length === 0 ? (
                                        // Display this when the cart is empty
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <img
                                                src="https://img.freepik.com/free-vector/empty-shopping-basket-concept-illustration_114360-29795.jpg"
                                                alt="Empty Cart"
                                                className="w-56 h-56 mb-4 mix-blend-multiply"
                                            />

                                            <p className="text-lg text-gray-600">No products in the cart</p>
                                            <div className="flex justify-center text-center text-sm text-gray-500">
                                                <p>
                                                    <Link to={"/products"}
                                                          className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        <button
                                                            type="button"
                                                            onClick={() => setOpenCart(false)}
                                                            className="font-medium text-pink-600 hover:text-indigo-500"
                                                        >
                                                            Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display this when the cart has items
                                        <div className="flow-root">
                                            <ul className="-my-6 divide-y divide-gray-200">
                                                {cart.map((item, index) => (
                                                    <CartSingle
                                                        key={index}
                                                        data={item}
                                                        removeFromCartHandler={removeFromCartHandler}
                                                        quantityChangeHandler={quantityChangeHandler}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>


                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p className={"font-sans"}>₹ {totalPrice}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Shipping and taxes calculated at checkout.
                                    </p>
                                    <div className="mt-4">
                                        <Link
                                            to="/checkout"
                                            className="flex items-center font-sans justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                        >
                                            Checkout Now (₹ {totalPrice})
                                        </Link>
                                    </div>
                                    <div className="mt-3 flex justify-center text-center text-sm text-gray-500">
                                        <p>
                                            or{" "}
                                            <Link to={"/products"}
                                                  className="font-medium text-indigo-600 hover:text-indigo-500">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenCart(false)}
                                                    className="font-medium text-pink-600 hover:text-indigo-500"
                                                >
                                                    Continue Shopping
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </Link>
                                        </p>
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

 
const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
    const [quantity, setQuantity] = useState(data.qty);

    const increment = (data) => {
        if (data.stock === quantity) {
            toast.error("Product stock limited!");
        } else {
            setQuantity(quantity + 1);
            const updateCartData = { ...data, qty: quantity + 1 };
            quantityChangeHandler(updateCartData);
        }
    };

    const decrement = (data) => {
        setQuantity(quantity === 1 ? 1 : quantity - 1);
        const updateCartData = { ...data, qty: quantity === 1 ? 1 : quantity - 1 };
        quantityChangeHandler(updateCartData);
    };


    return (
        <li className="flex bg-gray-100 rounded-lg hover:scale-105 my-3 p-3">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={`${backend_url}uploads/${data?.images?.[0]}`}
                    alt={data.name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{data.name}</h3>
                        <p className="ml-4 font-sans">₹{data.discountPrice}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{data.description.length > 25 ? `${data.description.slice(0, 25)}...` : data.description}</p>
                </div>

                <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => decrement(data)}
                            className="rounded-md bg-gray-200 p-1.5 hover:bg-gray-200"
                        >
                            <HiOutlineMinus className="h-4 w-4"/>
                        </button>
                        <span className="text-gray-900 text-lg">{quantity}</span>
                        <button
                            onClick={() => increment(data)}
                            className="rounded-md bg-gray-200 p-1.5 hover:bg-gray-200"
                        >
                            <HiPlus className="h-4 w-4"/>
                        </button>
                    </div>

                    <button className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => removeFromCartHandler(data)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </li>
    );
};

export default Cart;