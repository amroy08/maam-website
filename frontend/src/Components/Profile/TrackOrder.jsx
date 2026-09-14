import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/Actions/order";
import { GiCheckMark } from "react-icons/gi";
import { MdLocalShipping, MdOutlineAssignmentReturn } from "react-icons/md";
import { RiLoader2Line, RiTruckLine } from "react-icons/ri";
import { TbPackage } from "react-icons/tb";

const statusConfig = {
    Processing: {
        icon: <RiLoader2Line className="w-8 h-8" />,
        color: "bg-blue-100 text-blue-600",
    },
    "Transferred to delivery partner": {
        icon: <TbPackage className="w-8 h-8" />,
        color: "bg-purple-100 text-purple-600",
    },
    Shipping: {
        icon: <MdLocalShipping className="w-8 h-8" />,
        color: "bg-orange-100 text-orange-600",
    },
    Received: {
        icon: <RiTruckLine className="w-8 h-8" />,
        color: "bg-yellow-100 text-yellow-600",
    },
    "On the way": {
        icon: <RiTruckLine className="w-8 h-8" />,
        color: "bg-green-100 text-green-600",
    },
    Delivered: {
        icon: <GiCheckMark className="w-8 h-8" />,
        color: "bg-green-100 text-green-600",
    },
    "Processing refund": {
        icon: <MdOutlineAssignmentReturn className="w-8 h-8" />,
        color: "bg-red-100 text-red-600",
    },
    "Refund Success": {
        icon: <GiCheckMark className="w-8 h-8" />,
        color: "bg-green-100 text-green-600",
    },
};

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const data = orders && orders.find((item) => item._id === id);

    const statusIndex = [
        "Processing",
        "Transferred to delivery partner",
        "Shipping",
        "Received",
        "On the way",
        "Delivered",
        "Processing refund",
        "Refund Success"
    ].indexOf(data?.status);

    return (
        <div className="min-h-screen  mt-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Tracking</h1>

                    {/* Order Timeline */}
                    <div className="relative">
                        <div className="hidden sm:flex justify-between mb-8">
                            {["Order Confirmed", "Processing", "Shipped", "In Transit", "Out for Delivery", "Delivered", "Refund Requested", "Refund Processed"]
                                .map((step, index) => (
                                    <div key={index} className="flex flex-col items-center w-1/6">
                                        <div className={`w-10 h-9.5 rounded-full flex items-center justify-center 
                      ${index <= statusIndex ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                                            {index <= statusIndex ? <GiCheckMark /> : index + 1}
                                        </div>
                                        <p className={`mt-2 text-sm text-center ${index <= statusIndex ? "text-green-600" : "text-gray-500"}`}>
                                            {step}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Current Status Card */}
                    {data?.status && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <div className="flex items-center">
                                <div className={`rounded-lg p-4 ${statusConfig[data.status].color}`}>
                                    {statusConfig[data.status].icon}
                                </div>
                                <div className="ml-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
                                    <p className="text-lg text-gray-600 mt-1">{data.status}</p>
                                    {data?.updatedAt && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Last updated: {new Date(data.updatedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Order Number</p>
                                <p className="font-medium">#{data?._id?.slice(-8)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Order Date</p>
                                <p className="font-medium">
                                    {data?.createdAt?.slice(0, 10)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Amount</p>
                                <p className="font-medium font-sans">₹ {data?.totalPrice}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Delivery Address</p>
                                <p className="font-medium">
                                    {data?.shippingAddress?.address1}, {data?.shippingAddress?.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {data?.status === "Delivered" && (
                        <div className="mt-8 p-4 bg-green-50 rounded-lg">
                            <p className="text-green-700">
                                🎉 Your order has been successfully delivered! Please consider leaving a review.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;