import {useEffect, useState, useRef} from "react";
import ProductCard from "../ProductCard/ProductCard";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const SkeletonCard = () => (
    <div className="bg-white rounded overflow-hidden" style={{boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
        <div className="skeleton aspect-square"/>
        <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-1/2 rounded"/>
            <div className="skeleton h-4 w-4/5 rounded"/>
            <div className="skeleton h-3 w-1/3 rounded"/>
            <div className="skeleton h-5 w-2/5 rounded"/>
        </div>
    </div>
);

const BestDeals = () => {
    const {allProducts, isLoading} = useSelector((state) => state.products);
    const [data, setData] = useState([]);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
            {threshold: 0.08}
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (allProducts) {
            const sorted = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
            setData(sorted.slice(0, 5));
        }
    }, [allProducts]);

    return (
        <section className="bg-white py-14" ref={sectionRef}>
            <div className="w-11/12 mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-8 reveal">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-1">Top Picks</p>
                        <h2 className="section-heading">Best Deals</h2>
                    </div>
                    <Link
                        to="/best-selling"
                        className="group flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-violet-700 transition-colors"
                    >
                        View all
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={i}/>)}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <svg className="mx-auto mb-4 w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="1.5" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                        </svg>
                        <p className="text-sm font-medium">No products yet</p>
                        <Link to="/products" className="mt-3 inline-block text-xs font-semibold text-violet-600 hover:underline">Browse catalogue →</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.map((item, i) => (
                            <div key={item._id} className="reveal" style={{animationDelay: `${i * 0.08}s`}}>
                                <ProductCard data={item} isShop={true}/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BestDeals;