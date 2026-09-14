import {useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import axios from "axios";
import {server} from "../server.jsx";
import {toast} from "react-toastify";

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const {data} = await axios.post(`${server}/user/reset-password`, {token, password});
            toast.success(data.message || "Password updated successfully!");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
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
                        <h2 style={{fontFamily: 'var(--font-heading)'}} className="text-xl font-bold text-gray-900 text-center mb-6">
                            Set New Password
                        </h2>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="pass" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={visible ? "text" : "password"}
                                        id="pass"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-shopify text-sm pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setVisible(!visible)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {visible ? <AiOutlineEye size={18}/> : <AiOutlineEyeInvisible size={18}/>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPass" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPass"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-shopify text-sm"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ResetPassword;
