import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";
import ProductCard from "../Components/Route/ProductCard/ProductCard";
import {useSelector} from "react-redux";
import {RxCross1} from "react-icons/rx";
import {backend_url} from "../server";

const SORT_OPTIONS = [
    {label: "Best Selling", value: "sold_out"},
    {label: "Price: Low to High", value: "price_asc"},
    {label: "Price: High to Low", value: "price_desc"},
    {label: "Newest", value: "newest"},
];

const SkeletonCard = () => (
    <div className="bg-white rounded overflow-hidden" style={{boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
        <div className="skeleton aspect-square"/>
        <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-1/2 rounded"/>
            <div className="skeleton h-4 w-4/5 rounded"/>
            <div className="skeleton h-5 w-2/5 rounded"/>
        </div>
    </div>
);

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryData = searchParams.get("category");
    const {allProducts, isLoading} = useSelector((state) => state.products);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("sold_out");
    const [priceRange, setPriceRange] = useState(150000); // Max Price Slider
    const [selectedTag, setSelectedTag] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const productsPerPage = 12;

    // Retrieve unique tags
    const allTags = allProducts ? [...new Set(allProducts.map(p => p.tags).filter(Boolean))] : [];

    useEffect(() => {
        if (allProducts) {
            let processed = [...allProducts];
            
            // Category filter
            if (categoryData) {
                processed = processed.filter(i => i.category === categoryData);
            }

            // Tag filter
            if (selectedTag) {
                processed = processed.filter(i => i.tags === selectedTag);
            }

            // Price filter
            processed = processed.filter(i => (i.discountPrice || i.originalPrice) <= priceRange);

            // Sorting
            if (sortBy === "sold_out") processed.sort((a, b) => b.sold_out - a.sold_out);
            else if (sortBy === "price_asc") processed.sort((a, b) => (a.discountPrice || a.originalPrice) - (b.discountPrice || b.originalPrice));
            else if (sortBy === "price_desc") processed.sort((a, b) => (b.discountPrice || a.originalPrice) - (a.discountPrice || a.originalPrice));
            else if (sortBy === "newest") processed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setData(processed);
            setCurrentPage(1);
        }
        window.scrollTo(0, 0);
    }, [allProducts, categoryData, sortBy, priceRange, selectedTag]);

    const currentProducts = data.slice(0, currentPage * productsPerPage);

    // Get unique categories list
    const allCategories = allProducts ? [...new Set(allProducts.map(p => p.category).filter(Boolean))] : [];

    return (
        <div className="min-h-screen bg-white">
            <Header activeHeading={3}/>

            {/* Page Hero Banner */}
            <div style={{background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)'}} className="py-10 px-4">
                <div className="max-w-screen-xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-3" style={{color: '#808080'}}>
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/></svg>
                        <span style={{color: '#c0c0c0'}}>Products</span>
                        {categoryData && (
                            <>
                                <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/></svg>
                                <span style={{color: '#c0c0c0'}}>{categoryData}</span>
                            </>
                        )}
                    </nav>
                    <h1 style={{fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', margin: 0}}>
                        {categoryData ? categoryData : "All Products"}
                    </h1>
                    {data.length > 0 && (
                        <p style={{fontSize: 13, color: '#808080', marginTop: 6}}>
                            {data.length} product{data.length !== 1 ? "s" : ""} available
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-8">
                {/* Mobile Filter Trigger Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                    <button 
                        onClick={() => setShowMobileFilters(!showMobileFilters)} 
                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Filters
                    </button>

                    {/* Active Pills */}
                    <div className="hidden lg:flex items-center gap-2 flex-wrap">
                        {categoryData && (
                            <span className="flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Category: {categoryData}
                                <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete("category"); setSearchParams(p); }} className="hover:text-red-500 font-bold ml-1">×</button>
                            </span>
                        )}
                        {selectedTag && (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Tag: {selectedTag}
                                <button onClick={() => setSelectedTag("")} className="hover:text-red-500 font-bold ml-1">×</button>
                            </span>
                        )}
                        {priceRange < 150000 && (
                            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Under ₹{priceRange.toLocaleString()}
                                <button onClick={() => setPriceRange(150000)} className="hover:text-red-500 font-bold ml-1">×</button>
                            </span>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                        <span className="text-xs text-gray-500">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="text-xs sm:text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-500 bg-white font-medium cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Left Sidebar (Desktop Filters) */}
                    <div className="hidden lg:block w-1/4 shrink-0 space-y-6">
                        {/* Categories */}
                        <div className="border-b border-gray-100 pb-5">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3" style={{fontFamily: 'var(--font-body)'}}>Categories</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { const p = new URLSearchParams(searchParams); p.delete("category"); setSearchParams(p); }}
                                    className={`block text-sm font-medium text-left w-full hover:text-violet-600 ${!categoryData ? "text-violet-600" : "text-gray-600"}`}
                                >
                                    All Categories
                                </button>
                                {allCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { const p = new URLSearchParams(searchParams); p.set("category", cat); setSearchParams(p); }}
                                        className={`block text-sm font-medium text-left w-full hover:text-violet-600 ${categoryData === cat ? "text-violet-600" : "text-gray-500"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <div className="border-b border-gray-100 pb-5">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3" style={{fontFamily: 'var(--font-body)'}}>Max Price</h4>
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="100"
                                    max="150000"
                                    step="500"
                                    value={priceRange}
                                    onChange={e => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-violet-600 cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
                                />
                                <div className="flex justify-between text-xs font-semibold text-gray-500">
                                    <span>₹100</span>
                                    <span className="text-violet-600">₹{priceRange.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {allTags.length > 0 && (
                            <div className="pb-5">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3" style={{fontFamily: 'var(--font-body)'}}>Filter by Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                                selectedTag === tag
                                                    ? "bg-violet-600 border-violet-600 text-white font-semibold"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(9)].map((_, i) => <SkeletonCard key={i}/>)}
                            </div>
                        ) : data.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                                        <path stroke="currentColor" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                                <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#0a0a0a', marginBottom: 8}}>No products match</h3>
                                <p className="text-sm text-gray-500 mb-6 px-4">Try clearing active filters or adjusting the price slider range.</p>
                                <button
                                    onClick={() => { const p = new URLSearchParams(searchParams); p.delete("category"); setSearchParams(p); setSelectedTag(""); setPriceRange(150000); }}
                                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-100"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                                    {currentProducts.map((item, i) => (
                                        <div key={item._id} className="animate-fade-in-up" style={{animationDelay: `${(i % 10) * 0.05}s`}}>
                                            <ProductCard data={item}/>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Progress */}
                                {currentProducts.length < data.length && (
                                    <div className="flex flex-col items-center gap-3 py-6 border-t border-gray-50">
                                        <p className="text-xs text-gray-400">Showing {currentProducts.length} of {data.length} products</p>
                                        <div className="w-full max-w-xs bg-gray-100 rounded-full h-1">
                                            <div className="bg-violet-600 h-1 rounded-full transition-all duration-500" style={{width: `${(currentProducts.length / data.length) * 100}%`}}/>
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="mt-3 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Load More Products
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Slide-over Panel */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[1000] flex lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)}/>
                    <div className="relative w-[300px] h-full bg-white flex flex-col p-6 animate-slide-in-left shadow-2xl overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <RxCross1 size={18} className="text-gray-600"/>
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="border-b border-gray-100 pb-5 mb-5">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Categories</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { const p = new URLSearchParams(searchParams); p.delete("category"); setSearchParams(p); }}
                                    className={`block text-sm text-left w-full ${!categoryData ? "text-violet-600 font-bold" : "text-gray-600"}`}
                                >
                                    All Categories
                                </button>
                                {allCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { const p = new URLSearchParams(searchParams); p.set("category", cat); setSearchParams(p); }}
                                        className={`block text-sm text-left w-full ${categoryData === cat ? "text-violet-600 font-bold" : "text-gray-500"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="border-b border-gray-100 pb-5 mb-5">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Max Price</h4>
                            <input
                                type="range"
                                min="100"
                                max="150000"
                                step="500"
                                value={priceRange}
                                onChange={e => setPriceRange(Number(e.target.value))}
                                className="w-full accent-violet-600 cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-xs font-semibold text-gray-500 mt-2">
                                <span>₹100</span>
                                <span className="text-violet-600">₹{priceRange.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        {allTags.length > 0 && (
                            <div className="pb-5">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => { setSelectedTag(selectedTag === tag ? "" : tag); }}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                                selectedTag === tag
                                                    ? "bg-violet-600 border-violet-600 text-white font-semibold"
                                                    : "bg-white border-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="mt-auto w-full py-3 bg-violet-600 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-100"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductsPage;