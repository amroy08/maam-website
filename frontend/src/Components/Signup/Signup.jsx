import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {Link, useNavigate} from "react-router-dom";
import {RxAvatar} from "react-icons/rx";
import {server} from "../../server.jsx";
import {toast} from "react-toastify";
import axios from "axios";
import {useDispatch} from "react-redux";
import {loadUser} from "../../redux/Actions/user.js";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar);

        try {
            const response = await axios.post(`${server}/user/create-user`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true
            });

            toast.success("Account created successfully!");
            dispatch(loadUser());
            navigate("/");
            
            // Reset
            setName("");
            setEmail("");
            setPassword("");
            setAvatar(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
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
                        Create Account
                    </h2>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                placeholder="John Doe"
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-shopify text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="name@domain.com"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-shopify text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-shopify text-sm pr-10"
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

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-4 py-2">
                            <span className="h-11 w-11 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 shrink-0">
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="avatar" className="h-full w-full object-cover"/>
                                ) : (
                                    <RxAvatar size={24} className="text-gray-400"/>
                                )}
                            </span>
                            <label
                                htmlFor="file-input"
                                className="cursor-pointer border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors"
                            >
                                Upload Image
                                <input
                                    type="file"
                                    name="avatar"
                                    id="file-input"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileInputChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>

                        <button type="submit" className="btn-primary w-full mt-2">
                            Create Account
                        </button>
                    </form>

                    {/* Social signup divider */}
                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-150"></div>
                        </div>
                        <span className="relative px-3 bg-white text-xs text-gray-400 uppercase font-semibold">Or continue with</span>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                toast.info("Redirecting to Google Sandbox signup...");
                                setTimeout(() => {
                                    setName("Google User");
                                    setEmail("googleuser@gmail.com");
                                    setPassword("googlepass123");
                                    toast.success("Google signup details filled!");
                                }, 1000);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-violet-600 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
