import {useState, useEffect} from "react";
import axios from "axios";
import {server, backend_url} from "../../server.jsx";
import {toast} from "react-toastify";
import {AiOutlineDelete, AiOutlinePlus, AiOutlineEdit} from "react-icons/ai";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar.jsx";

const AdminDashboardHero = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editSlideId, setEditSlideId] = useState(null);

    // Form inputs
    const [mediaFile, setMediaFile] = useState(null);
    const [tag, setTag] = useState("");
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [ctaText, setCtaText] = useState("Shop Now");
    const [ctaLink, setCtaLink] = useState("/products");
    const [align, setAlign] = useState("left");

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get(`${server}/hero-slide/get-all-slides`);
            setSlides(data.slides || []);
        } catch (err) {
            toast.error("Failed to load slides");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const openCreateModal = () => {
        setEditSlideId(null);
        setMediaFile(null);
        setTag("New Collection");
        setHeading("");
        setSubHeading("");
        setCtaText("Shop Now");
        setCtaLink("/products");
        setAlign("left");
        setShowModal(true);
    };

    const openEditModal = (slide) => {
        setEditSlideId(slide._id);
        setMediaFile(null);
        setTag(slide.tag);
        setHeading(slide.heading);
        setSubHeading(slide.subHeading);
        setCtaText(slide.ctaText);
        setCtaLink(slide.ctaLink);
        setAlign(slide.align);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (mediaFile) formData.append("image", mediaFile); // Uses "image" multipart key expected by upload.single
        formData.append("tag", tag);
        formData.append("heading", heading);
        formData.append("subHeading", subHeading);
        formData.append("ctaText", ctaText);
        formData.append("ctaLink", ctaLink);
        formData.append("align", align);

        try {
            if (editSlideId) {
                await axios.put(`${server}/hero-slide/update-slide/${editSlideId}`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                    withCredentials: true,
                });
                toast.success("Slide updated successfully!");
            } else {
                if (!mediaFile) {
                    toast.error("Please upload an image or video file");
                    return;
                }
                await axios.post(`${server}/hero-slide/create-slide`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                    withCredentials: true,
                });
                toast.success("Slide added successfully!");
            }
            setShowModal(false);
            fetchSlides();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save slide");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slide?")) return;
        try {
            await axios.delete(`${server}/hero-slide/delete-slide/${id}`, {withCredentials: true});
            toast.success("Slide deleted successfully!");
            fetchSlides();
        } catch (err) {
            toast.error("Failed to delete slide");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSideBar active={13}/>

            <div className="flex-1 p-6 md:p-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 style={{fontFamily: 'var(--font-heading)'}} className="text-2xl md:text-3xl font-bold text-gray-900">
                            Homepage Hero Slides
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage the dynamic carousel media banners (images &amp; videos) on your homepage</p>
                    </div>
                    <button onClick={openCreateModal} className="btn-accent flex items-center gap-2 text-xs font-semibold py-3 px-5 rounded-md" style={{padding: '10px 18px', minHeight: 'unset'}}>
                        <AiOutlinePlus size={16}/> Add Slide
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"/>
                    </div>
                ) : slides.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-150 p-12 text-center shadow-sm">
                        <p className="text-gray-400 text-sm mb-4">No custom homepage slides uploaded. System will use default slides.</p>
                        <button onClick={openCreateModal} className="btn-outline" style={{padding: '8px 16px', fontSize: 13}}>
                            Upload First Slide
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slides.map((s, i) => (
                            <div key={s._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    {s.mediaType === "video" ? (
                                        <video
                                            src={`${backend_url}${s.mediaUrl}`}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            autoPlay
                                            loop
                                        />
                                    ) : (
                                        <img
                                            src={`${backend_url}${s.mediaUrl}`}
                                            alt={s.heading}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"; }}
                                        />
                                    )}
                                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                                        {s.mediaType === "video" ? "Video Slide" : "Image Slide"} #{i + 1}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                                            {s.tag}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                            Text Align: {s.align}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-1" style={{fontFamily: 'var(--font-body)', fontSize: 15}}>{s.heading}</h3>
                                    {s.subHeading && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{s.subHeading}</p>}

                                    <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                                        <a href={s.ctaLink} target="_blank" rel="noreferrer" className="text-xs text-violet-600 hover:underline font-semibold">
                                            CTA: {s.ctaText} →
                                        </a>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(s)} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                                                <AiOutlineEdit size={16}/>
                                            </button>
                                            <button onClick={() => handleDelete(s._id)} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-red-50 text-red-600">
                                                <AiOutlineDelete size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 style={{fontFamily: 'var(--font-heading)'}} className="text-xl font-bold text-gray-900 mb-5">
                            {editSlideId ? "Edit Slide" : "Add Homepage Media Slide"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Banner File (Image or Video)</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={e => setMediaFile(e.target.files[0])}
                                    className="w-full text-sm border border-gray-200 rounded p-2"
                                    required={!editSlideId}
                                />
                                <span className="text-[10px] text-gray-400 mt-1 block">Supports popular image files and .mp4, .mov, or .webm video uploads.</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Label Tag</label>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={e => setTag(e.target.value)}
                                        className="input-shopify text-sm"
                                        placeholder="e.g. New Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Text Align</label>
                                    <select
                                        value={align}
                                        onChange={e => setAlign(e.target.value)}
                                        className="w-full border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-gray-900"
                                    >
                                        <option value="left">Left Align</option>
                                        <option value="center">Center Align</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Heading (Supports new lines)</label>
                                <textarea
                                    value={heading}
                                    onChange={e => setHeading(e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded text-sm outline-none focus:border-gray-900 h-20"
                                    placeholder="Discover Artisan&#10;Craftsmanship"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Sub-heading Description</label>
                                <input
                                    type="text"
                                    value={subHeading}
                                    onChange={e => setSubHeading(e.target.value)}
                                    className="input-shopify text-sm"
                                    placeholder="Handmade with love — every piece tells a story."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={ctaText}
                                        onChange={e => setCtaText(e.target.value)}
                                        className="input-shopify text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">CTA Link Path</label>
                                    <input
                                        type="text"
                                        value={ctaLink}
                                        onChange={e => setCtaLink(e.target.value)}
                                        className="input-shopify text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{padding: '8px 16px', fontSize: 13}}>Cancel</button>
                                <button type="submit" className="btn-accent" style={{padding: '8px 20px', fontSize: 13, minHeight: 'unset'}}>Save Slide</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardHero;
