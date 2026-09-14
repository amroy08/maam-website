import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {Link} from "react-router-dom";
import {RxAvatar} from "react-icons/rx";
import {server} from "../../server.jsx";
import {toast} from "react-toastify";
import axios from "axios";

const ShopCreate = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState();
    const [avatar, setAvatar] = useState();
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);


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
        formData.append("phoneNumber", phoneNumber);
        formData.append("address", address);
        formData.append("zipCode", zipCode);
        formData.append("avatar", avatar);

        try {
            const response = await axios.post(`${server}/shop/create-shop`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            // Show success notification
            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 3000,
            });

            // Reset form fields
            setName("");
            setEmail("");
            setPassword("");
            setPhoneNumber("");
            setAddress("");
            setZipCode("");
            setAvatar(null);

        } catch (error) {
            console.error("Registering Seller Error:", error.response.data || error.message);

            // Show error notification
            toast.error(error.response.data.message || "Registration failed. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    window.scrollTo(0, 0);

    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-violet-600 to-fuchsia-400 dark:from-violet-700 dark:to-fuchsia-500 px-4 py-16">
            <h1 className="text-5xl font-bold text-white drop-shadow-md mb-2 text-center">
                DivineSoul
            </h1>
            <h1 className="text-3xl font-semibold text-pink-600 drop-shadow-md mb-8 text-center">
                Sell your products here
            </h1>
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg dark:bg-gray-800 p-8">
                <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-6">
                    Register as a Seller
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Shop Name
                        </label>
                        <input
                            type="name"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="@Company Name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Shop Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Company@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={visible ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                                required
                            />
                            <span
                                onClick={() => setVisible(!visible)}
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                            >
                                {visible ? (
                                    <AiOutlineEye className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                                ) : (
                                    <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                                )}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone-number"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            name="phone-number"
                            id="phone-number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="(123) 456-7890"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Shop Address
                        </label>
                        <input
                            type="address"
                            name="address"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="St. 123, City, Country"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="zipcode"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Zip Code
                        </label>
                        <input
                            type="number"
                            name="zipcode"
                            id="zipcode"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="(123) 456-7890"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                <span
                    className="h-12 w-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {avatar ? (
                      <img src={URL.createObjectURL(avatar)} alt="avatar" className="h-full w-full object-cover"/>
                  ) : (
                      <RxAvatar className="h-12 w-12 text-gray-500 dark:text-gray-400"/>
                  )}

                </span>
                        <label
                            htmlFor={"file-input"}
                            className="ml-4 cursor-pointer bg-gray-300 px-4 py-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500">
                            Upload Avatar
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

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg font-medium focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-500 dark:hover:bg-violet-600 dark:focus:ring-violet-800"
                    >
                        Register now
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Already have an account yet?{' '}
                        <Link to="/shop-login" className="text-violet-600 hover:underline dark:text-violet-400">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default ShopCreate;