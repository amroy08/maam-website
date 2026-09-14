import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsPencil, BsArrowRight } from "react-icons/bs";
import { AiOutlineInbox } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";

const AllWithdraw = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [status, setStatus] = useState("Processing");

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${server}/withdraw/get-all-withdraw-request`, {
                withCredentials: true,
            });
            setWithdrawals(res.data.withdraws);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching withdrawals");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setLoading(true);
            await axios.put(
                `${server}/withdraw/update-withdraw-request/${selectedWithdrawal._id}`,
                {
                    shopId: selectedWithdrawal.shop._id,
                    status
                },
                { withCredentials: true }
            );
            toast.success("Withdrawal status updated successfully!");
            fetchWithdrawals();
            setOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating withdrawal");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-full p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    All Withdrawals
                </h1>
                <Link
                    to="/admin/dashboard"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                >
                    Back to Dashboard
                    <BsArrowRight className="text-sm transform transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="bg-white h-[72vh] md:h-[70vh] rounded-2xl shadow-sm border border-gray-100 overflow-y-scroll">
                <div className="w-full my-8 md:px-8 pt-1">
                    {/* Desktop Header */}
                    <div className="hidden sm:grid grid-cols-7 gap-4 bg-gray-50 p-5 border-b font-medium text-gray-500 text-sm rounded-t-xl shadow-sm">
                        <div className="min-w-[150px]">Withdrawal ID</div>
                        <div className="min-w-[120px]">Shop Name</div>
                        <div className="min-w-[150px]">Shop ID</div>
                        <div className="min-w-[100px]">Amount</div>
                        <div className="min-w-[100px]">Status</div>
                        <div className="min-w-[120px]">Request Date</div>
                        <div className="min-w-[50px] text-right">Actions</div>
                    </div>

                    {/* Withdrawals List */}
                    <div className="">
                        {withdrawals?.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                                    <AiOutlineInbox className="text-4xl text-gray-400" />
                                </div>
                                <h5 className="text-gray-500 font-medium">No withdrawals found</h5>
                            </div>
                        ) : (
                            withdrawals?.map((withdrawal) => (
                                <div
                                    key={withdrawal?._id}
                                    className="flex flex-col md:items-center sm:grid sm:grid-cols-7 mt-3 mx-5 md:mx-0 gap-3 md:gap-5 p-5 sm:p-5 text-sm group hover:shadow-md transition-all rounded-xl bg-white shadow-sm border border-gray-100"
                                >
                                    {/* Mobile Header */}
                                    <div className="sm:hidden flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900 text-base truncate pr-4">
                                            {withdrawal?.seller?.name}
                                        </h3>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            withdrawal.status === "Succeed"
                                                ? "bg-green-100 text-green-800"
                                                : withdrawal.status === "Failed"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {withdrawal?.status}
                                        </span>
                                    </div>

                                    {/* Withdrawal ID */}
                                    <div className="sm:min-w-[150px] text-gray-500">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Withdrawal ID:</span>
                                        <span className="font-mono text-gray-400 text-xs sm:text-sm">{withdrawal?._id.slice(-8)}</span>
                                    </div>

                                    {/* Shop Name */}
                                    <div className="sm:min-w-[120px] text-gray-900">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Shop Name:</span>
                                        {withdrawal?.shop?.name}
                                    </div>

                                    {/* Shop ID */}
                                    <div className="sm:min-w-[150px] text-gray-500">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Shop ID:</span>
                                        <span className="font-mono text-gray-400 text-xs sm:text-sm">{withdrawal?.shop?._id.slice(-8)}</span>
                                    </div>

                                    {/* Amount */}
                                    <div className="sm:min-w-[100px] text-gray-900 font-sans">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Amount:</span>
                                        INR₹ {withdrawal?.amount}
                                    </div>

                                    {/* Status */}
                                    <div className="sm:min-w-[100px]">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Status:</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            withdrawal.status === "Succeed"
                                                ? "bg-green-100 text-green-800"
                                                : withdrawal.status === "Failed"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {withdrawal?.status}
                                        </span>
                                    </div>

                                    {/* Request Date */}
                                    <div className="sm:min-w-[120px] text-gray-500">
                                        <span className="sm:hidden mr-2 text-gray-600 font-medium">Request Date:</span>
                                        {new Date(withdrawal?.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end">
                                        {withdrawal.status === "Processing" && (
                                            <button
                                                onClick={() => {
                                                    setSelectedWithdrawal(withdrawal);
                                                    setStatus(withdrawal.status);
                                                    setOpen(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                                            >
                                                <BsPencil className="bg-blue-800 p-1 rounded-sm text-white" size={30} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile Additional Info */}
                                    <div className="sm:hidden grid grid-cols-3 gap-y-1 mt-4 pt-4 border-t border-gray-100">
                                        <div className="text-gray-500 font-medium col-span-1">Amount:</div>
                                        <div className="text-right text-gray-600 col-span-2">US$ {withdrawal?.amount}</div>
                                        <div className="text-gray-500 font-medium col-span-1">Request Date:</div>
                                        <div className="text-right text-gray-600 col-span-2">
                                            {new Date(withdrawal?.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {open && (
                <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
                    <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded-xl shadow-lg p-6">
                        <div className="w-full flex justify-end cursor-pointer">
                            <RxCross1
                                size={25}
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl text-center py-5 font-semibold text-gray-800">
                            Update Withdrawal Status
                        </h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select New Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Succeed">Succeed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <div className="w-full flex items-center justify-center gap-4">
                            <button
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={handleStatusUpdate}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllWithdraw;