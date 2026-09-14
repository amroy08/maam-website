import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {AiOutlineDelete, AiOutlineInbox} from "react-icons/ai";
import {RxCross1} from "react-icons/rx";
import Loader from "../Layout/Loader";
import {server} from "../../server";
import styles from "../../Styles/Styles.jsx";
import {getAllProducts} from "../../redux/Actions/product.js";

// The store's internal shop ID — used for coupon management
const STORE_SHOP_ID = "6a9167f2b11f575ac7323300";

const AllCoupons = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [selectedProducts, setSelectedProducts] = useState("");
    const [value, setValue] = useState("");
    const {products} = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${server}/coupon/get-coupon/${STORE_SHOP_ID}`, {withCredentials: true})
            .then((res) => {
                setIsLoading(false);
                setCoupons(res.data.couponCodes || []);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        axios.delete(`${server}/coupon/delete-coupon/${id}`, {withCredentials: true})
            .then((res) => {
                toast.success("Coupon code deleted successfully!");
                setCoupons(prev => prev.filter(coupon => coupon._id !== id));
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${server}/coupon/create-coupon-code`, {
            name,
            minAmount,
            maxAmount,
            selectedProduct: selectedProducts,
            value,
            // shop is auto-attached by backend using STORE_SHOP_ID
        }, {withCredentials: true})
            .then((res) => {
                toast.success("Coupon code created successfully!");
                setOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className="w-full mx-4 sm:mx-8 py-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Coupon Codes
                </h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-black hover:bg-zinc-900 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                    >
                        Create Coupon
                    </button>
                    <Link
                        to="/admin/dashboard"
                        className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-2"
                    >
                        Back to Dashboard
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="mx-4 sm:mx-0">
                {/* Desktop Header */}
                <div
                    className="hidden sm:grid sm:grid-cols-4 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b font-medium text-sm text-gray-600 rounded-t-xl">
                    <div className="min-w-[150px]">Coupon ID</div>
                    <div className="min-w-[180px]">Code</div>
                    <div className="min-w-[100px]">Value</div>
                    <div className="min-w-[120px]">Actions</div>
                </div>

                {/* Coupons List */}
                <div className="space-y-4 sm:space-y-0">
                    {coupons && coupons.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                                <AiOutlineInbox className="text-4xl text-gray-400"/>
                            </div>
                            <h5 className="text-gray-500 font-medium">
                                No coupons found
                            </h5>
                        </div>
                    ) : (
                        coupons && coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className="flex flex-col sm:grid sm:grid-cols-4 gap-4 p-6 sm:p-4 text-sm group hover:bg-gray-50 transition-all rounded-2xl sm:rounded-none bg-white shadow-xl sm:shadow-none border border-gray-100 sm:border-none mb-4 sm:mb-0"
                            >
                                {/* Mobile Header */}
                                <div className="sm:hidden flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg truncate pr-4">
                                        {coupon.name}
                                    </h3>
                                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                        #{coupon._id.slice(-6)}
                                    </span>
                                </div>

                                {/* Desktop Coupon ID */}
                                <div className="hidden sm:block min-w-[150px] text-gray-500 text-xs truncate">
                                    {coupon._id}
                                </div>

                                {/* Coupon Code */}
                                <div className="sm:min-w-[180px] font-medium text-gray-900">
                                    {coupon.name}
                                </div>

                                {/* Value */}
                                <div className="text-green-600 font-semibold">
                                    {coupon.value}%
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end sm:justify-normal sm:min-w-[120px]">
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="inline-flex hover:bg-gray-100 rounded-full p-2 transition-colors group-hover:bg-gray-100 text-red-500 hover:text-red-600"
                                    >
                                        <AiOutlineDelete className="text-xl"/>
                                        <span className="sm:hidden ml-2 text-sm">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Coupon Modal */}
            {open && (
                <div
                    className="fixed top-0 left-0 w-full h-screen bg-black/50 z-[20000] flex items-center justify-center p-4">
                    <div
                        className="w-full h-[95%] md:h-[90%] max-w-3xl bg-white rounded-2xl p-6 sm:p-8 border overflow-y-scroll md:overflow-y-hidden border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Create Coupon
                            </h2>
                            <RxCross1
                                className="text-2xl cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Coupon Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name={"name"}
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                        placeholder="Enter your coupon code name..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Discount Value (%) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name={"value"}
                                        required
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                        placeholder="Enter discount value..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Minimum Amount
                                    </label>
                                    <input
                                        type="number"
                                        name={"minAmount"}
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                        placeholder="Minimum amount..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Maximum Amount
                                    </label>
                                    <input
                                        type="number"
                                        name={"maxAmount"}
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                        placeholder="Maximum amount..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Applicable Products
                                </label>
                                <select
                                    value={selectedProducts}
                                    onChange={(e) => setSelectedProducts(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                >
                                    <option value="">All Products</option>
                                    {products?.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`w-full ${styles.button} text-white py-3 px-6 rounded-lg font-semibold shadow-md transition-all`}
                            >
                                Create Coupon
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isLoading && <Loader/>}
        </div>
    );
};

export default AllCoupons;
