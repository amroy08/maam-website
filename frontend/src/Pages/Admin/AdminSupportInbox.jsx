import {useEffect, useRef, useState, useCallback} from "react";
import {useSelector} from "react-redux";
import {format} from "timeago.js";
import axios from "axios";
import {server, backend_url} from "../../server.jsx";
import {AiOutlineSend} from "react-icons/ai";
import AdminSideBar from "../../Components/Admin/Layout/AdminSideBar.jsx";

const ADMIN_ID = "6a9165363217335db76c66aa";
const POLL_INTERVAL = 5000; // 5 seconds

const AdminSupportInbox = () => {
    const {user} = useSelector(state => state.user);
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [userCache, setUserCache] = useState({});
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const pollRef = useRef(null);
    const activeConvRef = useRef(null);

    // Keep ref in sync
    useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);

    // Fetch messages for active conversation (used by polling)
    const fetchMessages = useCallback(async (convId) => {
        try {
            const {data} = await axios.get(`${server}/message/get-all-messages/${convId}`);
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Poll messages error:", err);
        }
    }, []);

    // Fetch all support conversations
    const fetchConversations = useCallback(async () => {
        try {
            const {data} = await axios.get(`${server}/conversation/get-all-support-conversations`, {withCredentials: true});
            setConversations(data.conversations || []);

            // Fetch user info for each conversation
            const cache = {};
            await Promise.all(
                (data.conversations || []).map(async (conv) => {
                    const userId = conv.members.find(m => m !== ADMIN_ID);
                    if (userId && !cache[userId]) {
                        try {
                            const res = await axios.get(`${server}/user/user-info/${userId}`, {withCredentials: true});
                            cache[userId] = res.data.user;
                        } catch {
                            cache[userId] = {name: "User", avatar: ""};
                        }
                    }
                })
            );
            setUserCache(prev => ({...prev, ...cache}));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Start polling when a conversation is active
    useEffect(() => {
        clearInterval(pollRef.current);
        if (!activeConv?._id) return;
        pollRef.current = setInterval(() => {
            if (activeConvRef.current?._id) {
                fetchMessages(activeConvRef.current._id);
            }
        }, POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [activeConv, fetchMessages]);

    // Open a conversation
    const openConversation = async (conv) => {
        setActiveConv(conv);
        try {
            const {data} = await axios.get(`${server}/message/get-all-messages/${conv._id}`);
            setMessages(data.messages || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Send message as admin
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv || sending) return;
        setSending(true);
        try {
            const {data} = await axios.post(`${server}/message/create-new-message`, {
                sender: ADMIN_ID,
                text: newMessage.trim(),
                conversationId: activeConv._id,
            });
            setMessages(prev => [...prev, data.message]);
            await axios.put(`${server}/conversation/update-last-message/${activeConv._id}`, {
                lastMessage: newMessage.trim(),
                lastMessageId: ADMIN_ID,
            });
            setNewMessage("");
            inputRef.current?.focus();
            fetchConversations();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [messages]);

    const getOtherUser = (conv) => {
        const uid = conv.members.find(m => m !== ADMIN_ID);
        return userCache[uid] || null;
    };

    const getUserAvatar = (user) => {
        if (!user?.avatar) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `${backend_url}${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSideBar active={9}/>

            <div className="flex-1 flex flex-col" style={{marginLeft: 0}}>
                {/* Page Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-5">
                    <h1 style={{fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: '#0a0a0a', margin: 0}}>
                        Support Inbox
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Respond to customer messages</p>
                </div>

                {/* Chat Layout */}
                <div className="flex flex-1 overflow-hidden m-6 bg-white rounded-2xl shadow-sm border border-gray-100" style={{maxHeight: 'calc(100vh - 160px)'}}>

                    {/* Conversations List */}
                    <div className="w-72 border-r border-gray-100 flex flex-col overflow-y-auto shrink-0">
                        <div className="p-4 border-b border-gray-50">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                Conversations ({conversations.length})
                            </p>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"/>
                                <p className="text-xs text-gray-400">Loading...</p>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                                        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-400">No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map(conv => {
                                const other = getOtherUser(conv);
                                const isActive = activeConv?._id === conv._id;
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => openConversation(conv)}
                                        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-all"
                                        style={{background: isActive ? '#f5f3ff' : 'white', borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent'}}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#fafafa'; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white'; }}
                                    >
                                        {/* Avatar */}
                                        <img
                                            src={getUserAvatar(other)}
                                            alt={other?.name || "User"}
                                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100"
                                            onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{other?.name || "Customer"}</p>
                                            <p className="text-xs text-gray-400 truncate">{conv.lastMessage || "No messages yet"}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-300 shrink-0">
                                            {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ""}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Message Panel */}
                    <div className="flex-1 flex flex-col">
                        {!activeConv ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-violet-400">
                                            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-gray-600 font-medium mb-1">Select a conversation</h3>
                                    <p className="text-sm text-gray-400">Choose a customer from the list to reply</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Conversation Header */}
                                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white">
                                    {(() => {
                                        const other = getOtherUser(activeConv);
                                        return (
                                            <>
                                                <img src={getUserAvatar(other)} alt={other?.name} className="w-8 h-8 rounded-full object-cover border border-gray-100" onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}/>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{other?.name || "Customer"}</p>
                                                    <p className="text-xs text-gray-400">{other?.email || ""}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <span className="text-xs bg-violet-50 text-violet-700 font-semibold px-2.5 py-1 rounded-full">Support</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{background: '#fafafa'}}>
                                    {messages.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm">No messages yet — be the first to reply!</div>
                                    ) : (
                                        messages.map((msg, i) => {
                                            const isAdmin = msg.sender === ADMIN_ID;
                                            return (
                                                <div key={i} className={`flex items-end gap-2 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
                                                     ref={i === messages.length - 1 ? scrollRef : null}>
                                                    {isAdmin ? (
                                                        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">D</div>
                                                    ) : (
                                                        <img src={getUserAvatar(getOtherUser(activeConv))} alt="user" className="w-7 h-7 rounded-full object-cover shrink-0" onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}/>
                                                    )}
                                                    <div className="max-w-[68%]">
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-gray-800 border border-gray-100'}`}
                                                             style={{background: isAdmin ? '#7c3aed' : 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
                                                            {msg.text}
                                                        </div>
                                                        <p className={`text-[10px] mt-1 text-gray-400 ${isAdmin ? 'text-right' : 'text-left'}`}>
                                                            {format(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <form onSubmit={sendMessage} className="flex items-center gap-3">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            placeholder="Reply to customer..."
                                            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                            style={{background: '#f5f5f5', border: '1.5px solid #f5f5f5'}}
                                            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = 'white'; }}
                                            onBlur={e => { e.target.style.borderColor = '#f5f5f5'; e.target.style.background = '#f5f5f5'; }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0"
                                            style={{background: newMessage.trim() ? '#7c3aed' : '#e5e7eb'}}
                                        >
                                            <AiOutlineSend size={18} color={newMessage.trim() ? 'white' : '#9ca3af'}/>
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSupportInbox;
