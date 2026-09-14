import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {backend_url, server} from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadShop } from "../../redux/Actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
    const { shop } = useSelector((state) => state.shop);
    const [avatar] = useState();
    const [name, setName] = useState(shop && shop.name);
    const [description, setDescription] = useState(
        shop && shop.description ? shop.description : ""
    );
    const [address, setAddress] = useState(shop && shop.address);
    const [phoneNumber, setPhoneNumber] = useState(shop && shop.phoneNumber);
    const [zipCode, setZipcode] = useState(shop && shop.zipCode);

    const dispatch = useDispatch();

    // const handleImage = async (e) => {
    //     const reader = new FileReader();
    //
    //     reader.onload = () => {
    //         if (reader.readyState === 2) {
    //             setAvatar(reader.result);
    //             axios
    //                 .put(
    //                     `${server}/shop/update-shop-avatar`,
    //                     { avatar: reader.result },
    //                     {
    //                         withCredentials: true,
    //                     }
    //                 )
    //                 .then(() => {
    //                     dispatch(loadShop());
    //                     toast.success("Avatar updated successfully!");
    //                 })
    //                 .catch((error) => {
    //                     toast.error(error.response.data.message);
    //                 });
    //         }
    //     };
    //
    //     reader.readAsDataURL(e.target.files[0]);
    // };

    const updateHandler = async (e) => {
        e.preventDefault();

        await axios
            .put(
                `${server}/shop/update-seller-info`,
                {
                    name,
                    address,
                    zipCode,
                    phoneNumber,
                    description,
                },
                { withCredentials: true }
            )
            .then(() => {
                toast.success("Shop info updated successfully!");
                dispatch(loadShop());
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 w-[980px] sm:px-6 lg:px-8">
            <div className="md:w-[900px] mx-2">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <img
                            src={avatar ? avatar : `${backend_url}${shop?.avatar}`}
                            alt="Shop avatar"
                            className="w-48 h-48 rounded-full object-cover border-4 border-white  shadow-lg"
                        />
                        <div className="absolute bottom-3 right-2 bg-white p-2 rounded-full shadow-md transition-all  cursor-pointer">
                            <input
                                type="file"
                                id="image"
                                className="hidden"
                            />
                            <label htmlFor="image" className="cursor-pointer">
                                <AiOutlineCamera className="text-gray-700 text-xl" />
                            </label>
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Shop Profile</h2>
                </div>

                {/* Settings Form */}
                <form onSubmit={updateHandler} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Shop Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter shop name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none transition-all"
                                placeholder="Describe your shop..."
                            />
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter shop address"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        {/* Zip Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipcode(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter zip code"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-tr from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-all transform hover:scale-[1.01]"
                        >
                            Update Shop Information
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopSettings;