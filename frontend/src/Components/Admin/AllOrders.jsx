import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineInbox, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { BsFillBagFill } from "react-icons/bs";
import { server } from "../../server";
import Loader from "../Layout/Loader";
import { getAllOrdersOfAdmin } from "../../redux/Actions/order.js";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const AllOrders = () => {
    const dispatch = useDispatch();
    const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);

    // Order Details Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);

    // Edit Order Status Modal state
    const [openEditModal, setOpenEditModal] = useState(false);
    const [statusOrder, setStatusOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin());
    }, [dispatch]);

    const handleOpenDetails = (order) => {
        setSelectedOrder(order);
        setOpenDetailsModal(true);
    };

    const handleOpenEdit = (order) => {
        setStatusOrder(order);
        setStatus(order.status || "Processing");
        setOpenEditModal(true);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        const targetOrder = statusOrder || selectedOrder;
        if (!targetOrder) return;
        setIsUpdating(true);
        try {
            await axios.put(
                `${server}/order/update-order-status/${targetOrder._id}`,
                { status },
                { withCredentials: true }
            );
            toast.success("Order status updated successfully!");
            setOpenEditModal(false);
            if (selectedOrder && selectedOrder._id === targetOrder._id) {
                setSelectedOrder({ ...selectedOrder, status });
            }
            dispatch(getAllOrdersOfAdmin());
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating order status");
        } finally {
            setIsUpdating(false);
        }
    };

    const generateInvoice = (order) => {
        if (!order) return;
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 25, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Order ID: #${order._id}`, 20, 40);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 20, 46);
        doc.text(`Status: ${order.status}`, 20, 52);

        doc.setFont("helvetica", "bold");
        doc.text("Customer & Shipping Address:", 20, 65);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${order.user?.name || "Customer"}`, 20, 71);
        doc.text(`Email: ${order.user?.email || "N/A"}`, 20, 77);
        doc.text(`Address: ${order.shippingAddress?.address1 || ""}, ${order.shippingAddress?.address2 || ""}`, 20, 83);
        doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.country || ""} - ${order.shippingAddress?.zipCode || ""}`, 20, 89);
        doc.text(`Phone: ${order.user?.phoneNumber || "N/A"}`, 20, 95);

        const items = order.cart?.map((item) => [
            item.name,
            item.qty,
            `INR ₹${item.discountPrice}`,
            `INR ₹${(item.qty * item.discountPrice).toFixed(2)}`
        ]) || [];

        autoTable(doc, {
            startY: 105,
            head: [["Item", "Qty", "Unit Price", "Total"]],
            body: items,
            theme: "striped",
            headStyles: { fillColor: [124, 58, 237], textColor: 255 }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: INR ₹${order.totalPrice}`, 190, finalY, { align: "right" });

        doc.save(`invoice-${order._id.slice(-8)}.pdf`);
    };

    if (adminOrderLoading) return <Loader />;

    const orderStatuses = [
        "Processing",
        "Transferred to delivery partner",
        "Shipping",
        "Received",
        "On the way",
        "Delivered",
        "Processing refund",
        "Refund Success",
        "Refund Rejected"
    ];

    return (
        <div className="w-full p-4 md:p-8 bg-[#f8f7fc] min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">All Orders</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {adminOrders?.length ?? 0} order{adminOrders?.length !== 1 ? "s" : ""} recorded in store
                    </p>
                </div>
                <Link
                    to="/admin/dashboard"
                    className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-2"
                >
                    Back to Dashboard
                    <AiOutlineArrowRight className="text-sm" />
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {adminOrders?.length === 0 ? (
                    <div className="text-center py-20">
                        <AiOutlineInbox className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h5 className="text-gray-400 font-semibold text-base">No orders found</h5>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Items</th>
                                    <th className="px-6 py-4 text-left font-semibold">Total Price</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden lg:table-cell">Date</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {adminOrders?.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                                                order.status?.includes("Refund") ? "bg-red-50 text-red-700" :
                                                "bg-amber-50 text-amber-700"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                            {order.cart?.length} item{order.cart?.length !== 1 ? "s" : ""}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₹{order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenDetails(order)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all flex items-center gap-1 text-xs font-semibold"
                                                    title="View Full Details"
                                                >
                                                    <AiOutlineEye size={18} />
                                                    <span>View Details</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(order)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1 text-xs font-semibold"
                                                    title="Edit Order Status"
                                                >
                                                    <AiOutlineEdit size={18} />
                                                    <span>Edit Status</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FULL ORDER DETAILS MODAL */}
            {openDetailsModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 md:p-8 relative my-8">
                        <button
                            onClick={() => setOpenDetailsModal(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        >
                            <RxCross1 size={22} />
                        </button>

                        {/* Modal Title */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                                <BsFillBagFill size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Order Details
                                </h3>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    ID: #{selectedOrder._id} • Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Purchased Products ({selectedOrder.cart?.length})
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {selectedOrder.cart?.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.images?.[0]?.url || `${server}/uploads/${item.images?.[0]}`}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                                                onError={(e) => { e.target.src = "/default.png"; }}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm truncate max-w-[220px]">{item.name}</p>
                                                <p className="text-xs text-gray-400 font-sans">
                                                    {item.qty} × ₹{item.discountPrice?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">
                                            ₹{(item.qty * item.discountPrice)?.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Address & Customer Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Shipping Address */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    📍 Shipping Address
                                </h4>
                                <p className="text-sm font-bold text-gray-800 mb-1">{selectedOrder.user?.name || "Customer"}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {selectedOrder.shippingAddress?.address1}
                                    {selectedOrder.shippingAddress?.address2 ? `, ${selectedOrder.shippingAddress.address2}` : ""}
                                    <br />
                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.zipCode}
                                </p>
                                {selectedOrder.user?.phoneNumber && (
                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                        📞 Phone: {selectedOrder.user?.phoneNumber}
                                    </p>
                                )}
                            </div>

                            {/* Payment & Customer Details */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        💳 Payment Info
                                    </h4>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Method:</span>
                                            <span className="font-semibold text-gray-900">{selectedOrder.paymentInfo?.type || "Cash on Delivery"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                                                selectedOrder.paymentInfo?.status === "Succeeded"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}>
                                                {selectedOrder.paymentInfo?.status || "Pending"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Customer Email:</span>
                                            <span className="font-mono text-gray-700">{selectedOrder.user?.email || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-200 mt-3 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-600">Total Price:</span>
                                    <span className="text-lg font-black text-violet-700">₹{selectedOrder.totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Refund Details Panel */}
                        {(selectedOrder.status === "Processing refund" || selectedOrder.status === "Refund Success" || selectedOrder.refundReason) && (
                            <div className="mb-6 p-4 bg-red-50/50 rounded-xl border border-red-100">
                                <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                                    🔄 Refund Request Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="font-semibold text-gray-500 mb-0.5">Return Reason:</p>
                                        <p className="font-bold text-gray-800 text-sm">{selectedOrder.refundReason || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-500 mb-0.5">Explanation Details:</p>
                                        <p className="text-gray-700 leading-relaxed">{selectedOrder.refundExplanation || "No additional explanation provided."}</p>
                                    </div>
                                </div>
                                {selectedOrder.refundImages?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">Uploaded Proof Images:</p>
                                        <div className="flex gap-3 flex-wrap">
                                            {selectedOrder.refundImages.map((img, index) => (
                                                <a
                                                    key={index}
                                                    href={`${server}/uploads/${img}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 block shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    <img
                                                        src={`${server}/uploads/${img}`}
                                                        alt={`Proof ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Status & Actions Footer */}
                        <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-600">Current Status:</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600 text-white shadow-sm">
                                    {selectedOrder.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => generateInvoice(selectedOrder)}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 hover:border-violet-300 text-violet-700 rounded-xl text-xs font-bold shadow-sm transition-all"
                                >
                                    📄 Download Invoice
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenDetailsModal(false);
                                        handleOpenEdit(selectedOrder);
                                    }}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                                >
                                    ✏️ Change Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT ORDER STATUS MODAL */}
            {openEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RxCross1 size={20}/>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Edit Order Status
                        </h3>
                        <p className="text-xs text-gray-400 mb-6 font-mono">
                            Order #{statusOrder?._id || selectedOrder?._id}
                        </p>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Update Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white font-medium"
                                >
                                    {orderStatuses.map((st) => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setOpenEditModal(false)}
                                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? "Updating..." : "Update Status"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOrders;