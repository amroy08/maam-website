import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AiOutlineInbox, AiOutlineEye, AiOutlineDelete, AiOutlineEdit, AiOutlineArrowRight, AiOutlineUpload, AiOutlineStar, AiFillStar} from "react-icons/ai";
import {FaPlus} from "react-icons/fa";
import {RxCross1} from "react-icons/rx";
import {server, backend_url} from "../../server";
import Loader from "../Layout/Loader";
import axios from "axios";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {getAllProducts} from "../../redux/Actions/product.js";
import {categoriesData} from "../../Static/Data.jsx";

const AllProducts = () => {
    const dispatch = useDispatch();
    const {allProducts, isLoading: productsLoading} = useSelector(s => s.products);

    // Edit modal states
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editId, setEditId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    // Image replacement state
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([null, null, null]);

    // Review Modal States
    const [openReviewsModal, setOpenReviewsModal] = useState(false);
    const [reviewsProduct, setReviewsProduct] = useState(null);
    const [isDeletingReview, setIsDeletingReview] = useState(false);

    const handleOpenReviews = (product) => {
        setReviewsProduct(product);
        setOpenReviewsModal(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        setIsDeletingReview(true);
        try {
            const response = await axios.delete(
                `${server}/product/delete-review/${reviewsProduct._id}/${reviewId}`,
                { withCredentials: true }
            );
            toast.success(response.data.message || "Review deleted successfully!");
            
            // Update local state and reload products list
            const updatedProduct = response.data.product;
            setReviewsProduct(updatedProduct);
            dispatch(getAllProducts());
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting review");
        } finally {
            setIsDeletingReview(false);
        }
    };

    useEffect(() => {
        dispatch(getAllProducts());
        axios.get(`${server}/category/get-all-categories`)
            .then((res) => {
                if (res.data.categories?.length > 0) {
                    setDynamicCategories(res.data.categories.map(c => ({title: c.name})));
                } else {
                    setDynamicCategories(categoriesData);
                }
            })
            .catch(() => setDynamicCategories(categoriesData));
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${server}/product/delete-shop-product/${id}`, {withCredentials: true});
            toast.success("Product deleted successfully");
            dispatch(getAllProducts());
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting product");
        }
    };

    const handleOpenEdit = (product) => {
        setEditId(product._id);
        setName(product.name || "");
        setDescription(product.description || "");
        setCategory(product.category || "");
        setTags(product.tags || "");
        setOriginalPrice(product.originalPrice || "");
        setDiscountPrice(product.discountPrice || "");
        setStock(product.stock || "");
        
        // Load existing images up to max 3 slots
        const imgs = product.images || [];
        setExistingImages(imgs.slice(0, 3));
        setNewImageFiles([null, null, null]);
        setOpenEditModal(true);
    };

    const handleReplaceFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const updatedFiles = [...newImageFiles];
            updatedFiles[index] = file;
            setNewImageFiles(updatedFiles);
        }
    };

    const handleDeleteExistingImage = (index) => {
        const updatedImages = [...existingImages];
        updatedImages[index] = null; // Mark as deleted
        setExistingImages(updatedImages);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("originalPrice", originalPrice);
        formData.append("discountPrice", discountPrice);
        formData.append("stock", stock);

        // Map keeping images indices
        const keepImages = [];
        const replaceIndexMap = {}; // mapping local upload index to original index

        let uploadFileCounter = 0;
        for (let i = 0; i < 3; i++) {
            if (existingImages[i] && !newImageFiles[i]) {
                keepImages.push(i);
            } else if (newImageFiles[i]) {
                formData.append("images", newImageFiles[i]);
                replaceIndexMap[i] = uploadFileCounter++;
            }
        }

        formData.append("keepImages", JSON.stringify(keepImages));
        formData.append("replaceIndexMap", JSON.stringify(replaceIndexMap));

        try {
            await axios.put(`${server}/product/update-product/${editId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            toast.success("Product updated successfully!");
            setOpenEditModal(false);
            dispatch(getAllProducts());
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating product");
        } finally {
            setIsUpdating(false);
        }
    };

    if (productsLoading) return <Loader />;

    return (
        <div className="w-full p-4 md:p-8 bg-[#f8f7fc] min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Products</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {allProducts?.length ?? 0} product{allProducts?.length !== 1 ? "s" : ""} in your store
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Link
                        to="/admin-create-product"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 hover:shadow-lg transition-all active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add New Product
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
                {allProducts?.length === 0 ? (
                    <div className="text-center py-20">
                        <AiOutlineInbox className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h5 className="text-gray-400 font-semibold text-base">No products yet</h5>
                        <p className="text-xs text-gray-300 mt-1 mb-6">Get started by adding your first product</p>
                        <Link
                            to="/admin-create-product"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-semibold text-sm rounded-xl hover:bg-violet-700 transition-colors"
                        >
                            <FaPlus className="text-xs" /> Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 text-left font-semibold">Product</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Category</th>
                                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden sm:table-cell">Stock</th>
                                    <th className="px-6 py-4 text-left font-semibold hidden lg:table-cell">Sold</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allProducts?.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.images?.[0]?.url || `${server}/uploads/${product.images?.[0]}`}
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded-lg border border-gray-150 shrink-0"
                                                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-805 truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-[10px] font-mono text-gray-400">#{product._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full">
                                                {product.category || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">₹{product.discountPrice?.toLocaleString()}</p>
                                                {product.originalPrice && product.originalPrice > product.discountPrice && (
                                                    <p className="text-[11px] text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                product.stock === 0 ? "bg-red-50 text-red-600" :
                                                product.stock < 10 ? "bg-amber-50 text-amber-600" :
                                                "bg-emerald-50 text-emerald-700"
                                            }`}>
                                                {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">{product.sold_out || 0}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/product/${product._id}`}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                                    title="Preview"
                                                >
                                                    <AiOutlineEye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenReviews(product)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all relative"
                                                    title="Manage Reviews"
                                                >
                                                    <AiOutlineStar size={18} />
                                                    {product.reviews?.length > 0 && (
                                                        <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                                                            {product.reviews.length}
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Edit Product"
                                                >
                                                    <AiOutlineEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                    title="Delete"
                                                >
                                                    <AiOutlineDelete size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Product Modal */}
            {openEditModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative my-8">
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RxCross1 size={20}/>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Edit Product
                        </h3>
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Description *</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Category *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white"
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
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
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
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Selling Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Images Management Grid (Up to 3 Images) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Product Images (Max 3)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[0, 1, 2].map((idx) => {
                                        const originalImage = existingImages[idx];
                                        const newFile = newImageFiles[idx];

                                        return (
                                            <div key={idx} className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-between min-h-[140px] bg-gray-50/50 relative">
                                                {originalImage && !newFile ? (
                                                    // Existing Image Display
                                                    <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
                                                        <img
                                                            src={`${server}/uploads/${originalImage}`}
                                                            alt={`Product ${idx}`}
                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-150"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteExistingImage(idx)}
                                                            className="text-[10px] text-red-500 hover:underline font-semibold"
                                                        >
                                                            Delete Image
                                                        </button>
                                                    </div>
                                                ) : newFile ? (
                                                    // Local File Upload Preview
                                                    <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
                                                        <img
                                                            src={URL.createObjectURL(newFile)}
                                                            alt={`Preview ${idx}`}
                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-150"
                                                        />
                                                        <span className="text-[9px] text-gray-400 truncate max-w-[80px]">{newFile.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedFiles = [...newImageFiles];
                                                                updatedFiles[idx] = null;
                                                                setNewImageFiles(updatedFiles);
                                                            }}
                                                            className="text-[10px] text-red-500 hover:underline font-semibold"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // Empty Upload Trigger Slot
                                                    <div className="w-full flex-1 flex flex-col items-center justify-center gap-1.5 relative cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleReplaceFileChange(e, idx)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <AiOutlineUpload size={20} className="text-gray-400" />
                                                        <span className="text-[10px] text-gray-400 font-semibold text-center">Add Image {idx + 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviews Management Modal */}
            {openReviewsModal && reviewsProduct && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative my-8 flex flex-col max-h-[85vh]">
                        <button
                            onClick={() => setOpenReviewsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RxCross1 size={20}/>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Reviews for {reviewsProduct.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">
                            Average Rating: {reviewsProduct.ratings?.toFixed(1) || "0.0"} ★ ({reviewsProduct.reviews?.length || 0} reviews)
                        </p>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {reviewsProduct.reviews?.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <AiOutlineStar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p className="font-semibold text-sm">No reviews for this product yet.</p>
                                </div>
                            ) : (
                                reviewsProduct.reviews.map((review) => (
                                    <div key={review._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                                        <img
                                            src={
                                                review.user?.avatar
                                                    ? review.user.avatar.startsWith("http")
                                                        ? review.user.avatar
                                                        : `${backend_url}${review.user.avatar.startsWith("/") ? review.user.avatar.slice(1) : review.user.avatar}`
                                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                            }
                                            alt={review.user?.name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">{review.user?.name || "Anonymous"}</h4>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    disabled={isDeletingReview}
                                                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                    title="Delete Review"
                                                >
                                                    <AiOutlineDelete size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <AiFillStar
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating ? "text-amber-400" : "text-gray-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-xs mt-1 leading-relaxed whitespace-pre-line">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end mt-4 shrink-0">
                            <button
                                onClick={() => setOpenReviewsModal(false)}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProducts;