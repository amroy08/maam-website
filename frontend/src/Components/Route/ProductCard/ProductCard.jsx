import {useEffect, useState, useRef} from "react";
import {AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart} from "react-icons/ai";
import {Link} from "react-router-dom";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {backend_url} from "../../../server.jsx";
import {useSelector, useDispatch} from "react-redux";
import {addToCart} from "../../../redux/Actions/cart.js";
import {addToWishlist, removeFromWishlist} from "../../../redux/Actions/wishlist";
import {toast} from "react-toastify";
import Ratings from "../../Products/Ratings.jsx";

const ProductCard = ({data, isEvent}) => {
    const {cart} = useSelector((state) => state.cart);
    const {wishlist} = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const [click, setClick] = useState(false);
    const [open, setOpen] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const btnRef = useRef(null);

    const hasDiscount = data.discountPrice > 0;
    const discountPercentage = hasDiscount
        ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
        : 0;

    const addToCartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Ripple
        const btn = btnRef.current;
        if (btn) {
            const circle = document.createElement("span");
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
            circle.classList.add("ripple");
            btn.appendChild(circle);
            setTimeout(() => circle.remove(), 700);
        }
        if (data.stock < 1) { toast.error("Product stock limited!"); return; }
        if (cart?.find((i) => i._id === data._id)) { toast.error("Already in cart!"); return; }
        dispatch(addToCart({...data, qty: 1}));
        toast.success("Added to cart!");
    };

    useEffect(() => {
        setClick(!!(wishlist && wishlist.find((i) => i._id === data._id)));
    }, [wishlist, data._id]);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (click) {
            dispatch(removeFromWishlist(data));
            toast.info("Removed from wishlist");
        } else {
            dispatch(addToWishlist(data));
            toast.success("Added to wishlist!");
        }
        setClick(!click);
    };

    const getProductImage = (item) => {
        const img = item?.images?.[0];
        if (!img) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
        if (typeof img === "string") {
            if (img.startsWith("http")) return img;
            if (img.startsWith("uploads/")) return `${backend_url}${img}`;
            return `${backend_url}uploads/${img}`;
        }
        if (img?.url) return img.url;
        return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
    };

    const productUrl = isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`;

    return (
        <div className="product-card group bg-white flex flex-col" style={{borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
            {/* Image Container */}
            <div className="card-image relative aspect-square bg-gray-50 overflow-hidden">
                <Link to={productUrl} className="block w-full h-full">
                    {/* Skeleton */}
                    {!imgLoaded && <div className="skeleton absolute inset-0" />}
                    <img
                        src={getProductImage(data)}
                        alt={data.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                            setImgLoaded(true);
                        }}
                    />
                    {/* Out of stock overlay */}
                    {data.stock < 1 && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 border border-gray-400 px-3 py-1">Sold Out</span>
                        </div>
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && <span className="badge-sale">-{discountPercentage}%</span>}
                    {data.sold_out === 0 && data.stock > 0 && <span className="badge-new">New</span>}
                </div>

                {/* Action buttons — appear on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={toggleWishlist}
                        className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-all"
                        title={click ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        {click
                            ? <AiFillHeart size={16} color="#e11d48"/>
                            : <AiOutlineHeart size={16} color="#0a0a0a"/>
                        }
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
                        className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-all"
                        title="Quick view"
                    >
                        <AiOutlineEye size={16} color="#0a0a0a"/>
                    </button>
                </div>

                {/* Quick Add — Shopify style slide up on hover */}
                {data.stock > 0 && (
                    <button
                        ref={btnRef}
                        className="quick-add ripple-btn"
                        onClick={addToCartHandler}
                    >
                        <AiOutlineShoppingCart size={14} className="inline mr-1.5"/>
                        Add to Cart
                    </button>
                )}
            </div>

            {/* Card Info */}
            <div className="p-3 flex flex-col gap-1.5 flex-grow">
                {/* Shop name */}
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium truncate">{data.shop?.name}</p>

                {/* Product name */}
                <Link to={productUrl}>
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug hover:text-violet-600 transition-colors line-clamp-2" style={{fontFamily: 'var(--font-body)'}}>
                        {data.name}
                    </h4>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                        <Ratings rating={data?.ratings}/>
                    </div>
                    {data.reviews?.length > 0 && (
                        <span className="text-xs text-gray-400">({data.reviews.length})</span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-auto pt-1">
                    <span className="text-base font-bold text-gray-900">
                        ₹{hasDiscount ? data.discountPrice.toLocaleString() : data.originalPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{data.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            {open && <ProductDetailsCard data={data} setOpen={setOpen}/>}
        </div>
    );
};

export default ProductCard;