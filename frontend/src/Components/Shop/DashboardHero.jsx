import { useEffect } from "react";
import {AiOutlineArrowRight, AiOutlineInbox, AiOutlineMoneyCollect} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/Actions/order";
import { getAllProductsShop } from "../../redux/Actions/product";
import { server } from "../../server";
import {GiMoneyStack} from "react-icons/gi";
import {HiMiniShoppingCart} from "react-icons/hi2";
import {getAllEventsShop} from "../../redux/Actions/event.js";
import {MdEventRepeat} from "react-icons/md";

const DashboardHero = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    const { shop } = useSelector((state) => state.shop);
    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getAllOrdersOfShop(shop._id));
        dispatch(getAllProductsShop(shop._id));
        dispatch(getAllEventsShop(shop._id));
    }, [dispatch, shop._id]);

    const availableBalance = shop?.availableBalance.toFixed(2);

    return (
        <div className="w-full p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl mb-2 md:mb-6 font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {/* Balance Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <AiOutlineMoneyCollect className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold text-md">Available Balance <span className={" text-gray-500 font-normal text-sm"}>(After 10% service charge)</span></p>
                            <h3 className="text-2xl font-semibold">${availableBalance}</h3>
                        </div>
                    </div>
                    <Link
                        to="/dashboard-withdraw-money"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                        Withdraw Funds
                        <AiOutlineArrowRight className="text-sm" />
                    </Link>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <HiMiniShoppingCart className="text-2xl text-purple-600" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold text-md">Total Orders</p>
                            <h3 className="text-2xl font-semibold">{orders?.length}</h3>
                        </div>
                    </div>
                    <Link
                        to="/dashboard-orders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                        View Orders
                        <AiOutlineArrowRight className="text-sm" />
                    </Link>
                </div>

                {/* Products Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <GiMoneyStack className="text-3xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold text-md">Total Products</p>
                            <h3 className="text-2xl font-semibold">{products?.length}</h3>
                        </div>
                    </div>
                    <Link
                        to="/dashboard-products"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                        Manage Products
                        <AiOutlineArrowRight className="text-sm" />
                    </Link>
                </div>

                {/* Products Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-pink-50 rounded-lg">
                            <MdEventRepeat className="text-3xl text-pink-600" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold text-md">Total Events</p>
                            <h3 className="text-2xl font-semibold">{events?.length}</h3>
                        </div>
                    </div>
                    <Link
                        to="/dashboard-events"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                        Manage Events
                        <AiOutlineArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center p-6 justify-between ">
                    <h2 className="text-2xl font-semibold text-gray-800">Recent Orders</h2>
                    <Link
                        to="/dashboard-orders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                        View All Orders
                        <AiOutlineArrowRight className="text-sm transform transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="w-full mb-6 md:px-8 pt-1 md:pt-6">

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
                    <div className="">
                        {orders?.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                                    <AiOutlineInbox className="text-4xl text-gray-400" />
                                </div>
                                <h5 className="text-gray-500 font-medium">No orders found</h5>
                            </div>
                        ) : (
                            orders?.map((order) => (
                                <div
                                    key={order?._id}
                                    className="flex flex-col md:items-center sm:grid sm:grid-cols-6 mt-3 mx-5 md:mx-0 gap-3 md:gap-5 p-5 sm:p-5 text-sm group hover:shadow-md transition-all rounded-xl bg-white shadow-sm border border-gray-100"
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
                                    <div className="md:col-span-1 flex justify-end">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                                        >
                                            <AiOutlineArrowRight className="text-lg transform -rotate-45 hover:rotate-0"/>
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
            </div>
        </div>
    );
};

export default DashboardHero;