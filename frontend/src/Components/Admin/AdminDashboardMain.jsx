import {useEffect, useRef, useState} from "react";
import {AiOutlineArrowRight, AiOutlineInbox, AiOutlineMoneyCollect, AiFillGift} from "react-icons/ai";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getAllOrdersOfAdmin} from "../../redux/Actions/order";
import {getAllProducts} from "../../redux/Actions/product";
import Loader from "../Layout/Loader.jsx";
import {getAllUsers} from "../../redux/Actions/user.js";
import {GiMoneyStack} from "react-icons/gi";
import {HiMiniShoppingCart, HiMiniReceiptRefund} from "react-icons/hi2";
import {BsFillPeopleFill, BsTagFill} from "react-icons/bs";
import {MdLocalOffer} from "react-icons/md";
import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

// Count-up hook
const useCountUp = (target, duration = 1200) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const num = parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
        if (num === 0) { setCount(0); return; }
        const steps = 40;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) { setCount(num); clearInterval(timer); }
            else setCount(current);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

const StatCard = ({icon, bg, title, value, subtitle, actions, accentColor = '#7c3aed'}) => {
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    const animated = useCountUp(numericValue);
    const prefix = String(value).startsWith('₹') ? '₹ ' : '';
    const isFloat = String(numericValue).includes('.');
    const displayValue = prefix
        ? `₹ ${animated.toFixed(2)}`
        : isFloat ? animated.toFixed(2) : Math.round(animated).toString();
    return (
        <div
            className="rounded-xl overflow-hidden bg-white flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={{boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0', borderLeft: `3px solid ${accentColor}`}}
        >
            <div className="p-5 flex items-start gap-4 flex-1">
                <div className={`p-3 ${bg} rounded-lg shrink-0`}>{icon}</div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 truncate animate-fade-in-up">{displayValue}</h3>
                    {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {actions?.length > 0 && (
                <div className={`border-t border-gray-100 ${actions.length > 1 ? 'grid grid-cols-2 divide-x divide-gray-100' : ''}`}>
                    {actions.map((action, idx) => (
                        <Link key={idx} to={action.to}
                              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-violet-600 hover:text-violet-800 hover:bg-violet-50 transition-all group">
                            {action.label}
                            <AiOutlineArrowRight className="text-xs transition-transform group-hover:translate-x-1"/>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminDashboardMain = () => {
    const dispatch = useDispatch();
    const {adminOrders, adminOrderLoading} = useSelector(s => s.order);
    const {allProducts, isLoading: productsLoading} = useSelector(s => s.products);
    const {users} = useSelector(s => s.user);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin());
        dispatch(getAllProducts());
        dispatch(getAllUsers());
    }, [dispatch]);

    if (productsLoading || adminOrderLoading) return <Loader />;

    const adminBalance = adminOrders?.reduce((acc, o) => acc + o.totalPrice * 0.10, 0).toFixed(2) || "0.00";

    const salesDataMap = {};
    adminOrders?.forEach(o => {
        const m = new Date(o.createdAt).toLocaleString("default", {month: "short"});
        salesDataMap[m] = (salesDataMap[m] || 0) + o.totalPrice;
    });
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const last6 = Array.from({length: 6}, (_, i) => months[(new Date().getMonth() - 5 + i + 12) % 12]);
    const salesChartData = last6.map(m => ({name: m, Sales: salesDataMap[m] || 0}));

    const categoryMap = {};
    allProducts?.forEach(p => { const c = p.category || "Other"; categoryMap[c] = (categoryMap[c] || 0) + 1; });
    const categoryChartData = Object.entries(categoryMap).map(([name, Count]) => ({
        name: name.length > 12 ? name.slice(0, 12) + "…" : name, Count
    }));

    const statusMap = {Delivered: 0, Processing: 0, Pending: 0};
    adminOrders?.forEach(o => {
        if (o.status?.includes("Delivered")) statusMap.Delivered++;
        else if (o.status?.includes("Processing")) statusMap.Processing++;
        else statusMap.Pending++;
    });
    const statusChartData = Object.entries(statusMap).filter(([, v]) => v > 0).map(([name, value]) => ({name, value}));

    const refundOrdersCount = adminOrders?.filter((o) => o.status === "Processing refund" || o.status === "Refund Success")?.length ?? 0;

    const cards = [
        {
            icon: <AiOutlineMoneyCollect className="text-2xl text-violet-600" />,
            bg: "bg-violet-50", title: "Revenue", value: `₹ ${adminBalance}`, subtitle: "Total store earnings",
            actions: [{label: "View Store", to: "/"}]
        },
        {
            icon: <HiMiniShoppingCart className="text-2xl text-fuchsia-600" />,
            bg: "bg-fuchsia-50", title: "Orders", value: adminOrders?.length ?? 0,
            actions: [{label: "All Orders", to: "/admin-orders"}]
        },
        {
            icon: <GiMoneyStack className="text-3xl text-pink-600" />,
            bg: "bg-pink-50", title: "Products", value: allProducts?.length ?? 0,
            actions: [{label: "Manage", to: "/admin-products"}, {label: "+ Create", to: "/admin-create-product"}]
        },
        {
            icon: <MdLocalOffer className="text-2xl text-amber-600" />,
            bg: "bg-amber-50", title: "Events", value: "Active Events",
            actions: [{label: "Manage", to: "/admin-events"}, {label: "+ Create", to: "/admin-create-event"}]
        },
        {
            icon: <BsTagFill className="text-2xl text-indigo-600" />,
            bg: "bg-indigo-50", title: "Categories", value: "Custom",
            actions: [{label: "Manage Categories", to: "/admin-categories"}]
        },
        {
            icon: <AiFillGift className="text-2xl text-teal-600" />,
            bg: "bg-teal-50", title: "Coupons", value: "Discount Codes",
            actions: [{label: "Manage Coupons", to: "/admin-manage-coupons"}]
        },
        {
            icon: <HiMiniReceiptRefund className="text-2xl text-sky-600" />,
            bg: "bg-sky-50", title: "Refunds", value: refundOrdersCount,
            actions: [{label: "View Refunds", to: "/admin-refunds"}]
        },
        {
            icon: <BsFillPeopleFill className="text-3xl text-yellow-500" />,
            bg: "bg-yellow-50", title: "Users", value: users?.length ?? 0,
            actions: [{label: "Manage Users", to: "/admin-users"}]
        },
    ];

    const EmptyChart = ({icon, msg}) => (
        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
            <div className="text-5xl">{icon}</div>
            <p className="text-sm font-medium text-gray-400">{msg}</p>
        </div>
    );

    return (
        <div className="w-full p-4 md:p-8 bg-[#f8f7fc] min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-400 mt-1">Welcome back, Admin. Here's what's happening in your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {cards.map((card, i) => <StatCard key={i} {...card} />)}
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Revenue Trend</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
                        </div>
                        <Link to="/admin-orders" className="text-xs font-semibold text-violet-600 hover:underline">View all →</Link>
                    </div>
                    <div className="h-[260px]">
                        {adminOrders?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesChartData} margin={{top: 5, right: 10, left: -25, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}/>
                                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}/>
                                    <Tooltip contentStyle={{borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px"}}/>
                                    <Area type="monotone" dataKey="Sales" name="Revenue (₹)" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#rev)" dot={{r: 3, fill: "#7C3AED"}} activeDot={{r: 5}}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart icon={<AiOutlineMoneyCollect />} msg="No sales recorded yet" />
                        )}
                    </div>
                </div>

                {/* Order Status Pie */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-gray-800">Order Status</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Distribution overview</p>
                    </div>
                    {statusChartData.length > 0 ? (
                        <>
                            <div className="flex-1 min-h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value">
                                            {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                                        </Pie>
                                        <Tooltip contentStyle={{borderRadius: "12px", fontSize: "12px"}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                {statusChartData.map((e, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}/>
                                        {e.name} ({e.value})
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1"><EmptyChart icon={<HiMiniShoppingCart />} msg="No orders yet" /></div>
                    )}
                </div>

                {/* Category Bar Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Products by Category</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Catalog distribution</p>
                        </div>
                        <Link to="/admin-products" className="text-xs font-semibold text-violet-600 hover:underline">View products →</Link>
                    </div>
                    <div className="h-[220px]">
                        {categoryChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryChartData} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}/>
                                    <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}/>
                                    <Tooltip cursor={{fill: "#F5F3FF"}} contentStyle={{borderRadius: "12px", fontSize: "12px"}}/>
                                    <Bar dataKey="Count" radius={[8, 8, 0, 0]}>
                                        {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart icon={<BsTagFill />} msg="No products in catalog yet" />
                        )}
                    </div>
                </div>
            </div>

            {/* Latest Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">Latest Orders</h2>
                        <p className="text-xs text-gray-400">Recent customer activity</p>
                    </div>
                    <Link to="/admin-orders" className="text-xs font-semibold text-violet-600 hover:underline flex items-center gap-1">
                        View all <AiOutlineArrowRight/>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    {adminOrders?.length === 0 ? (
                        <div className="text-center py-16">
                            <AiOutlineInbox className="text-5xl text-gray-200 mx-auto mb-3"/>
                            <p className="text-gray-400 font-medium text-sm">No orders found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left font-semibold hidden md:table-cell">Items</th>
                                    <th className="px-6 py-3 text-left font-semibold">Total</th>
                                    <th className="px-6 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {adminOrders?.slice(0, 6).map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                            }`}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{order.cart?.length} item{order.cart?.length !== 1 ? "s" : ""}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">{new Date(order.createdAt).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"})}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardMain;