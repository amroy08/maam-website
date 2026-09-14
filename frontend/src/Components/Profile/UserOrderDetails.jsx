import { useEffect, useState } from "react";
import { BsArrowLeft, BsFillBagFill } from "react-icons/bs";
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser, getAllOrdersOfAdmin } from "../../redux/Actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../Styles/Styles.jsx";
import { AiFillStar, AiOutlineMessage, AiOutlineStar, AiOutlineUpload } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

const UserOrderDetails = () => {
    const { orders, adminOrders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [status, setStatus] = useState("");
    const [openReview, setOpenReview] = useState(false);
    const [comment, setComment] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(1);
    const navigate = useNavigate();

    // Refund Modal States
    const [openRefundModal, setOpenRefundModal] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const [refundExplanation, setRefundExplanation] = useState("");
    const [refundImages, setRefundImages] = useState([]);
    const [submittingRefund, setSubmittingRefund] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        if (user?.role === "Admin") {
            dispatch(getAllOrdersOfAdmin());
        } else {
            dispatch(getAllOrdersOfUser(user?._id));
        }
    }, [dispatch, user]);

    const handleMessageSubmit = () => navigate("/inbox?conversation=12356789");

    const data = (orders && orders.find((item) => item._id === id)) || (adminOrders && adminOrders.find((item) => item._id === id));

    useEffect(() => {
        if (data?.status) {
            setStatus(data.status);
        }
    }, [data]);

    const generateInvoice = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const logoUrl = "https://cdn.shopify.com/s/files/1/0412/5117/6615/files/The_Artisan_Marketplace_-_Logo_1caa2512-2a37-417f-948e-bb571f16e582.jpg";
        doc.addImage(logoUrl, "JPEG", 20, 15, 53, 18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("DivineSoul", 200, 20, { align: "right" });
        doc.text("#D-2, Deepak Spinners Ltd. Baddi,", 200, 25, { align: "right" });
        doc.text("Himachal Pradesh, India", 200, 30, { align: "right" });
        doc.text("Email: hello@divinesoul.in", 200, 35, { align: "right" });

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 50, { align: "center" });

        doc.setFillColor(200, 200, 200);
        doc.roundedRect(84, 55, 45, 8, 2, 2, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`STATUS:  ${data?.status.toUpperCase()}`, 87, 60);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 20, 75);
        doc.setFont("helvetica", "normal");
        doc.text(data?.shippingAddress?.address1, 20, 80);
        doc.text(`${data?.shippingAddress?.city}, ${data?.shippingAddress?.country}`, 20, 85);
        doc.text(`Phone: ${data?.user?.phoneNumber}`, 20, 90);

        const invoiceData = [
            ["Invoice #", data?._id.slice(-8)],
            ["Invoice Date", new Date(data?.createdAt).toLocaleDateString()],
            ["Payment Method", data?.paymentInfo?.type || "Cash On Delivery"],
            ["Amount Due", `US$ ${(data?.totalPrice)}`],
        ];

        autoTable(doc,{
            startY: 100,
            margin: { left: 18 },
            body: invoiceData,
            theme: "plain",
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } }
        });

        const items = data?.cart?.map(item => [
            item.name,
            item.qty,
            `US$ ${(item.discountPrice).toFixed(2)}`,
            `US$ ${(item.qty * item.discountPrice).toFixed(2)}`
        ]);

        autoTable(doc,{
            startY: 140,
            margin: { left: 23 },
            head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
            body: items,
            theme: "striped",
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 10,
                fontStyle: "bold"
            },
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 20, halign: "center" },
                2: { cellWidth: 30, halign: "right" },
                3: { cellWidth: 30, halign: "right" }
            }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Subtotal:", 140, finalY, { align: "right" });
        doc.text(`US$ ${(data?.cart[0]?.discountPrice)}`, 170, finalY, { align: "right" });

        doc.text("Shipping:", 140, finalY + 5, { align: "right" });
        doc.text(`US$ ${(data?.totalPrice - data?.cart[0]?.discountPrice).toFixed(2)}`, 170, finalY + 5, { align: "right" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", 140, finalY + 12, { align: "right" });
        doc.text(`US$ ${(data?.totalPrice)}`, 170, finalY + 12, { align: "right" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your business!", 105, 280, { align: "center" });
        doc.text("\u00a9 2025 DivineSoul. All rights reserved.", 105, 285, { align: "center" });

        doc.save(`invoice-${data?._id}.pdf`);
    };

    const reviewHandler = async () => {
        await axios.put(
            `${server}/product/create-new-review`,
            {
                user: data.user,
                rating,
                comment,
                productId: selectedItem?._id,
                orderId: id,
            },
            { withCredentials: true }
        ).then((res) => {
            toast.success(res.data.message);
            dispatch(getAllOrdersOfUser(user._id));
            setComment("");
            setRating(1);
            setOpenReview(false);
        }).catch((error) => {
            toast.error(error.response.data.message);
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setRefundImages(files);
    };

    const submitRefundRequest = async (e) => {
        e.preventDefault();
        if (!refundReason) {
            toast.error("Please select a reason for the return");
            return;
        }

        setSubmittingRefund(true);
        const formData = new FormData();
        formData.append("refundReason", refundReason);
        formData.append("refundExplanation", refundExplanation);
        refundImages.forEach((img) => {
            formData.append("refundImages", img);
        });

        try {
            const res = await axios.put(`${server}/order/order-refund/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success(res.data.message);
            dispatch(getAllOrdersOfUser(user._id));
            setOpenRefundModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting refund");
        } finally {
            setSubmittingRefund(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Review Popup */}
            {openReview && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                            <RxCross1
                                className="text-gray-500 hover:text-gray-700 cursor-pointer h-6 w-6"
                                onClick={() => setOpenReview(false)}
                            />
                        </div>

                        {selectedItem && (
                            <div className="flex items-center md:p-4 hover:bg-gray-50 rounded-lg transition-colors gap-4 sm:gap-6">
                                <Link to={`/product/${selectedItem._id}`} className="flex-shrink-0">
                                    <img
                                        src={`${server}/uploads/${selectedItem.images[0]}`}
                                        alt={selectedItem.name}
                                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                    />
                                </Link>

                                <div className="ml-0 sm:ml-4 flex-1">
                                    <Link to={`/product/${selectedItem._id}`}>
                                        <h3 className="font-medium text-gray-900 hover:underline">
                                            {selectedItem.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {selectedItem.qty} x US${selectedItem.discountPrice}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i)}
                                            className="text-2xl text-amber-400 hover:text-amber-500 transition-colors"
                                        >
                                            {i <= rating ? <AiFillStar /> : <AiOutlineStar />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comment (optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setOpenReview(false)}
                                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={reviewHandler}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Application Modal */}
            {openRefundModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-6 shadow-2xl border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h2 style={{fontFamily: 'var(--font-heading)'}} className="text-xl font-bold text-gray-900">
                                Apply for Refund & Return
                            </h2>
                            <button onClick={() => setOpenRefundModal(false)} className="text-gray-400 hover:text-gray-600">
                                <RxCross1 size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitRefundRequest} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Reason for Return <span className="text-red-500">*</span></label>
                                <select
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-gray-900 bg-white"
                                    required
                                >
                                    <option value="">-- Select Reason --</option>
                                    <option value="Defective / Damaged item">Product was defective or damaged upon delivery</option>
                                    <option value="Incorrect item received">Received incorrect or wrong size/product</option>
                                    <option value="Item not matching description">Item does not match descriptions/photos</option>
                                    <option value="Changed mind / No longer needed">Changed my mind / No longer needed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Additional Explanation</label>
                                <textarea
                                    value={refundExplanation}
                                    onChange={(e) => setRefundExplanation(e.target.value)}
                                    placeholder="Please describe the issue in detail to help speed up approval..."
                                    className="w-full border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-gray-900 bg-white resize-none"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Upload Proof Photos (Max 3)</label>
                                <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer relative bg-gray-50/50">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <AiOutlineUpload size={24} className="text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500 font-semibold">Click to upload images</span>
                                    <span className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, JPEG</span>
                                </div>
                                {refundImages.length > 0 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto py-1">
                                        {refundImages.map((img, idx) => (
                                            <div key={idx} className="text-[10px] bg-violet-50 text-violet-700 px-2.5 py-1 rounded font-medium border border-violet-100 flex items-center gap-1.5">
                                                <span>{img.name.slice(0, 15)}...</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                                <button type="button" onClick={() => setOpenRefundModal(false)} className="btn-outline" style={{padding: '8px 16px', fontSize: 13}}>Cancel</button>
                                <button type="submit" disabled={submittingRefund} className="btn-accent" style={{padding: '8px 20px', fontSize: 13, minHeight: 'unset'}}>
                                    {submittingRefund ? "Submitting..." : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between mb-4 sm:gap-6">
                {/* Left Section */}
                <div className="flex flex-wrap items-center space-x-4">
                    <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-800">
                        <BsArrowLeft className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Back to Orders</span>
                    </Link>
                    <div className="flex items-center px-4 py-2 rounded-lg">
                        <BsFillBagFill className="w-6 h-6 text-blue-600" />
                        <h1 className="ml-2 text-2xl sm:text-3xl font-bold bg-gradient-to-b from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Order Details
                        </h1>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-wrap items-center justify-center sm:justify-end w-full sm:w-auto text-sm text-gray-500">
                    <span>Order ID: #{data?._id?.slice(0, 8)}</span>
                    <span className="mx-2 sm:inline">•</span>
                    <span>Placed on: {data?.createdAt?.slice(0, 10)}</span>
                </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center w-full sm:w-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Products ({data?.cart?.length})</h2>
                    <div
                        className={`${styles.button} bg-[#6443d1] mt-4 md:mr-3 !rounded-lg !h-10 !w-38`}
                        onClick={handleMessageSubmit}
                    >
                        <span className="text-white flex items-center">
                            Send Message <AiOutlineMessage className="ml-1"/>
                        </span>
                    </div>
                </div>
                <div className="space-y-4">
                    {data?.cart?.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-wrap items-center md:p-4 hover:bg-gray-50 rounded-lg transition-colors gap-4 sm:gap-6"
                        >
                            <Link to={`/product/${item._id}`} className="flex-shrink-0">
                                <img
                                    src={`${server}/uploads/${item.images[0]}`}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                            </Link>

                            <div className="ml-0 sm:ml-4 flex-1 w-full sm:w-auto">
                                <Link to={`/product/${item._id}`}>
                                    <h3 className="font-medium text-gray-900 hover:underline">{item.name}</h3>
                                </Link>
                                <p className="font-sans text-gray-500 text-sm mt-1">{item.qty} x INR₹ {item.discountPrice}</p>
                            </div>

                            <div className="ml-auto flex flex-col items-end">
                                {data?.status === "Delivered" && !item.isReviewed && (
                                    <button
                                        onClick={() => {
                                            setOpenReview(true);
                                            setSelectedItem(item);
                                        }}
                                        className={`${styles.button} !w-36 text-white rounded-lg transition-colors gap-x-2 mt-2`}
                                    >
                                        Write Review
                                        <AiFillStar className="w-5 h-5" />
                                    </button>
                                )}

                                <div>
                                    <p className="font-medium font-sans text-gray-900">INR₹ {(item.qty * item.discountPrice)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-end">
                        <div className="text-right">
                            <p className="text-gray-600">Subtotal:</p>
                            <p className="text-2xl font-sans font-bold text-gray-900">INR₹ {data?.totalPrice}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                    <div className="space-y-2 text-gray-600">
                        <p>{data?.shippingAddress.address1}</p>
                        <p> {data?.shippingAddress.address2}, {data?.shippingAddress.city}, {data?.shippingAddress.country}</p>
                        <p>Contact: {data?.user?.phoneNumber}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                data?.paymentInfo?.status === 'Succeeded'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {data?.paymentInfo?.status || 'Not Paid'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="text-gray-900">{data?.paymentInfo?.type || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-x-4 md:gap-x-4 mt-6">
                        <button
                            onClick={generateInvoice}
                            className="bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors"
                        >
                            Download Invoice
                        </button>
                        {data?.status === "Delivered" && (
                            <button
                                onClick={() => setOpenRefundModal(true)}
                                className="bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                            >
                                Request Return / Refund
                            </button>
                        )}
                        {data?.status === "Processing refund" && (
                            <span className="text-xs text-red-500 font-bold tracking-wider uppercase bg-red-50 px-3.5 py-2.5 rounded-lg border border-red-100 self-center">
                                🔄 Refund Processing
                            </span>
                        )}
                        {data?.status === "Refund Success" && (
                            <span className="text-xs text-green-600 font-bold tracking-wider uppercase bg-green-50 px-3.5 py-2.5 rounded-lg border border-green-100 self-center">
                                ✅ Refund Successful
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrderDetails;
