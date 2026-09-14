import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/Actions/order";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadShop } from "../../redux/Actions/user";
import { AiOutlineDelete } from "react-icons/ai";
import {FiPlus} from "react-icons/fi";

const WithdrawMoney = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { shop } = useSelector((state) => state.shop);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(50);
    const [bankInfo, setBankInfo] = useState({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: null,
        bankAccountNumber: null,
        bankHolderName: "",
        bankAddress: "",
    });

    useEffect(() => {
        dispatch(getAllOrdersOfShop(shop._id));
    }, [dispatch, shop._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const withdrawMethod = {
            bankName: bankInfo.bankName,
            bankCountry: bankInfo.bankCountry,
            bankSwiftCode: bankInfo.bankSwiftCode,
            bankAccountNumber: bankInfo.bankAccountNumber,
            bankHolderName: bankInfo.bankHolderName,
            bankAddress: bankInfo.bankAddress,
        };

        setPaymentMethod(false);

        await axios
            .put(
                `${server}/shop/update-payment-methods`,
                {
                    withdrawMethod,
                },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success("Withdraw method added successfully!");
                dispatch(loadShop());
                setBankInfo({
                    bankName: "",
                    bankCountry: "",
                    bankSwiftCode: null,
                    bankAccountNumber: null,
                    bankHolderName: "",
                    bankAddress: "",
                });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const deleteHandler = async () => {
        await axios
            .delete(`${server}/shop/delete-withdraw-method`, {
                withCredentials: true,
            })
            .then((res) => {
                toast.success("Withdraw method deleted successfully!");
                dispatch(loadShop());
            });
    };

    const error = () => {
        toast.error("You not have enough balance to withdraw!");
    };

    const withdrawHandler = async () => {
        // Convert values to numbers
        const amount = Number(withdrawAmount);
        const balance = Number(availableBalance);

        if (amount < 50) {
            toast.error("Minimum withdrawal amount is $50!");
        } else if (amount > balance) {
            toast.error("Insufficient balance for this withdrawal!");
        } else {
            await axios
                .post(
                    `${server}/withdraw/create-withdraw-request`,
                    { amount },
                    { withCredentials: true }
                )
                .then((res) => {
                    toast.success("Withdraw request successful!");
                    setOpen(false);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        }
    };

    const availableBalance = shop?.availableBalance.toFixed(2);

    return (
        <div className=" p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Balance</h2>
                    <div className="text-4xl font-sans font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ₹ {availableBalance}
                    </div>
                </div>

                <button
                    onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
                    className={`w-full max-w-xs mx-auto px-6 py-3 rounded-xl font-medium text-white ${
                        availableBalance < 50
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } transition-all shadow-md hover:shadow-lg`}
                    disabled={availableBalance < 50}
                >
                    Request Withdrawal
                </button>

                {availableBalance < 50 && (
                    <p className="text-sm text-red-500 mt-6">⚠️ Withdrawal amount not enough! Sell more to request a withdrawal.</p>
                )}
            </div>


            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl ${
                        paymentMethod ? "max-h-[90vh] overflow-y-auto" : ""
                    }`}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {paymentMethod ? "Add Withdrawal Method" : "Withdraw Funds"}
                            </h3>
                            <RxCross1
                                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                                onClick={() => setOpen(false) || setPaymentMethod(false)}
                            />
                        </div>

                        <div className="p-6">
                            {paymentMethod ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bank Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={bankInfo.bankName}
                                            onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                                            placeholder="Bank of America"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={bankInfo.bankCountry}
                                                onChange={(e) => setBankInfo({ ...bankInfo, bankCountry: e.target.value })}
                                                placeholder="United States"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                IFSC Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={bankInfo.bankSwiftCode}
                                                onChange={(e) => setBankInfo({ ...bankInfo, bankSwiftCode: e.target.value })}
                                                placeholder="BOFAUS3N"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={bankInfo.bankAccountNumber}
                                            onChange={(e) => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })}
                                            placeholder="123456789"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Holder Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={bankInfo.bankHolderName}
                                            onChange={(e) => setBankInfo({ ...bankInfo, bankHolderName: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Save Banking Details
                                    </button>
                                </form>
                            ) : (
                                <>
                                    {shop?.withdrawMethod ? (
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{shop.withdrawMethod.bankName}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            ●●●● {shop.withdrawMethod.bankAccountNumber.slice(-4)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={deleteHandler}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <AiOutlineDelete className="text-xl" />
                                                    </button>
                                                </div>
                                                <div className="text-sm space-y-1">
                                                    <p className="text-gray-600">
                                                        Country: {shop.withdrawMethod.bankCountry}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        IFSC: {shop.withdrawMethod.bankSwiftCode}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Withdrawal Amount
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute font-sans left-4 top-3 text-gray-500">₹</span>
                                                        <input
                                                            type="number"
                                                            value={withdrawAmount}
                                                            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                                            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            min="50"
                                                            max={Number(availableBalance)}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-sans text-gray-500 mt-2">
                                                        Minimum withdrawal: ₹ 50
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={withdrawHandler}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
                                                >
                                                    Confirm Withdrawal
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                                                <FiPlus className="text-3xl text-blue-600" />
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                No Withdrawal Method Added
                                            </h4>
                                            <p className="text-gray-600 mb-6">
                                                Add a bank account to start withdrawing funds
                                            </p>
                                            <button
                                                onClick={() => setPaymentMethod(true)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                            >
                                                Add Bank Account
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawMoney;
