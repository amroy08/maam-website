import {AiOutlineDelete, AiOutlineEye, AiOutlineInbox} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {deleteProduct, getAllProductsShop} from "../../redux/Actions/product.js";
import {useEffect} from "react";

const STORE_SHOP_ID = "6a9167f2b11f575ac7323300";

const AllProducts = () => {
    const {products} = useSelector((state) => state.products);
    const {shop} = useSelector((state) => state.shop);
    const dispatch = useDispatch();

    useEffect(() => {
        const shopId = shop?._id || STORE_SHOP_ID;
        dispatch(getAllProductsShop(shopId));
    }, [dispatch, shop?._id]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
        window.location.reload();
    };

    return (
        <div className="w-full mx-4 sm:mx-8 py-4 ">
            <h1 className="text-2xl md:text-4xl mb-2 md:mb-4 font-bold px-10 md:px-6 bg-gradient-to-b from-blue-600 to-purple-600 bg-clip-text text-transparent">All
                Products</h1>

            {/* Desktop Header */}
            <div
                className="hidden sm:grid sm:grid-cols-7 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b font-medium text-sm text-gray-600 rounded-t-xl">
                <div className="min-w-[150px]">Product ID</div>
                <div className="min-w-[180px]">Product Name</div>
                <div className="min-w-[100px]">Price</div>
                <div className="min-w-[80px]">Stock</div>
                <div className="min-w-[130px]">Sold</div>
                <div className="min-w-[100px]">Preview</div>
                <div className="min-w-[120px]">Actions</div>
            </div>

            {/* Product Grid */}
            <div className=" mx-4 sm:mx-0 space-y-4 sm:space-y-0">
                {products && products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                            <AiOutlineInbox className="text-4xl text-gray-400"/>
                        </div>
                        <h5 className="text-gray-500 font-medium">
                            No products found
                        </h5>
                    </div>
                )}
                {products && products.map((item) => (
                    <div
                        key={item._id}
                        className="flex flex-col sm:grid sm:grid-cols-7 gap-4 p-6 sm:p-4 text-sm group hover:bg-gray-50 transition-all rounded-2xl sm:rounded-none bg-white shadow-xl sm:shadow-none border border-gray-100 sm:border-none mb-4 sm:mb-0"
                    >
                        {/* Mobile Header */}
                        <div className="sm:hidden flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 text-lg truncate pr-4">
                                {item.name}
                            </h3>
                            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                #{item._id.slice(-6)}
                            </span>
                        </div>

                        {/* Desktop Product ID */}
                        <div className="hidden sm:block min-w-[150px] text-gray-500 text-xs truncate">
                            {item._id}
                        </div>

                        {/* Product Name - Desktop */}
                        <div className="hidden sm:block sm:min-w-[180px] font-medium text-gray-900">
                            {item.name}
                        </div>

                        {/* Mobile Details Grid */}
                        <div className="sm:hidden grid grid-cols-2 gap-3 w-full mb-4">
                            <div className="space-y-3">
                                <div className="text-gray-500">Price</div>
                                <div className="text-gray-500">Stock</div>
                                <div className="text-gray-500">Sold</div>
                            </div>
                            <div className="space-y-3 font-sans text-right">
                                <div className="text-green-600 font-semibold">
                                    ₹ {item.discountPrice}
                                </div>
                                <div>
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.stock} available
                                    </span>
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className="text-blue-600 font-medium">{item?.sold_out || 0}</span>
                                    <span className="ml-1 text-gray-500 text-xs">units</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden font-sans sm:block sm:min-w-[100px] text-green-600 font-semibold">
                            ₹ {item.discountPrice}
                        </div>

                        {/* Desktop Stock */}
                        <div className="hidden sm:block sm:min-w-[80px]">
                            <span
                                className={`px-3 py-1.5 rounded-full text-xs font-medium ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.stock}
                            </span>
                        </div>

                        {/* Desktop Sold */}
                        <div className="hidden sm:block sm:min-w-[130px]">
                            <div className="flex items-center">
                                <span className="text-blue-600 font-medium">{item?.sold_out || 0}</span>
                                <span className="ml-1 text-gray-500 text-xs">units</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:contents justify-end space-x-4 sm:space-x-0">
                            {/* Preview */}
                            <div className="sm:min-w-[100px]">
                                <Link
                                    to={`/product/${item._id}`}
                                    className="inline-flex items-center hover:bg-gray-100 rounded-full p-2 transition-colors group-hover:bg-gray-100"
                                >
                                    <AiOutlineEye className="text-gray-600 hover:text-blue-500 text-xl"/>
                                    <span className="sm:hidden ml-2 text-sm">View</span>
                                </Link>
                            </div>

                            {/* Delete */}
                            <div className="sm:min-w-[120px]">
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="inline-flex items-center hover:bg-gray-100 rounded-full p-2 transition-colors group-hover:bg-gray-100 text-red-500 hover:text-red-600"
                                >
                                    <AiOutlineDelete className="text-xl"/>
                                    <span className="sm:hidden ml-2 text-sm">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProducts;