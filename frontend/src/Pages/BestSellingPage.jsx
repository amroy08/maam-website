import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";
import ProductCard from "../Components/Route/ProductCard/ProductCard";

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

const BestSellingPage = () => {
    const {allProducts, isLoading} = useSelector((state) => state.products);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        if (allProducts) {
            const sorted = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
            setData(sorted);
        }
        window.scrollTo(0, 0);
    }, [allProducts]);

    const currentProducts = data.slice(0, currentPage * productsPerPage);

    return (
        <div className="min-h-screen bg-white">
            <Header activeHeading={2}/>

            {/* Hero Banner */}
            <div style={{background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)'}} className="py-10 px-4">
                <div className="max-w-screen-xl mx-auto">
                    <nav className="flex items-center gap-2 text-xs mb-3" style={{color: '#808080'}}>
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/></svg>
                        <span style={{color: '#c0c0c0'}}>Best Selling</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏆</span>
                        <h1 style={{fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', margin: 0}}>
                            Best Sellers
                        </h1>
                    </div>
                    <p style={{fontSize: 13, color: '#808080', marginTop: 6}}>Our most popular products — loved by customers</p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-10">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i}/>)}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-sm mb-4">No products available yet.</p>
                        <Link to="/products"><button className="btn-primary" style={{width: 'auto', display: 'inline-flex'}}>Browse All</button></Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                            {currentProducts.map((item, i) => (
                                <div key={item._id} className="relative">
                                    {/* Rank badge for top 3 */}
                                    {i < 3 && (
                                        <div
                                            className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                                            style={{background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#cd7f32', fontFamily: 'var(--font-body)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}
                                        >
                                            #{i + 1}
                                        </div>
                                    )}
                                    <ProductCard data={item} isShop={true}/>
                                </div>
                            ))}
                        </div>
                        {currentProducts.length < data.length && (
                            <div className="flex flex-col items-center gap-3 py-6">
                                <p className="text-xs text-gray-400">Showing {currentProducts.length} of {data.length}</p>
                                <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-gray-800 h-1.5 rounded-full" style={{width: `${(currentProducts.length / data.length) * 100}%`}}/>
                                </div>
                                <button onClick={() => setCurrentPage(p => p + 1)} className="btn-outline mt-2" style={{width: 'auto', display: 'inline-flex', minWidth: 180}}>
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default BestSellingPage;