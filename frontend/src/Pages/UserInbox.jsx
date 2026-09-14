import {useEffect, useRef, useState, useCallback} from "react";
import {useSelector} from "react-redux";
import {format} from "timeago.js";
import {backend_url, server} from "../server";
import axios from "axios";
import {AiOutlineSend} from "react-icons/ai";
import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";

const POLL_INTERVAL = 5000; // 5 seconds

const UserInbox = () => {
    const {user} = useSelector(state => state.user);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const pollRef = useRef(null);
    const convRef = useRef(null);

    // Keep ref in sync so polling callback always has latest conversation
    useEffect(() => { convRef.current = conversation; }, [conversation]);

    // Fetch messages for current conversation
    const fetchMessages = useCallback(async (convId) => {
        try {
            const res = await axios.get(`${server}/message/get-all-messages/${convId}`);
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Poll error:", err);
        }
    }, []);

    // Get or create support conversation, then start polling
    useEffect(() => {
        if (!user?._id) return;
        const init = async () => {
            try {
                setLoading(true);
                const {data} = await axios.get(`${server}/conversation/get-or-create-support-conversation`, {withCredentials: true});
                setConversation(data.conversation);
                convRef.current = data.conversation;
                await fetchMessages(data.conversation._id);
            } catch (err) {
                console.error("Support chat error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();

        // Start polling
        pollRef.current = setInterval(() => {
            if (convRef.current?._id) {
                fetchMessages(convRef.current._id);
            }
        }, POLL_INTERVAL);

        return () => clearInterval(pollRef.current);
    }, [user, fetchMessages]);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation || sending) return;
        setSending(true);
        try {
            const msgData = {sender: user._id, text: newMessage.trim(), conversationId: conversation._id};
            const res = await axios.post(`${server}/message/create-new-message`, msgData);
            setMessages(prev => [...prev, res.data.message]);

            // Update last message
            await axios.put(`${server}/conversation/update-last-message/${conversation._id}`, {
                lastMessage: newMessage.trim(),
                lastMessageId: user._id,
            });
            setNewMessage("");
            inputRef.current?.focus();
        } catch (err) {
            console.error("Send error:", err);
        } finally {
            setSending(false);
        }
    };

    const getAvatarSrc = () => {
        if (!user?.avatar) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        if (user.avatar.startsWith("http")) return user.avatar;
        return `${backend_url}${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header/>
            <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6">
                {/* Chat Card */}
                <div className="flex flex-col flex-1 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100" style={{minHeight: '70vh'}}>

                    {/* Chat Header */}
                    <div style={{background: '#0a0a0a'}} className="flex items-center gap-4 px-5 py-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                D
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-sm">DivineSoul Support</h2>
                            <p className="text-xs" style={{color: '#808080'}}>
                                We reply within a few hours
                            </p>
                        </div>
                        <div className="ml-auto">
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background: 'rgba(124,58,237,0.2)', color: '#a78bfa'}}>
                                Support Chat
                            </span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{minHeight: 400, background: '#fafafa'}}>
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                                    <p className="text-sm text-gray-400">Loading messages...</p>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-violet-500">
                                        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                </div>
                                <h3 className="text-gray-800 font-semibold text-base mb-1">Start a conversation</h3>
                                <p className="text-sm text-gray-400 max-w-xs">
                                    Have a question about your order or a product? We're here to help!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.sender === user?._id;
                                return (
                                    <div key={i} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                         ref={i === messages.length - 1 ? scrollRef : null}>
                                        {/* Avatar */}
                                        {!isMe && (
                                            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">D</div>
                                        )}
                                        {isMe && (
                                            <img src={getAvatarSrc()} alt="You" className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}/>
                                        )}

                                        {/* Bubble */}
                                        <div className="max-w-[72%]">
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                isMe
                                                    ? 'text-white rounded-br-sm'
                                                    : 'text-gray-800 rounded-bl-sm border border-gray-100'
                                            }`} style={{background: isMe ? '#7c3aed' : 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.07)'}}>
                                                {msg.text}
                                            </div>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-right' : 'text-left'} text-gray-400`}>
                                                {format(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input */}
                    <div style={{borderTop: '1px solid #f0f0f0'}} className="p-4 bg-white">
                        <form onSubmit={sendMessage} className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{background: '#f5f5f5', border: '1.5px solid #f5f5f5'}}
                                onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = 'white'; }}
                                onBlur={e => { e.target.style.borderColor = '#f5f5f5'; e.target.style.background = '#f5f5f5'; }}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending || loading}
                                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0"
                                style={{background: newMessage.trim() ? '#7c3aed' : '#e5e7eb', cursor: newMessage.trim() ? 'pointer' : 'default'}}
                            >
                                <AiOutlineSend size={18} color={newMessage.trim() ? 'white' : '#9ca3af'}/>
                            </button>
                        </form>
                        <p className="text-[11px] text-gray-400 mt-2 text-center">
                            Messages are reviewed by our support team. We usually reply within a few hours.
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default UserInbox;
