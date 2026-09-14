import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail, MdPayment, MdOutlineQrCodeScanner, MdOutlineAccountBalance } from "react-icons/md";
import { server } from "../../server";

const Payment = () => {
    const [orderData, setOrderData] = useState([]);
    const [open, setOpen] = useState(false);
    const [razorpayMethod, setRazorpayMethod] = useState(""); // card, upi, netbanking
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Mock inputs
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [upiId, setUpiId] = useState("");
    const [bank, setBank] = useState("");
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const order = JSON.parse(localStorage.getItem("latestOrder"));
        setOrderData(order);
    }, []);

    const order = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user && user,
        totalPrice: orderData?.totalPrice,
    };

    const handleRazorpaySuccess = async (e) => {
        e.preventDefault();
        if (paying) return;
        setPaying(true);

        // Simulate Razorpay processing delay
        setTimeout(async () => {
            const config = { headers: { "Content-Type": "application/json" } };
            const paymentId = "pay_mock_" + Math.random().toString(36).substring(2, 12);
            
            order.paymentInfo = {
                id: paymentId,
                status: "Succeeded",
                type: `Razorpay - ${razorpayMethod.toUpperCase()}`,
            };

            try {
                await axios.post(`${server}/order/create-order`, order, config);
                setPaying(false);
                setOpen(false);
                handlePaymentSuccess();
            } catch (err) {
                toast.error("Failed to create order");
                setPaying(false);
            }
        }, 1500);
    };

    const cashOnDeliveryHandler = async (e) => {
        e.preventDefault();
        const config = { headers: { "Content-Type": "application/json" } };
        order.paymentInfo = { type: "Cash On Delivery", status: "Pending" };

        try {
            await axios.post(`${server}/order/create-order`, order, config);
            handlePaymentSuccess();
        } catch (err) {
            toast.error("Failed to create COD order");
        }
    };

    const handlePaymentSuccess = () => {
        navigate("/order/success");
        toast.success("Order placed successfully!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
    };

    return (
        <section className="bg-gray-50 py-12 antialiased min-h-screen">
            {/* Stepper Progress Bar */}
            <div className="max-w-screen-xl mx-auto mb-8 px-4">
                <div className="flex items-center justify-center max-w-lg mx-auto">
                    <div className="flex items-center w-full">
                        <div className="flex flex-col items-center text-emerald-600 relative">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">✓</div>
                            <span className="text-[11px] font-bold mt-1 text-emerald-600 uppercase tracking-wider">Shipping</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-emerald-200 mx-4 -mt-4"></div>
                        <div className="flex flex-col items-center text-violet-600 relative">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
                            <span className="text-[11px] font-bold mt-1 text-violet-600 uppercase tracking-wider">Payment</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-4 -mt-4"></div>
                        <div className="flex flex-col items-center text-gray-400 relative">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
                            <span className="text-[11px] font-bold mt-1 text-gray-400 uppercase tracking-wider">Success</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mt-6 sm:mt-0 lg:flex lg:items-start lg:gap-8">
                    
                    {/* Payment Selector */}
                    <div className="min-w-0 flex-1 space-y-8">
                        <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-150">
                            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{fontFamily: 'var(--font-heading)'}}>Select Payment Method</h2>

                            {/* Razorpay Online Payment Option */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 pb-4 cursor-pointer" onClick={() => setOpen(true)}>
                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-violet-600 bg-violet-50">
                                        <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-semibold text-gray-800">Razorpay (Card, UPI, Netbanking)</h3>
                                        <span className="text-xs text-gray-400">Pay securely via Cards, UPI apps, or Netbanking</span>
                                    </div>
                                    <span className="ml-auto bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Demo Sandbox</span>
                                </div>
                            </div>

                            {/* Cash on Delivery Section */}
                            <div>
                                <div className="flex items-center gap-4 pb-4 cursor-pointer" onClick={() => setOpen(false)}>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!open ? 'border-violet-600 bg-violet-50' : 'border-gray-300'}`}>
                                        {!open && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-semibold text-gray-800">Cash on Delivery (COD)</h3>
                                        <span className="text-xs text-gray-400">Pay with cash upon delivery</span>
                                    </div>
                                </div>

                                {!open && (
                                    <div className="border-t border-gray-100 pt-4 mt-2">
                                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                            Please make sure to have the exact cash amount ready at your delivery address.
                                        </p>
                                        <button
                                            onClick={cashOnDeliveryHandler}
                                            className="btn-primary w-full">
                                            Confirm COD Order (₹ {orderData?.totalPrice?.toLocaleString()})
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cart Totals Panel */}
                    <div className="mt-10 lg:mt-0 lg:w-2/6">
                        <CartData orderData={orderData} />
                    </div>
                </div>
            </div>

            {/* Custom Razorpay Sandbox Dialog Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-100">
                        
                        {/* Razorpay Brand Header */}
                        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold text-sm">R</div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-wide">Razorpay Checkout</h4>
                                    <p className="text-[10px] text-gray-400">Merchant: DivineSoul</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 block">Amount to pay</span>
                                <span className="text-sm font-bold text-blue-400">₹{orderData?.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Sandbox Notice Banner */}
                        <div className="bg-amber-50 border-y border-amber-100 text-amber-800 text-[11px] font-medium px-5 py-2.5 flex items-center justify-between">
                            <span>⚠️ Razorpay Sandbox Testing Mode</span>
                            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-900 font-bold text-sm">×</button>
                        </div>

                        {/* Razorpay Options Side list / selector */}
                        {razorpayMethod === "" ? (
                            <div className="p-5 space-y-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Payment Mode</p>
                                
                                <button onClick={() => setRazorpayMethod("card")} className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all text-left">
                                    <div className="flex items-center gap-3">
                                        <MdPayment className="text-blue-500" size={20}/>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Card Payment</p>
                                            <p className="text-[11px] text-gray-400">Visa, Mastercard, RuPay</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 font-bold">→</span>
                                </button>

                                <button onClick={() => setRazorpayMethod("upi")} className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all text-left">
                                    <div className="flex items-center gap-3">
                                        <MdOutlineQrCodeScanner className="text-emerald-500" size={20}/>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">UPI Apps (GPay, PhonePe)</p>
                                            <p className="text-[11px] text-gray-400">Instant transfer via UPI ID</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 font-bold">→</span>
                                </button>

                                <button onClick={() => setRazorpayMethod("netbanking")} className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all text-left">
                                    <div className="flex items-center gap-3">
                                        <MdOutlineAccountBalance className="text-violet-500" size={20}/>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Netbanking</p>
                                            <p className="text-[11px] text-gray-400">All major Indian banks</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 font-bold">→</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleRazorpaySuccess} className="p-5 space-y-4">
                                <button type="button" onClick={() => setRazorpayMethod("")} className="text-xs text-blue-500 hover:underline">
                                    ← Change payment mode
                                </button>

                                {razorpayMethod === "card" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                maxLength="19"
                                                value={cardNumber}
                                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                                className="input-shopify text-sm"
                                                placeholder="4111 2222 3333 4444"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expiry</label>
                                                <input
                                                    type="text"
                                                    maxLength="5"
                                                    value={expiry}
                                                    onChange={e => setExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').replace(/\/$/, ''))}
                                                    className="input-shopify text-sm"
                                                    placeholder="MM/YY"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">CVV</label>
                                                <input
                                                    type="password"
                                                    maxLength="3"
                                                    value={cvv}
                                                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                                                    className="input-shopify text-sm"
                                                    placeholder="•••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {razorpayMethod === "upi" && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Enter UPI VPA ID</label>
                                        <input
                                            type="text"
                                            value={upiId}
                                            onChange={e => setUpiId(e.target.value)}
                                            className="input-shopify text-sm"
                                            placeholder="username@okhdfcbank"
                                            required
                                        />
                                    </div>
                                )}

                                {razorpayMethod === "netbanking" && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Select Bank</label>
                                        <select
                                            value={bank}
                                            onChange={e => setBank(e.target.value)}
                                            className="w-full border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-gray-900 bg-white"
                                            required
                                        >
                                            <option value="">-- Choose Bank --</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="axis">Axis Bank</option>
                                        </select>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={paying}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm shadow transition-all flex items-center justify-center gap-2"
                                >
                                    {paying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                            <span>Processing Mock Transaction...</span>
                                        </>
                                    ) : (
                                        <span>Pay ₹ {orderData?.totalPrice?.toLocaleString()}</span>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Secured Trust Seal footer */}
                        <div className="bg-gray-50 border-t border-gray-100 p-3 text-center flex items-center justify-center gap-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                            <span>🛡️ Secured by Razorpay Sandbox</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

const CartData = ({ orderData }) => (
    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-heading)'}}>Order Summary</h2>
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({orderData?.cart?.length} items):</span>
                <span className="font-medium text-gray-900">₹{orderData?.subTotalPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping:</span>
                <span className="font-medium text-gray-900">₹{orderData?.shipping?.toLocaleString()}</span>
            </div>
            {orderData?.discountPrice > 0 && (
                <div className="flex justify-between text-sm text-red-600 font-medium">
                    <span>Discount Code:</span>
                    <span>-₹{orderData?.discountPrice?.toLocaleString()}</span>
                </div>
            )}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">₹{orderData?.totalPrice?.toLocaleString()}</span>
            </div>
        </div>
    </div>
);

export default Payment;