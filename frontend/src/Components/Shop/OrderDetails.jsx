import {useEffect, useState} from "react";
import {BsArrowLeft, BsFillBagFill} from "react-icons/bs";
import jsPDF from 'jspdf';
import {autoTable} from 'jspdf-autotable';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getAllOrdersOfShop} from "../../redux/Actions/order";
import {server} from "../../server";
import axios from "axios";
import {toast} from "react-toastify";
import styles from "../../Styles/Styles.jsx";

const OrderDetails = () => {
    const {orders} = useSelector((state) => state.order);
    const {shop} = useSelector((state) => state.shop);
    const dispatch = useDispatch();
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const {id} = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfShop(shop._id));
    }, [dispatch, shop._id]);

    // Update the generateInvoice function
    const generateInvoice = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Add logo
        const logoUrl = "https://cdn.shopify.com/s/files/1/0412/5117/6615/files/The_Artisan_Marketplace_-_Logo_1caa2512-2a37-417f-948e-bb571f16e582.jpg";
        doc.addImage(logoUrl, "JPEG", 20, 15, 53, 18);

        // Company Info
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("DivineSoul", 200, 20, {align: "right"});
        doc.text("#D-2, Deepak Spinners Ltd. Baddi,", 200, 25, {align: "right"});
        doc.text("Himachal Pradesh, India", 200, 30, {align: "right"});
        doc.text("Email: hello@divinesoul.in", 200, 35, {align: "right"});

        // Invoice Title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 50, {align: "center"});

        // Status Badge
        doc.setFillColor(200, 200, 200);
        doc.roundedRect(84, 55, 45, 8, 2, 2, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`STATUS:  ${data?.status.toUpperCase()}`, 87, 60);

        // Billing Sections
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 20, 75);
        doc.setFont("helvetica", "normal");
        doc.text(data?.shippingAddress?.address1, 20, 80);
        doc.text(`${data?.shippingAddress?.city}, ${data?.shippingAddress?.country}`, 20, 85);
        doc.text(`Phone: ${data?.user?.phoneNumber}`, 20, 90);

        // Invoice Details Table
        const invoiceData = [
            ["Invoice #", data?._id.slice(-8)],
            ["Invoice Date", new Date(data?.createdAt).toLocaleDateString()],
            ["Payment Method", data?.paymentInfo?.type || "Cash On Delivery"],
            ["Amount Due", `US$ ${(data?.totalPrice)}`],
        ];

        autoTable(doc, {
            startY: 100,
            margin: {left: 18},
            body: invoiceData,
            theme: "plain",
            styles: {fontSize: 10, cellPadding: 2},
            columnStyles: {0: {fontStyle: "bold", cellWidth: 50}}
        });

        // Items Table
        const items = data?.cart?.map(item => [
            item.name,
            item.qty,
            `US$ ${(item.discountPrice).toFixed(2)}`,
            `US$ ${(item.qty * item.discountPrice).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 140,
            margin: {left: 23},
            head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
            body: items,
            theme: "striped",
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 10,
                fontStyle: "bold"
            },
            styles: {fontSize: 10, cellPadding: 2},
            columnStyles: {
                0: {cellWidth: 80},
                1: {cellWidth: 20, halign: "center"},
                2: {cellWidth: 30, halign: "right"},
                3: {cellWidth: 30, halign: "right"}
            }
        });

        // Totals Section
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Subtotal:", 140, finalY, {align: "right"});
        doc.text(`US$ ${(data?.cart[0]?.discountPrice)}`, 170, finalY, {align: "right"});

        doc.text("Shipping:", 140, finalY + 5, {align: "right"});
        doc.text(`US$ ${(data?.totalPrice - data?.cart[0]?.discountPrice).toFixed(2)}`, 170, finalY + 5, {align: "right"});

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", 140, finalY + 12, {align: "right"});
        doc.text(`US$ ${(data?.totalPrice)}`, 170, finalY + 12, {align: "right"});

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your business!", 105, 280, {align: "center"});
        doc.text("\u00a9 2025 DivineSoul. All rights reserved.", 105, 285, {align: "center"});

        // Save Invoice
        doc.save(`invoice-${data?._id}.pdf`);
    };

    const data = orders && orders.find((item) => item._id === id);

    useEffect(() => {
        if (data?.status) {
            setStatus(data.status);
        }
    }, [data]);  // Add this useEffect hook

    const orderUpdateHandler = async () => {
        await axios
            .put(
                `${server}/order/update-order-status/${id}`,
                {
                    status,
                },
                {withCredentials: true}
            )
            .then(() => {
                toast.success("Order updated!");
                navigate("/dashboard-orders");
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const refundOrderUpdateHandler = async () => {
        await axios
            .put(
                `${server}/order/order-refund-success/${id}`,
                {
                    status,
                },
                {withCredentials: true}
            )
            .then(() => {
                toast.success("Order updated!");
                dispatch(getAllOrdersOfShop(shop._id));
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between mb-4 sm:gap-6">
                {/* Left Section */}
                <div className="flex flex-wrap items-center space-x-4">
                    <Link to="/dashboard-orders" className="flex items-center text-gray-600 hover:text-gray-800">
                        <BsArrowLeft className="w-5 h-5 mr-2"/>
                        <span className="text-sm font-medium">Back to Orders</span>
                    </Link>
                    <div className="flex items-center px-4 py-2 rounded-lg">
                        <BsFillBagFill className="w-6 h-6 text-blue-600"/>
                        <h1 className="ml-2 text-2xl sm:text-3xl font-bold bg-gradient-to-b from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Order Details
                        </h1>
                    </div>
                </div>

                {/* Right Section */}
                <div
                    className="flex flex-wrap items-center justify-center sm:justify-end w-full sm:w-auto text-sm text-gray-500">
                    <span>Order ID: #{data?._id?.slice(0, 8)}</span>
                    <span className="mx-2 sm:inline">•</span>
                    <span>Placed on: {data?.createdAt?.slice(0, 10)}</span>
                </div>
            </div>


            {/* Order Items Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Products ({data?.cart?.length})</h2>
                <div className="space-y-4">
                    {data?.cart?.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-wrap items-center md:p-4 hover:bg-gray-50 rounded-lg transition-colors gap-4 sm:gap-6"
                        >
                            {/* Product Image */}
                            <Link to={`/product/${item._id}`} className="flex-shrink-0">
                                <img
                                    src={`${server}/uploads/${item.images[0]}`}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                            </Link>

                            {/* Product Info */}
                            <div className="ml-0 sm:ml-4 flex-1 w-full sm:w-auto">
                                <Link to={`/product/${item._id}`}>
                                    <h3 className="font-medium text-gray-900 hover:underline">{item.name}</h3>
                                </Link>
                                <p className="text-gray-500 font-sans text-sm mt-1">{item.qty} x INR₹ {item.discountPrice}</p>
                            </div>

                            {/* Price */}
                            <div className="text-right w-full sm:w-auto">
                                <p className="font-medium font-sans text-gray-900">INR₹ {(item.qty * item.discountPrice).toFixed(2)}</p>
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
                    <div className="flex justify-end gap-x-6">
                        <button
                            onClick={generateInvoice}
                            className={`${styles.button} text-white rounded-lg transition-colors`}
                        >
                            Download Invoice
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Status Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {(data?.status === "Processing refund" || data?.status === "Refund Success"
                            ? // Refund status options
                            [
                                "Processing refund",
                                "Refund Success"
                            ]
                                .slice(
                                    [
                                        "Processing refund",
                                        "Refund Success"
                                    ]
                                        .indexOf(data?.status)
                                )
                            : // Regular status progression including refund options after Delivered
                            [
                                "Processing",
                                "Transferred to delivery partner",
                                "Shipping",
                                "Received",
                                "On the way",
                                "Delivered",
                            ]
                                .slice(
                                [
                                    "Processing",
                                    "Transferred to delivery partner",
                                    "Shipping",
                                    "Received",
                                    "On the way",
                                    "Delivered",
                                ]
                                    .indexOf(data?.status)
                            ))
                            .map((option, index) => (
                                <option value={option} key={index}>{option}</option>
                            ))}
                    </select>

                    <button
                        onClick={data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
                        className="px-6 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 hover:shadow-lg text-white hover:drop-shadow-md rounded-lg transition-colors font-medium"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
