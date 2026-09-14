import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Country, State} from "country-state-city";
import {toast} from "react-toastify";
import axios from "axios";
import {server} from "../../server.jsx";

const Checkout = () => {
    const {user} = useSelector((state) => state.user);
    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponCodeData, setCouponCodeData] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null);
    const [useSavedAddress, setUseSavedAddress] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);


    const subTotalPrice = cart.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
    );
    
    // Dynamic Shipping Rule: Free above ₹1000, else ₹99 flat rate
    const shipping = subTotalPrice >= 1000 ? 0 : 99;
    
    const totalPrice = couponCodeData
        ? (subTotalPrice + shipping - discountPrice).toFixed(2)
        : (subTotalPrice + shipping).toFixed(2);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user?.phoneNumber) setPhoneNumber(user.phoneNumber);
    }, [user]);

    const handleAddressSelect = (address) => {
        setCountry(address.country);
        setCity(address.city); // Changed from address.city to address.state
        setAddress1(address.address1);
        setAddress2(address.address2);
        setZipCode(address.zipCode);
        setSelectedAddressId(address._id); // Track selected address ID
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();

        if (!couponCode) return toast.error("Enter a coupon code");

        try {
            const {data} = await axios.get(
                `${server}/coupon/get-coupon-value/${couponCode}`
            );

            const coupon = data.couponCode;
            if (!coupon) return toast.error("Coupon code invalid");

            // Check if coupon is valid based on selectedProduct or shop
            let validItems;
            if (coupon.selectedProduct) {
                validItems = cart.filter((item) => item._id === coupon.selectedProduct);
            } else {
                validItems = cart.filter((item) => item.shopId === coupon.shop._id);
            }

            if (validItems.length === 0) {
                return toast.error("Coupon not valid for these products");
            }

            const eligiblePrice = validItems.reduce(
                (acc, item) => acc + item.qty * item.discountPrice,
                0
            );

            // Check if eligible price meets coupon's min/max requirements
            if (eligiblePrice < coupon.minAmount || eligiblePrice > coupon.maxAmount) {
                return toast.error(`Coupon valid for orders between $${coupon.minAmount} and $${coupon.maxAmount}`);
            }

            setDiscountPrice((eligiblePrice * coupon.value) / 100);
            setCouponCodeData(coupon);
            setCouponCode("");
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying coupon");
        }
    };

    const handlePaymentSubmit = () => {
        if (!address1 || !city || !country || !zipCode || !phoneNumber) {
            return toast.error("Please Choose or Enter Shipping Address");
        }

        const shippingAddress = {address1, address2, city, country, zipCode};
        const orderData = {
            cart,
            totalPrice,
            subTotalPrice,
            shipping,
            shippingAddress,
            discountPrice,
            user,
        };

        localStorage.setItem("latestOrder", JSON.stringify(orderData));
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Stepper Progress Bar */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-center max-w-lg mx-auto">
                    <div className="flex items-center w-full">
                        <div className="flex flex-col items-center text-violet-600 relative">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
                            <span className="text-[11px] font-bold mt-1 text-violet-600 uppercase tracking-wider">Shipping</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-4 -mt-4"></div>
                        <div className="flex flex-col items-center text-gray-400 relative">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
                            <span className="text-[11px] font-bold mt-1 text-gray-400 uppercase tracking-wider">Payment</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-4 -mt-4"></div>
                        <div className="flex flex-col items-center text-gray-400 relative">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
                            <span className="text-[11px] font-bold mt-1 text-gray-400 uppercase tracking-wider">Success</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto lg:flex lg:gap-8">
                {/* Shipping Section */}
                <div className=" bg-white rounded-2xl border border-gray-100 p-5 md:p-8 mb-8 lg:mb-0 lg:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Shipping Details</h2>

                    {/* Saved Addresses */}
                    {user?.addresses?.length > 0 && (
                        <div className="mb-6">
                            <label className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    checked={useSavedAddress}
                                    onChange={(e) => setUseSavedAddress(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Choose from saved addresses
                                </span>
                            </label>

                            {useSavedAddress && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.addresses.map((address) => (
                                        <div
                                            key={address._id}
                                            onClick={() => handleAddressSelect(address)}
                                            className={`md:flex md:gap-x-6 border rounded-lg p-4 cursor-pointer transition-colors 
                                                ${selectedAddressId === address._id
                                                ? "border-blue-500 shadow-md text-white drop-shadow-md bg-gradient-to-tr from-blue-500 to-purple-500"
                                                : "border-gray-300 hover:border-blue-500 hover:shadow-md"}`}
                                        >
                                            <div>
                                                <p className="font-medium">{address.addressType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm ">{address.address1}</p>
                                                <p className="text-sm ">{address.address2}</p>
                                                <p className="text-sm ">{address.city}, {address.country}</p>
                                                <p className="text-sm ">{address.zipCode}, {user.phoneNumber}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Address Form */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.name || ""}
                                    readOnly
                                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 text-sm cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={address1}
                                    onChange={(e) => setAddress1(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    value={address2}
                                    onChange={(e) => setAddress2(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select Country</option>
                                    {Country &&
                                        Country.getAllCountries().map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select State</option>
                                    {State &&
                                        State.getStatesOfCountry(country).map((item) => (
                                            <option key={item.isoCode} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow-sm p-6 h-fit">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium font-sans">₹{subTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium font-sans">₹{shipping.toFixed(2)}</span>
                        </div>
                        {discountPrice > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span className={"bg-red-100 px-2 rounded-sm"}>Coupon-Code Discount:</span>
                                <span className={"font-sans"}>-₹{discountPrice.toFixed(2)}</span>
                            </div>
                        )}
                        <hr className="my-4"/>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className={"font-sans"}>₹{totalPrice}</span>
                        </div>
                    </div>

                    <form onSubmit={handleCouponSubmit} className="mt-6 space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                className="w-full rounded-lg border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-3 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </form>

                    <button
                        onClick={handlePaymentSubmit}
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Proceed to Payment
                    </button>

                    {!user && (
                        <p className="mt-4 text-sm text-gray-600 text-center">
                            Need an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>{" "}
                            or{" "}
                            <Link to="/signup" className="text-blue-600 hover:underline">
                                create account
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;