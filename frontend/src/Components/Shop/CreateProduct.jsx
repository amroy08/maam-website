import {useEffect, useState} from "react";
import {AiOutlinePlusCircle, AiOutlineArrowLeft} from "react-icons/ai";
import {MdOutlineInventory2, MdOutlineLocalOffer} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {categoriesData} from "../../Static/Data.jsx";
import {toast} from "react-toastify";
import {createProduct} from "../../redux/Actions/product.js";
import axios from "axios";
import {server} from "../../server";
import {RxCross1} from "react-icons/rx";
import {BsCardImage} from "react-icons/bs";

const SectionTitle = ({number, title, subtitle}) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
            {number}
        </div>
        <div>
            <h3 className="text-base font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

const InputField = ({label, required, children}) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            {label} {required && <span className="text-red-500 normal-case">*</span>}
        </label>
        {children}
    </div>
);

const inputClass = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-300 outline-none";

const CreateProduct = () => {
    const {success, error} = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        axios.get(`${server}/category/get-all-categories`)
            .then((res) => {
                setDynamicCategories(
                    res.data.categories?.length > 0
                        ? res.data.categories.map(c => ({title: c.name}))
                        : categoriesData
                );
            })
            .catch(() => setDynamicCategories(categoriesData));
    }, []);

    useEffect(() => {
        if (error) toast.error(error);
        if (success) {
            toast.success("Product created successfully!");
            navigate("/admin-products");
            window.location.reload();
        }
    }, [dispatch, error, success]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            toast.error("You can only upload up to 3 images.");
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!discountPrice) { toast.error("Selling price is required."); return; }
        if (!category || category === "Choose a category") { toast.error("Please select a category."); return; }
        if (images.length === 0) { toast.error("Please upload at least one product image."); return; }

        const formData = new FormData();
        images.forEach(img => formData.append("images", img));
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("originalPrice", originalPrice);
        formData.append("discountPrice", discountPrice);
        formData.append("stock", stock);
        dispatch(createProduct(formData));
    };

    const discount = originalPrice && discountPrice
        ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
        : 0;

    return (
        <div className="w-full min-h-screen bg-[#f8f7fc] p-4 md:p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Link to="/admin/dashboard" className="hover:text-violet-600 transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link to="/admin-products" className="hover:text-violet-600 transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-gray-600">Create</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-400 mt-1">Fill in the details to publish a product to your store.</p>
                </div>
                <Link
                    to="/admin-products"
                    className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-violet-600 border border-gray-200 bg-white px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                    <AiOutlineArrowLeft /> Back to Products
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column — Main Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="1" title="Basic Information" subtitle="Core details that appear in the product listing" />
                            <div className="space-y-5">
                                <InputField label="Product Name" required>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="e.g. Handmade Clay Vase — Blue"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </InputField>
                                <InputField label="Description" required>
                                    <textarea
                                        rows={4}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Describe your product in detail — materials, dimensions, care instructions..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        required
                                    />
                                </InputField>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Category" required>
                                        <select className={inputClass} value={category} onChange={e => setCategory(e.target.value)} required>
                                            <option value="">Select category...</option>
                                            {dynamicCategories.map(i => (
                                                <option value={i.title} key={i.title}>{i.title}</option>
                                            ))}
                                        </select>
                                    </InputField>
                                    <InputField label="Tags / Keywords">
                                        <input
                                            type="text"
                                            className={inputClass}
                                            placeholder="e.g. handmade, clay, decor"
                                            value={tags}
                                            onChange={e => setTags(e.target.value)}
                                        />
                                    </InputField>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="2" title="Pricing" subtitle="Set the original and discounted selling price" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField label="Original Price (₹)">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                        <input
                                            type="number"
                                            className={`${inputClass} pl-8`}
                                            placeholder="0.00"
                                            value={originalPrice}
                                            onChange={e => setOriginalPrice(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </InputField>
                                <InputField label="Selling Price (₹)" required>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                        <input
                                            type="number"
                                            className={`${inputClass} pl-8`}
                                            placeholder="0.00"
                                            value={discountPrice}
                                            onChange={e => setDiscountPrice(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </InputField>
                                <InputField label="Stock Quantity" required>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        placeholder="e.g. 50"
                                        value={stock}
                                        onChange={e => setStock(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </InputField>
                            </div>
                            {discount > 0 && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold">
                                    <MdOutlineLocalOffer />
                                    Customers save {discount}% with this discount
                                </div>
                            )}
                        </div>

                        {/* Images Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="3" title="Product Images" subtitle="Upload up to 3 high-quality images (first image is the cover)" />
                            <input type="file" id="upload" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                            <label
                                htmlFor="upload"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
                            >
                                <BsCardImage className="text-4xl text-gray-300 group-hover:text-violet-400 transition-colors mb-3" />
                                <p className="text-sm font-semibold text-gray-500 group-hover:text-violet-600 transition-colors">Click to upload or drag & drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP — max 3 images</p>
                            </label>
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                            >
                                                <RxCross1 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column — Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <MdOutlineInventory2 className="text-violet-600" /> Publish Product
                            </h3>
                            <div className="space-y-3 text-xs text-gray-500 mb-6">
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Visibility</span>
                                    <span className="font-semibold text-gray-700">Public</span>
                                </div>
                                {stock && <div className="flex justify-between">
                                    <span>Stock</span>
                                    <span className="font-semibold text-gray-700">{stock} units</span>
                                </div>}
                                {discountPrice && <div className="flex justify-between">
                                    <span>Selling Price</span>
                                    <span className="font-semibold text-violet-700">₹{parseFloat(discountPrice).toLocaleString()}</span>
                                </div>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 hover:shadow-lg transition-all active:scale-95"
                            >
                                Publish Product →
                            </button>
                            <Link
                                to="/admin-products"
                                className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors"
                            >
                                Discard & go back
                            </Link>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">
                            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-3">💡 Pro Tips</h4>
                            <ul className="space-y-2 text-xs text-gray-500">
                                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Use a square image with clean background for best results.</li>
                                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Include dimensions, material & care instructions in the description.</li>
                                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Setting an original price shows buyers the discount clearly.</li>
                                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Tags help customers discover your product via search.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
