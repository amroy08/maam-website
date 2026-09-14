import {useEffect, useState} from "react";
import {AiOutlineArrowLeft} from "react-icons/ai";
import {MdOutlineLocalOffer, MdEvent} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {categoriesData} from "../../Static/Data.jsx";
import {toast} from "react-toastify";
import {createEvent} from "../../redux/Actions/event.js";
import axios from "axios";
import {server} from "../../server";
import {RxCross1} from "react-icons/rx";
import {BsCardImage, BsCalendarEvent} from "react-icons/bs";
import {FiClock} from "react-icons/fi";

const SectionTitle = ({number, title, subtitle}) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
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

const inputClass = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder-gray-300 outline-none";

const CreateEvent = () => {
    const {success, error} = useSelector((state) => state.events);
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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const today = new Date().toISOString().slice(0, 10);

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
            toast.success("Event created successfully!");
            navigate("/admin-events");
            window.location.reload();
        }
    }, [dispatch, error, success]);

    const handleStartDateChange = (e) => {
        const d = new Date(e.target.value);
        setStartDate(d);
        setEndDate(null);
        const minEnd = new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000);
        document.getElementById("end-date").min = minEnd.toISOString().slice(0, 10);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) { toast.error("Max 3 images allowed."); return; }
        setImages(prev => [...prev, ...files]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!discountPrice) { toast.error("Selling price is required."); return; }
        if (!category) { toast.error("Please select a category."); return; }
        if (!startDate || !endDate) { toast.error("Please set event start and end dates."); return; }
        if (images.length === 0) { toast.error("Please upload at least one image."); return; }

        const formData = new FormData();
        images.forEach(img => formData.append("images", img));
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("originalPrice", originalPrice);
        formData.append("discountPrice", discountPrice);
        formData.append("stock", stock);
        formData.append("startDate", startDate.toISOString());
        formData.append("endDate", endDate.toISOString());
        dispatch(createEvent(formData));
    };

    const discount = originalPrice && discountPrice
        ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
        : 0;

    const durationDays = startDate && endDate
        ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="w-full min-h-screen bg-[#f8f7fc] p-4 md:p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Link to="/admin/dashboard" className="hover:text-amber-600 transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link to="/admin-events" className="hover:text-amber-600 transition-colors">Events</Link>
                        <span>/</span>
                        <span className="text-gray-600">Create</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Create New Event</h1>
                    <p className="text-sm text-gray-400 mt-1">Launch a time-limited sale or promotional event on your store.</p>
                </div>
                <Link
                    to="/admin-events"
                    className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-amber-600 border border-gray-200 bg-white px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                    <AiOutlineArrowLeft /> Back to Events
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="1" title="Event Details" subtitle="Name and description of your promotional event" />
                            <div className="space-y-5">
                                <InputField label="Event Name" required>
                                    <input type="text" className={inputClass} placeholder="e.g. Diwali Special — Handmade Lanterns" value={name} onChange={e => setName(e.target.value)} required />
                                </InputField>
                                <InputField label="Description" required>
                                    <textarea rows={4} className={`${inputClass} resize-none`} placeholder="Describe this event — what's special, what's included, why customers should grab it now..." value={description} onChange={e => setDescription(e.target.value)} required />
                                </InputField>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Category" required>
                                        <select className={inputClass} value={category} onChange={e => setCategory(e.target.value)} required>
                                            <option value="">Select category...</option>
                                            {dynamicCategories.map(i => <option key={i.title} value={i.title}>{i.title}</option>)}
                                        </select>
                                    </InputField>
                                    <InputField label="Tags / Keywords">
                                        <input type="text" className={inputClass} placeholder="e.g. diwali, festive, sale" value={tags} onChange={e => setTags(e.target.value)} />
                                    </InputField>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="2" title="Event Schedule" subtitle="Set when this event starts and expires" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Start Date" required>
                                    <div className="relative">
                                        <BsCalendarEvent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                                        <input type="date" className={`${inputClass} pl-10`} onChange={handleStartDateChange} min={today} value={startDate ? startDate.toISOString().slice(0, 10) : ""} required />
                                    </div>
                                </InputField>
                                <InputField label="End Date" required>
                                    <div className="relative">
                                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                                        <input id="end-date" type="date" className={`${inputClass} pl-10`} onChange={e => setEndDate(new Date(e.target.value))} min={today} value={endDate ? endDate.toISOString().slice(0, 10) : ""} required />
                                    </div>
                                </InputField>
                            </div>
                            {durationDays && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl text-xs font-bold">
                                    <MdEvent /> Event runs for {durationDays} day{durationDays !== 1 ? "s" : ""}
                                </div>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="3" title="Pricing & Stock" subtitle="Set event pricing and available inventory" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField label="Original Price (₹)">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                        <input type="number" className={`${inputClass} pl-8`} placeholder="0.00" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} min="0" />
                                    </div>
                                </InputField>
                                <InputField label="Event Price (₹)" required>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                        <input type="number" className={`${inputClass} pl-8`} placeholder="0.00" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} required min="0" />
                                    </div>
                                </InputField>
                                <InputField label="Stock Quantity" required>
                                    <input type="number" className={inputClass} placeholder="e.g. 20" value={stock} onChange={e => setStock(e.target.value)} required min="0" />
                                </InputField>
                            </div>
                            {discount > 0 && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold">
                                    <MdOutlineLocalOffer /> {discount}% discount on event pricing
                                </div>
                            )}
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <SectionTitle number="4" title="Event Images" subtitle="Upload up to 3 images showcasing this event" />
                            <input type="file" id="upload" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                            <label
                                htmlFor="upload"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                            >
                                <BsCardImage className="text-4xl text-gray-300 group-hover:text-amber-400 transition-colors mb-3" />
                                <p className="text-sm font-semibold text-gray-500 group-hover:text-amber-600 transition-colors">Click to upload or drag & drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP — max 3 images</p>
                            </label>
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            {index === 0 && <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</div>}
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

                    {/* Right Column Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <MdEvent className="text-amber-500" /> Publish Event
                            </h3>
                            <div className="space-y-3 text-xs text-gray-500 mb-6">
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                {startDate && <div className="flex justify-between">
                                    <span>Starts</span>
                                    <span className="font-semibold text-gray-700">{startDate.toLocaleDateString("en-IN", {day:"numeric", month:"short"})}</span>
                                </div>}
                                {endDate && <div className="flex justify-between">
                                    <span>Ends</span>
                                    <span className="font-semibold text-gray-700">{endDate.toLocaleDateString("en-IN", {day:"numeric", month:"short"})}</span>
                                </div>}
                                {durationDays && <div className="flex justify-between">
                                    <span>Duration</span>
                                    <span className="font-semibold text-amber-700">{durationDays} days</span>
                                </div>}
                                {discountPrice && <div className="flex justify-between">
                                    <span>Event Price</span>
                                    <span className="font-semibold text-amber-700">₹{parseFloat(discountPrice).toLocaleString()}</span>
                                </div>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition-all active:scale-95"
                            >
                                Launch Event →
                            </button>
                            <Link to="/admin-events" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors">Discard & go back</Link>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">🎉 Event Tips</h4>
                            <ul className="space-y-2 text-xs text-gray-500">
                                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Events must run for at least 3 days to give customers time to purchase.</li>
                                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Use a bold banner image that grabs attention in the event listing.</li>
                                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> A 20–40% discount drives the most conversions during events.</li>
                                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Keep stock limited to create urgency for buyers.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
