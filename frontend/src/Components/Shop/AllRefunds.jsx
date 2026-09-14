import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {getAllOrdersOfShop} from "../../redux/Actions/order.js";
import {AiOutlineEye, AiOutlineInbox} from "react-icons/ai";
import {server} from "../../server.jsx";

const STORE_SHOP_ID = "6a9167f2b11f575ac7323300";

const AllRefunds = () => {
    const { orders } = useSelector((state) => state.order);
    const { shop } = useSelector((state) => state.shop);
    const dispatch = useDispatch();

    useEffect(() => {
        const shopId = shop?._id || STORE_SHOP_ID;
        dispatch(getAllOrdersOfShop(shopId));
    }, [dispatch, shop?._id]);

    const refundOrders = orders && orders.filter((item) => item.status === "Processing refund"  || item.status === "Refund Success");


    return (
        <div className="w-full mb-6 sm:px-8 pt-1 sm:pt-6">
            <div className="flex justify-between items-center mb-6 px-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Shop Refund Orders
                </h1>
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

            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-6 gap-4 bg-gray-50 p-5 border-b font-medium text-gray-500 text-sm rounded-t-xl shadow-sm">
                <div className="min-w-[120px]">Order ID</div>
                <div className="min-w-[90px]">Status</div>
                <div className="min-w-[100px]">Products</div>
                <div className="min-w-[60px]">Items</div>
                <div className="min-w-[90px]">Total</div>
                <div className="min-w-[50px]">Actions</div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {refundOrders?.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                            <AiOutlineInbox className="text-4xl text-gray-400" />
                        </div>
                        <h5 className="text-gray-500 font-medium">No orders found</h5>
                    </div>
                ) : (
                    refundOrders?.map((order) => (
                        <div
                            key={order?._id}
                            className="flex flex-col md:items-center sm:grid sm:grid-cols-6 mt-3 mx-5 md:mx-0 gap-4 p-5 sm:p-5 text-sm group hover:shadow-md transition-all rounded-xl bg-white shadow-sm border border-gray-100"
                        >
                            {/* Mobile Header */}
                            <div className="sm:hidden flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-gray-900 text-base truncate pr-4">
                                    Order #{order?._id.slice(-6)}
                                </h3>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    order.status === "Delivered"
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                }`}>
                                    {order?.status}
                                </span>
                            </div>

                            {/* Order ID */}
                            <div className="sm:min-w-[120px] text-gray-500">
                                <span className="sm:hidden mr-2 text-gray-600 font-medium">Order ID:</span>
                                <span className="font-mono text-gray-400 text-xs sm:text-sm">{order?._id}</span>
                            </div>

                            {/* Status */}
                            <div className="sm:min-w-[90px] flex items-center">
                                <span className="sm:hidden mr-2 text-gray-600 font-medium">Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                                    order.status === "Delivered"
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                }`}>
                                    {order.status === "Delivered" && (
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                        </svg>
                                    )}
                                    {order?.status}
                                </span>
                            </div>

                            {/* Product Preview (Desktop) */}
                            <div className="sm:min-w-[100px] hidden sm:flex flex-col gap-2">
                                {order.cart.map((item) => (
                                    <div key={item._id} className="flex items-center gap-3 group">
                                        <Link to={`/product/${item._id}`} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-md overflow-hidden border border-gray-100">
                                                <img
                                                    src={`${server}/uploads/${item.images[0]}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-gray-600 text-sm truncate max-w-[120px] block overflow-hidden whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Items */}
                            <div className="sm:min-w-[60px] text-gray-500">
                                <span className="sm:hidden mr-2 text-gray-600 font-medium">Items:</span>
                                {order?.cart?.length}
                            </div>

                            {/* Total */}
                            <div className="sm:min-w-[90px] text-gray-900 font-medium">
                                <span className="sm:hidden mr-2 text-gray-600 font-medium">Total:</span>
                                US$ {order?.totalPrice}
                            </div>

                            {/* Actions */}
                            <div className="sm:min-w-[50px] flex justify-end sm:justify-start gap-3">
                                <Link
                                    to={`/user/order/${order._id}`}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors group"
                                >
                                    <AiOutlineEye className="text-xl"/>
                                    <span className="sm:hidden ml-2">View</span>
                                </Link>
                            </div>

                            {/* Mobile Product Display */}
                            <div className="sm:hidden grid grid-cols-2 gap-y-2 mt-4 pt-4 border-t border-gray-100">
                                <div className="text-gray-500 font-medium">Products:</div>
                                <div className="text-right text-gray-600 space-y-2">
                                    {order.cart.map((item) => (
                                        <div key={item._id} className="flex justify-end items-center gap-2">
                                            <Link to={`/product/${item._id}`} className="flex items-center gap-2">
                                                <span className="truncate max-w-[120px]">{item.name}</span>
                                                <div className="w-6 h-6 rounded-md overflow-hidden border border-gray-100 shrink-0">
                                                    <img
                                                        src={`${server}/uploads/${item.images[0]}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllRefunds;