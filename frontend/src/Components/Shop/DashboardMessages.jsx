import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import {backend_url, server} from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSend, AiOutlineMessage } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { format } from "timeago.js";

// Note: Socket removed — seller-buyer messaging uses HTTP only

const DashboardMessages = () => {
    const { shop } = useSelector((state) => state.shop);
    const [conversations, setConversations] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [currentChat, setCurrentChat] = useState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeStatus, setActiveStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        socketId.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const response = await axios.get(
                    `${server}/conversation/get-all-conversation-seller/${shop?._id}`,
                    { withCredentials: true }
                );
                setConversations(response.data.conversations);
            } catch (error) {
                console.log(error);
            }
        };
        getConversation();
    }, [shop, messages]);

    useEffect(() => {
        if (shop?._id) {
            socketId.emit("addUser", shop._id);
            socketId.on("getUsers", (onlineUserIds) => {
                // Now we're just getting an array of user IDs who are online
                setOnlineUsers(onlineUserIds);
            });
        }

        return () => {
            socketId.off("getUsers");
        };
    }, [shop]);

    const onlineCheck = (chat) => {
        const chatMember = chat.members.find((member) => member !== shop?._id);
        return onlineUsers.includes(chatMember); // Now checking if ID exists in array
    };

    useEffect(() => {
        const getMessage = async () => {
            try {
                const response = await axios.get(
                    `${server}/message/get-all-messages/${currentChat?._id}`
                );
                setMessages(response.data.messages);
            } catch (error) {
                console.log(error);
            }
        };
        getMessage();
    }, [currentChat]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        const message = {
            sender: shop._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== shop._id
        );

        socketId.emit("sendMessage", {
            senderId: shop._id,
            receiverId,
            text: newMessage,
        });

        try {
            if (newMessage.trim() !== "") {
                const res = await axios.post(
                    `${server}/message/create-new-message`,
                    message
                );
                setMessages((prev) => [...prev, res.data.message]);
                updateLastMessage();
                window.location.reload()
                setNewMessage("");

                // Force update scroll after state update
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                    });
                }, 50);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateLastMessage = async () => {
        await axios.put(
            `${server}/conversation/update-last-message/${currentChat._id}`,
            { lastMessage: newMessage, lastMessageId: shop._id }
        );
        socketId.emit("updateLastMessage", {
            lastMessage: newMessage,
            lastMessageId: shop._id,
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages]);

    return (
        <div className="w-full h-[89vh] sm:h-[88vh] md:mt-3 md:mx-auto md:max-w-[97%] md:rounded-2xl md:shadow-lg overflow-hidden flex flex-col bg-white">
            {!open && (
                <div className="border-b border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold text-white p-6 md:px-8 border-b border-gray-100 bg-gradient-to-tr from-purple-500 to-blue-500">
                        Messages
                    </h1>
                    <div className="h-[calc(100vh-160px)] overflow-y-auto">
                        {conversations?.map((item, index) => (
                            <MessageList
                                data={item}
                                key={index}
                                index={index}
                                setOpen={setOpen}
                                setCurrentChat={setCurrentChat}
                                me={shop._id}
                                setUserData={setUserData}
                                userData={userData}
                                online={onlineCheck(item)}
                                setActiveStatus={setActiveStatus}
                            />
                        ))}
                        {!conversations?.length && (
                            <div className="text-center p-8 text-gray-500">
                                <AiOutlineMessage className="text-4xl mx-auto mb-3 text-gray-300" />
                                No conversations yet
                            </div>
                        )}
                    </div>
                </div>
            )}

            {open && (
                <SellerInbox
                    setOpen={setOpen}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    sendMessageHandler={sendMessageHandler}
                    messages={messages}
                    sellerId={shop._id}
                    userData={userData}
                    activeStatus={activeStatus}
                    scrollRef={scrollRef}
                />
            )}
        </div>
    );
};

const MessageList = ({
                         data,
                         index,
                         setOpen,
                         setCurrentChat,
                         me,
                         setUserData,
                         online,
                         setActiveStatus,
                     }) => {
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const [active, setActive] = useState(0);

    const handleClick = (id) => {
        navigate(`/dashboard-messages?${id}`);
        setOpen(true);
    };

    useEffect(() => {
        const userId = data.members.find((user) => user !== me);
        const getUser = async () => {
            try {
                const res = await axios.get(`${server}/user/user-info/${userId}`);
                setUser(res.data.user);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [me, data]);

    return (
        <div
            className={`flex items-center p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 
                ${active === index ? "bg-blue-50" : "bg-white"} group`}
            onClick={(e) =>
                setActive(index) ||
                handleClick(data._id) ||
                setCurrentChat(data) ||
                setUserData(user) ||
                setActiveStatus(online)
            }
        >
            <div className="relative flex-shrink-0">
                <img
                    src={`${backend_url}${user?.avatar}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                        ${online ? "bg-green-500" : "bg-gray-300"}`}
                />
            </div>
            <div className="ml-4 flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-800 truncate pr-2">
                        {user?.name}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0">
                        {format(data?.updatedAt)}
                    </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                    <span
                        className={`${data?.lastMessageId !== user?._id ? "text-blue-600" : "text-gray-500"}`}
                    >
                        {data?.lastMessage || "Start a conversation..."}
                    </span>
                </p>
            </div>
        </div>
    );
};

const SellerInbox = ({
                         setOpen,
                         newMessage,
                         setNewMessage,
                         sendMessageHandler,
                         messages,
                         sellerId,
                         userData,
                         activeStatus,
                         scrollRef,
                     }) => {
    return (
        <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 md:px-6 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={`${backend_url}${userData?.avatar}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-lg border-2 border-white/80 shadow-sm object-cover"
                        />
                        <div
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white 
                                ${activeStatus ? "bg-green-400" : "bg-gray-400"}`}
                        />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-semibold text-white">{userData?.name}</h2>
                        <p className="text-xs font-medium text-purple-100">
                            {activeStatus ? "Active now" : "Offline"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-white/90 hover:text-white transition-colors"
                >
                    <RxCross1 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages?.map((item, index) => (
                    <div
                        key={index}
                        ref={index === messages.length - 1 ? scrollRef : null}
                        className={`flex ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] flex gap-3 ${item.sender === sellerId ? "flex-row-reverse" : ""}`}>
                            {item.sender !== sellerId && (
                                <img
                                    src={`${backend_url}${userData?.avatar}`}
                                    className="w-8 h-8 rounded-lg mt-1 object-cover"
                                    alt="User avatar"
                                />
                            )}
                            <div className="space-y-2">
                                {item.text && (
                                    <div
                                        className={`relative p-3 rounded-2xl shadow-sm ${
                                            item.sender === sellerId
                                                ? "bg-blue-600 text-white"
                                                : "bg-white border border-gray-200"
                                        }`}
                                    >
                                        <p className="text-sm leading-5">{item.text}</p>
                                        <div
                                            className={`absolute top-3 w-2 h-2 rotate-45 ${
                                                item.sender === sellerId
                                                    ? "-right-1 bg-blue-600"
                                                    : "-left-1 bg-white border-l border-t border-gray-200"
                                            }`}
                                        />
                                    </div>
                                )}
                                <span className="block text-xs text-gray-500 px-2">
                                    {format(item.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={sendMessageHandler}
                className="border-t border-gray-100 p-4 md:px-6 bg-white"
            >
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write your message..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-sm transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-sm transition-colors"
                        >
                            <AiOutlineSend className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DashboardMessages;
