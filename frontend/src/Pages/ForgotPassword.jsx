import {useState} from "react";
import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";
import axios from "axios";
import {server} from "../server.jsx";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await axios.post(`${server}/user/forgot-password`, {email});
            toast.success(data.message || "Reset link sent to your email!");
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header activeHeading={0} />
            <section className="min-h-screen py-16 flex flex-col items-center justify-center bg-white px-4">
                <div className="w-full max-w-[420px] mx-auto">
                    {/* Brand Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg mb-3">D</div>
                        <span style={{fontFamily: 'var(--font-heading)'}} className="text-2xl font-bold text-gray-900">DivineSoul</span>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white border border-gray-150 p-8 rounded-lg shadow-sm">
                        <h2 style={{fontFamily: 'var(--font-heading)'}} className="text-xl font-bold text-gray-900 text-center mb-2">
                            Reset Password
                        </h2>
                        <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
                            Enter the email address associated with your account, and we'll email you a link to reset your password.
                        </p>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-shopify text-sm"
                                    placeholder="name@domain.com"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
                            Back to{" "}
                            <Link to="/login" className="text-violet-600 font-semibold hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
