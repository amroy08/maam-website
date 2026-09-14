import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AiOutlineDelete, AiOutlineArrowRight, AiOutlineInbox, AiOutlinePlus, AiOutlineEdit} from "react-icons/ai";
import {RxCross1} from "react-icons/rx";
import axios from "axios";
import {server, backend_url} from "../../server";
import {toast} from "react-toastify";
import Loader from "../Layout/Loader";
import styles from "../../Styles/Styles";

const AllCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const fetchCategories = () => {
        setIsLoading(true);
        axios
            .get(`${server}/category/get-all-categories`)
            .then((res) => {
                setIsLoading(false);
                setCategories(res.data.categories || []);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Please enter a category name!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }

        if (isEditMode) {
            axios
                .put(`${server}/category/update-category/${selectedCategoryId}`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                    withCredentials: true,
                })
                .then(() => {
                    toast.success("Category updated successfully!");
                    setOpenModal(false);
                    resetForm();
                    fetchCategories();
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message || "Error updating category");
                });
        } else {
            axios
                .post(`${server}/category/create-category`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                    withCredentials: true,
                })
                .then(() => {
                    toast.success("Category created successfully!");
                    setOpenModal(false);
                    resetForm();
                    fetchCategories();
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message || "Error creating category");
                });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios
                .delete(`${server}/category/delete-category/${id}`, {withCredentials: true})
                .then((res) => {
                    toast.success(res.data.message);
                    fetchCategories();
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message || "Error deleting category");
                });
        }
    };

    const openEditModal = (category) => {
        setIsEditMode(true);
        setSelectedCategoryId(category._id);
        setName(category.name);
        setDescription(category.description || "");
        setImage(null);
        setOpenModal(true);
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        resetForm();
        setOpenModal(true);
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setImage(null);
        setSelectedCategoryId("");
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Product Categories
                </h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={openCreateModal}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-colors text-sm"
                    >
                        <AiOutlinePlus size={18}/>
                        Add Category
                    </button>
                    <Link
                        to="/admin/dashboard"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                        Back to Dashboard
                        <AiOutlineArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>

            <div className="bg-white h-[72vh] md:h-[70vh] rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
                <div className="w-full my-8 md:px-8 pt-1">
                    {/* Desktop Header */}
                    <div className="hidden sm:grid grid-cols-5 gap-4 bg-gray-50 p-5 border-b font-medium text-gray-500 text-sm rounded-t-xl shadow-sm">
                        <div className="min-w-[120px]">Image</div>
                        <div className="min-w-[150px]">Name</div>
                        <div className="min-w-[200px] col-span-2">Description</div>
                        <div className="min-w-[100px] text-right">Actions</div>
                    </div>

                    {/* Categories List */}
                    <div>
                        {categories.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                                    <AiOutlineInbox className="text-4xl text-gray-400" />
                                </div>
                                <h5 className="text-gray-500 font-medium">No custom categories found. Add one to get started!</h5>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex flex-col md:items-center sm:grid sm:grid-cols-5 mt-3 mx-5 md:mx-0 gap-3 md:gap-5 p-5 text-sm group hover:shadow-md transition-all rounded-xl bg-white shadow-sm border border-gray-100"
                                >
                                    {/* Image */}
                                    <div className="min-w-[120px]">
                                        <img
                                            src={
                                                !category.image
                                                    ? "https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                                                    : category.image.startsWith("http")
                                                    ? category.image
                                                    : `${backend_url}${category.image.startsWith('/') ? category.image.slice(1) : category.image}`
                                            }
                                            alt={category.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 shadow-sm p-1 bg-gray-50"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";
                                            }}
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="font-semibold text-gray-900 text-base sm:text-sm">
                                        {category.name}
                                    </div>

                                    {/* Description */}
                                    <div className="text-gray-500 col-span-2 break-words">
                                        {category.description || <span className="italic text-gray-300">No description</span>}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 text-right">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Category"
                                        >
                                            <AiOutlineEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Category"
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[500px] p-6 relative">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RxCross1 size={20}/>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {isEditMode ? "Edit Category" : "Add New Category"}
                        </h3>
                        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter category name..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter category description..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm transition-colors"
                                >
                                    {isEditMode ? "Save Changes" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCategories;
