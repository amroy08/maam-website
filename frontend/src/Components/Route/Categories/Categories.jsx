import {Link, useNavigate} from "react-router-dom";
import {brandingData, categoriesData} from "../../../Static/Data.jsx";
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import {server, backend_url} from "../../../server.jsx";

const getCategoryImage = (name) => {
    const t = (name || "").toLowerCase();
    if (t.includes("phone") || t.includes("mobile") || t.includes("electronics") || t.includes("gadget") || t.includes("tech"))
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
    if (t.includes("jewel") || t.includes("accessory") || t.includes("ring") || t.includes("necklace"))
        return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80";
    if (t.includes("decor") || t.includes("home") || t.includes("furniture") || t.includes("art"))
        return "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80";
    if (t.includes("fashion") || t.includes("cloth") || t.includes("wear") || t.includes("dress") || t.includes("apparel"))
        return "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80";
    if (t.includes("shoe") || t.includes("footwear") || t.includes("sneaker") || t.includes("boot"))
        return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80";
    if (t.includes("beauty") || t.includes("care") || t.includes("wellness") || t.includes("skin"))
        return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80";
    if (t.includes("sport") || t.includes("fitness") || t.includes("gym"))
        return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80";
    if (t.includes("book") || t.includes("stationery") || t.includes("office"))
        return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80";
    if (t.includes("food") || t.includes("organic") || t.includes("spice"))
        return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80";
    if (t.includes("toy") || t.includes("kids") || t.includes("baby") || t.includes("children"))
        return "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&auto=format&fit=crop&q=80";
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
};

const useReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
            {threshold: 0.12}
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return ref;
};

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const headingRef = useReveal();
    const gridRef = useReveal();

    useEffect(() => {
        axios.get(`${server}/category/get-all-categories`)
            .then((res) => {
                if (res.data.categories?.length > 0) {
                    setCategories(res.data.categories.map(c => {
                        let img = getCategoryImage(c.name);
                        if (c.image) {
                            if (c.image.startsWith("http")) img = c.image;
                            else {
                                const clean = c.image.startsWith("/") ? c.image.slice(1) : c.image;
                                img = `${backend_url}${clean}`;
                            }
                        }
                        return {id: c._id, title: c.name, image_Url: img};
                    }));
                } else {
                    setCategories(categoriesData);
                }
            })
            .catch(() => setCategories(categoriesData));
    }, []);

    return (
        <div className="bg-white">
            {/* Announcement / Branding Strip */}
            <div style={{borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0'}} className="py-5">
                <div className="w-11/12 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {brandingData.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 reveal" ref={i === 0 ? headingRef : null} style={{animationDelay: `${i * 0.1}s`}}>
                            <div className="text-violet-600 shrink-0">{item.icon}</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.Description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="w-11/12 mx-auto py-16">
                {/* Heading */}
                <div className="text-center mb-10 reveal" ref={headingRef}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-2">Shop by Category</p>
                    <h2 className="section-heading">Browse Our Collections</h2>
                </div>

                {/* Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 reveal"
                >
                    {categories.map((cat, i) => (
                        <div
                            key={cat.id}
                            className="group cursor-pointer"
                            style={{animationDelay: `${i * 0.07}s`}}
                            onClick={() => navigate(`/products?category=${encodeURIComponent(cat.title)}`)}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
                                <img
                                    src={cat.image_Url}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.onerror = null; e.target.src = getCategoryImage(cat.title); }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"/>
                                {/* Arrow */}
                                <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                        <path stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" d="M7 17L17 7M17 7H7M17 7v10"/>
                                    </svg>
                                </div>
                            </div>
                            {/* Label */}
                            <div className="mt-2.5 text-center">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{cat.title}</p>
                            </div>
                        </div>
                    ))}

                    {/* View All tile */}
                    <Link to="/products" className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg aspect-square bg-violet-50 border-2 border-dashed border-violet-200 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-violet-600 group-hover:border-violet-600">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-violet-400 group-hover:text-white transition-colors mb-2">
                                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 5v14M5 12h14"/>
                            </svg>
                            <span className="text-xs font-semibold text-violet-500 group-hover:text-white transition-colors uppercase tracking-wide">All Products</span>
                        </div>
                        <div className="mt-2.5 text-center">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">View All</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Categories;