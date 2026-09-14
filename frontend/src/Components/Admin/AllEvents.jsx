import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AiOutlineDelete, AiOutlineInbox, AiOutlineEye, AiOutlineEdit, AiOutlineArrowRight} from "react-icons/ai";
import {FaPlus} from "react-icons/fa";
import {RxCross1} from "react-icons/rx";
import {BsCalendarEvent} from "react-icons/bs";
import axios from "axios";
import {server} from "../../server";
import {toast} from "react-toastify";
import Loader from "../Layout/Loader";
import {categoriesData} from "../../Static/Data.jsx";

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [eventId, setEventId] = useState("");
    const [loading, setLoading] = useState(false);

    // Edit Modal State
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editId, setEditId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchEvents = () => {
        axios.get(`${server}/event/admin-all-events`, {withCredentials: true})
            .then(res => setEvents(res.data.events))
            .catch(err => toast.error(err.response?.data?.message || "Error fetching events"));
    };

    useEffect(() => {
        fetchEvents();
        axios.get(`${server}/category/get-all-categories`)
            .then((res) => {
                if (res.data.categories?.length > 0) {
                    setDynamicCategories(res.data.categories.map(c => ({title: c.name})));
                } else {
                    setDynamicCategories(categoriesData);
                }
            })
            .catch(() => setDynamicCategories(categoriesData));
    }, []);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${server}/event/delete-shop-event/${id}`, {withCredentials: true});
            toast.success("Event deleted successfully!");
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting event");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleOpenEdit = (event) => {
        setEditId(event._id);
        setName(event.name || "");
        setDescription(event.description || "");
        setCategory(event.category || "");
        setTags(event.tags || "");
        setOriginalPrice(event.originalPrice || "");
        setDiscountPrice(event.discountPrice || "");
        setStock(event.stock || "");
        setStartDate(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : "");
        setEndDate(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : "");
        setOpenEditModal(true);
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await axios.put(`${server}/event/update-event/${editId}`, {
                name,
                description,
                category,
                tags,
                originalPrice,
                discountPrice,
                stock,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
            }, {withCredentials: true});

            toast.success("Event updated successfully!");
            setOpenEditModal(false);
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating event");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <Loader />;

    const getEventStatus = (event) => {
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        if (now < start) return {label: "Upcoming", cls: "bg-blue-50 text-blue-700"};
        if (now > end) return {label: "Ended", cls: "bg-gray-100 text-gray-500"};
        return {label: "Live", cls: "bg-emerald-50 text-emerald-700"};
    };

    return (
        <div className="w-full p-4 md:p-8 bg-[#f8f7fc] min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Events</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {events?.length ?? 0} event{events?.length !== 1 ? "s" : ""} in your store
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Link
                        to="/admin-create-event"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition-all active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Create New Event
                    </Link>
                    <Link
                        to="/admin/dashboard"
                        className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-2"
                    >
                        Back to Dashboard
                        <AiOutlineArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {events?.length === 0 ? (
                    <div className="text-center py-20">
                        <BsCalendarEvent className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h5 className="text-gray-400 font-semibold text-base">No events yet</h5>
                        <p className="text-xs text-gray-300 mt-1 mb-6">Create a time-limited sale or promotion</p>
                        <Link
                            to="/admin-create-event"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-white font-semibold text-sm rounded-xl hover:bg-amber-600 transition-colors"
                        >
                            <FaPlus className="text-xs" /> Create Event
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 text-left font-semibold">Event</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Duration</th>
                                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden sm:table-cell">Stock</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden lg:table-cell">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {events?.map((event) => {
                                    const status = getEventStatus(event);
                                    return (
                                        <tr key={event._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {event.images?.[0]?.url || event.images?.[0] ? (
                                                        <img
                                                            src={event.images[0].url || `${server}/uploads/${event.images[0]}`}
                                                            alt={event.name}
                                                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                                                            onError={(e) => { e.target.src = "/default.png"; }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                                            <BsCalendarEvent className="text-amber-300" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900 truncate max-w-[160px]">{event.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-mono">#{event._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="text-xs text-gray-500">
                                                    <p>{event.startDate ? new Date(event.startDate).toLocaleDateString("en-IN", {day:"numeric", month:"short"}) : "—"}</p>
                                                    <p className="text-gray-300">→ {event.endDate ? new Date(event.endDate).toLocaleDateString("en-IN", {day:"numeric", month:"short"}) : "—"}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">₹{event.discountPrice?.toLocaleString()}</p>
                                                    {event.originalPrice && event.originalPrice > event.discountPrice && (
                                                        <p className="text-[11px] text-gray-400 line-through">₹{event.originalPrice?.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    event.stock === 0 ? "bg-red-50 text-red-600" :
                                                    event.stock < 5 ? "bg-amber-50 text-amber-600" :
                                                    "bg-emerald-50 text-emerald-700"
                                                }`}>
                                                    {event.stock === 0 ? "Sold out" : `${event.stock} left`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.cls}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/product/${event._id}?isEvent=true`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                                        title="Preview"
                                                    >
                                                        <AiOutlineEye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleOpenEdit(event)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                        title="Edit Event"
                                                    >
                                                        <AiOutlineEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setEventId(event._id); setOpen(true); }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                        title="Delete"
                                                    >
                                                        <AiOutlineDelete size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {open && (
                <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                        <div className="flex justify-end mb-2">
                            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                                <RxCross1 size={16} />
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <AiOutlineDelete className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Event?</h3>
                            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The event and all its data will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(eventId)}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors"
                                >
                                    Delete Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {openEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative my-8">
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RxCross1 size={20}/>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                            Edit Event
                        </h3>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Event Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Description *</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Category *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select category...</option>
                                        {dynamicCategories.map((c) => (
                                            <option key={c.title} value={c.title}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Tags</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Event Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setOpenEditModal(false)}
                                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-md hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllEvents;