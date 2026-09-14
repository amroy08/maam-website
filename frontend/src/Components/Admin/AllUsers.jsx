import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/Actions/user";
import { AiOutlineDelete, AiOutlineArrowRight, AiOutlineInbox, AiOutlineEdit } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";

const AllUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [openRoleModal, setOpenRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("user");

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        await axios
            .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message);
            });
        dispatch(getAllUsers());
    };

    const handleRoleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `${server}/user/update-user-role/${selectedUser._id}`,
                { role: newRole },
                { withCredentials: true }
            );
            toast.success(data.message);
            setOpenRoleModal(false);
            dispatch(getAllUsers());
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user role");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-full p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 style={{fontFamily: 'var(--font-heading)'}} className="text-2xl md:text-3xl font-bold text-gray-900">
                        All Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and details</p>
                </div>
                <Link
                    to="/admin/dashboard"
                    className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-2"
                >
                    Back to Dashboard
                    <AiOutlineArrowRight size={16} />
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="p-4 pl-6">User ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {users?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                                            <AiOutlineInbox className="text-4xl text-gray-400" />
                                        </div>
                                        <h5 className="text-gray-500 font-medium">No users found</h5>
                                    </td>
                                </tr>
                            ) : (
                                users?.map((user) => (
                                    <tr key={user?._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6 font-mono text-xs text-gray-400">{user?._id}</td>
                                        <td className="p-4 font-semibold text-gray-950">{user?.name}</td>
                                        <td className="p-4 text-gray-500">{user?.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                user.role === "admin"
                                                    ? 'bg-violet-50 text-violet-700 border border-violet-100'
                                                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                                            }`}>
                                                {user?.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewRole(user.role);
                                                        setOpenRoleModal(true);
                                                    }}
                                                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 text-gray-500 transition-colors"
                                                    title="Edit User Role"
                                                >
                                                    <AiOutlineEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setUserId(user._id);
                                                        setOpen(true);
                                                    }}
                                                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 text-gray-500 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <AiOutlineDelete size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Role Modal */}
            {openRoleModal && selectedUser && (
                <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-gray-150">
                        <div className="flex justify-between items-center mb-4">
                            <h3 style={{fontFamily: 'var(--font-heading)'}} className="text-lg font-bold text-gray-900">
                                Update User Role
                            </h3>
                            <button onClick={() => setOpenRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <RxCross1 size={20} />
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-4">
                            Updating role for <strong>{selectedUser.name}</strong> ({selectedUser.email})
                        </p>

                        <form onSubmit={handleRoleUpdate} className="space-y-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Select Role</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-gray-900 bg-white"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button type="button" onClick={() => setOpenRoleModal(false)} className="btn-outline" style={{padding: '8px 16px', fontSize: 13}}>Cancel</button>
                                <button type="submit" className="btn-accent" style={{padding: '8px 20px', fontSize: 13, minHeight: 'unset'}}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {open && (
                <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-gray-150">
                        <div className="flex justify-end cursor-pointer mb-2">
                            <RxCross1
                                size={20}
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            />
                        </div>
                        <h3 className="text-base font-bold text-center text-gray-900 mb-6">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="w-full flex items-center justify-center gap-3">
                            <button
                                className="btn-outline flex-1"
                                onClick={() => setOpen(false)}
                                style={{padding: '10px'}}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold flex-1 transition-colors"
                                onClick={() => {
                                    setOpen(false);
                                    handleDelete(userId);
                                }}
                                style={{padding: '10px'}}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;