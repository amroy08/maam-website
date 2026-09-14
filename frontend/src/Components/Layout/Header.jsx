import {Link, useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart} from "react-icons/ai";
import {RxCross1} from "react-icons/rx";
import {IoMenu} from "react-icons/io5";
import DropDown from "./DropDown.jsx";
import {useSelector} from "react-redux";
import {backend_url} from "../../server.jsx";
import Cart from "../Cart/Cart.jsx";
import {categoriesData} from "../../Static/Data.jsx";
import Wishlist from "../Wishlist/Wishlist.jsx";
import axios from "axios";
import {server} from "../../server.jsx";

const NAV_LINKS = [
    {label: "Home", to: "/"},
    {label: "Best Selling", to: "/best-selling"},
    {label: "Products", to: "/products"},
    {label: "Events", to: "/events"},
    {label: "About", to: "/faq"},
];

const getCategoryImage = (name) => {
    const t = (name || "").toLowerCase();
    if (t.includes("phone") || t.includes("electronics")) return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop";
    if (t.includes("jewel") || t.includes("accessory")) return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600";
    if (t.includes("decor") || t.includes("home")) return "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600";
    if (t.includes("fashion") || t.includes("cloth")) return "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600";
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
};

const Header = ({activeHeading}) => {
    const location = useLocation();
    const {isAuthenticated, user} = useSelector((state) => state.user);
    const {cart} = useSelector((state) => state.cart);
    const {wishlist} = useSelector((state) => state.wishlist);
    const {allProducts} = useSelector((state) => state.products);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishlist, setOpenWishList] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        axios.get(`${server}/category/get-all-categories`)
            .then(res => {
                if (res.data.categories?.length > 0) {
                    setDynamicCategories(res.data.categories.map(c => {
                        let img = getCategoryImage(c.name);
                        if (c.image) {
                            if (c.image.startsWith("http")) img = c.image;
                            else img = `${backend_url}${c.image.startsWith("/") ? c.image.slice(1) : c.image}`;
                        }
                        return {id: c._id, title: c.name, image_Url: img};
                    }));
                } else setDynamicCategories(categoriesData);
            })
            .catch(() => setDynamicCategories(categoriesData));
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchData(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 0) {
            setSearchData(allProducts?.filter(p => p.name.toLowerCase().includes(term.toLowerCase())) || []);
        } else setSearchData(null);
    };

    const getAvatarSrc = () => {
        if (!user?.avatar) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `${backend_url}${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`;
    };

    const cartCount = cart?.length || 0;
    const wishCount = wishlist?.length || 0;
    const currentPath = location.pathname;

    return (
        <>
            {/* Announcement Bar */}
            <div className="announcement-bar">
                ✦ Free shipping on orders over ₹100 &nbsp;·&nbsp; New arrivals every week
            </div>

            {/* Main Header */}
            <header
                className={`w-full z-50 transition-all duration-300 ${scrolled ? "fixed top-0 left-0 shadow-lg" : "relative"}`}
                style={{background: '#0a0a0a'}}
            >
                <div className="mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="flex items-center justify-between h-16 md:h-[68px]">

                        {/* Mobile: Hamburger */}
                        <button
                            className="md:hidden text-white p-2 -ml-2"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <IoMenu size={26}/>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">D</div>
                            <span style={{fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em'}}>
                                DivineSoul
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {/* Categories dropdown */}
                            <div className="relative">
                                <button
                                    className="nav-link flex items-center gap-1 px-3 py-2"
                                    onClick={() => setDropDown(!dropDown)}
                                >
                                    Categories
                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className={`transition-transform duration-200 ${dropDown ? 'rotate-180' : ''}`}>
                                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6"/>
                                    </svg>
                                </button>
                                {dropDown && (
                                    <div className="absolute left-0 top-full mt-1 animate-fade-in-down z-50">
                                        <DropDown categoriesData={dynamicCategories} setDropDown={setDropDown}/>
                                    </div>
                                )}
                            </div>
                            {NAV_LINKS.map((link, i) => (
                                <Link
                                    key={i}
                                    to={link.to}
                                    className={`nav-link px-3 py-2 ${currentPath === link.to ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Search toggle desktop */}
                            <div className="hidden md:block relative" ref={searchRef}>
                                {searchOpen ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="input-shopify w-64 h-9 text-sm"
                                            style={{background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', borderRadius: 4}}
                                        />
                                        <button onClick={() => { setSearchOpen(false); setSearchTerm(""); setSearchData(null); }} className="text-white/70 hover:text-white">
                                            <RxCross1 size={16}/>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setSearchOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors">
                                        <AiOutlineSearch size={22}/>
                                    </button>
                                )}
                                {/* Search Results */}
                                {searchData?.length > 0 && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                                        {searchData.slice(0, 6).map(item => {
                                            const imgSrc = (() => {
                                                const img = item?.images?.[0];
                                                if (!img) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200";
                                                if (typeof img === "string") {
                                                    if (img.startsWith("http")) return img;
                                                    return `${backend_url}uploads/${img}`;
                                                }
                                                return img?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200";
                                            })();
                                            return (
                                                <Link
                                                    to={`/product/${item._id}`}
                                                    key={item._id}
                                                    onClick={() => { setSearchData(null); setSearchOpen(false); setSearchTerm(""); }}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <img src={imgSrc} alt={item.name} className="w-10 h-10 object-cover rounded" onError={e => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"; }}/>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-500">₹{item.discountPrice || item.originalPrice}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <button
                                onClick={() => setOpenWishList(true)}
                                className="relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                            >
                                <AiOutlineHeart size={22}/>
                                {wishCount > 0 && (
                                    <span className="absolute top-1.5 right-1 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => setOpenCart(true)}
                                className="relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                            >
                                <AiOutlineShoppingCart size={22}/>
                                {cartCount > 0 && (
                                    <span className="absolute top-1.5 right-1 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* User */}
                            {isAuthenticated ? (
                                <Link to="/profile" className="ml-1">
                                    <img
                                        src={getAvatarSrc()}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-violet-400 hover:border-white transition-all"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                                    />
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <button className="hidden md:flex btn-accent text-xs px-4 py-2 ml-1" style={{padding: '8px 16px', minHeight: 'unset', borderRadius: 4}}>
                                        Sign In
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer when sticky */}
            {scrolled && <div style={{height: 68}}/>}

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[100] flex md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/>
                    {/* Drawer */}
                    <div className="relative w-[300px] h-full bg-white flex flex-col animate-slide-in-left" style={{boxShadow: '4px 0 32px rgba(0,0,0,0.2)'}}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs">D</div>
                                <span style={{fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#0a0a0a'}}>DivineSoul</span>
                            </Link>
                            <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                                <RxCross1 size={18} className="text-gray-600"/>
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div className="p-4 border-b border-gray-100" ref={searchRef}>
                            <div className="relative">
                                <AiOutlineSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-violet-400"
                                />
                            </div>
                            {searchData?.length > 0 && (
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-100 shadow-sm">
                                    {searchData.slice(0, 5).map(item => (
                                        <Link key={item._id} to={`/product/${item._id}`} onClick={() => setMobileOpen(false)}
                                              className="flex items-center gap-2 p-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                            <div className="text-xs font-medium text-gray-800 truncate">{item.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 overflow-y-auto p-4">
                            {NAV_LINKS.map((link, i) => (
                                <Link
                                    key={i}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center justify-between py-3 px-2 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${currentPath === link.to ? 'text-violet-700' : 'text-gray-800 hover:text-violet-700'}`}
                                >
                                    {link.label}
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/>
                                    </svg>
                                </Link>
                            ))}
                        </nav>

                        {/* Bottom auth */}
                        <div className="p-4 border-t border-gray-100">
                            {isAuthenticated ? (
                                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                    <img src={getAvatarSrc()} alt="User" className="w-9 h-9 rounded-full object-cover border border-violet-200" onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}/>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{user?.name || "My Profile"}</p>
                                        <p className="text-xs text-gray-500">View profile</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                                        <button className="w-full py-2.5 border border-gray-300 rounded text-sm font-semibold text-gray-800 hover:bg-gray-50">Sign In</button>
                                    </Link>
                                    <Link to="/sign-up" onClick={() => setMobileOpen(false)} className="flex-1">
                                        <button className="w-full py-2.5 bg-violet-600 rounded text-sm font-semibold text-white hover:bg-violet-700">Sign Up</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cart + Wishlist Sidebars */}
            {openCart && <Cart setOpenCart={setOpenCart}/>}
            {openWishlist && <Wishlist setOpenWishList={setOpenWishList}/>}
        </>
    );
};

export default Header;