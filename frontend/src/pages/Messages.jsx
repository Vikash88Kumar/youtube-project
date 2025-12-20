import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

import {
  getallChatRooms,
  chatHistory,
  createMessage,
  createChatRooms
} from "../services/chat.api";

/* -------------------- COMPONENT -------------------- */

export default function Messages() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeChatIdRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.userData);

  const [chatRooms, setChatRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");


  const [showNewChat, setShowNewChat] = useState(false);
  const [username, setUsername] = useState("");
  const handleCreateChat = async () => {
  if (!username.trim()) return;

  try {
    // 🔥 call your backend
    const res = await createChatRooms({ username });

    // Refresh chat list
    const updatedChats = await getallChatRooms();
    setChatRooms(updatedChats.data);

    setShowNewChat(false);
    setUsername("");
  } catch (err) {
    console.error("Create chat failed", err);
  }
};



  /* ---------------- FETCH CHAT ROOMS ---------------- */

  useEffect(() => {
    (async () => {
      const res = await getallChatRooms();
      setChatRooms(res.data || []);
    })();
  }, []);

  /* ---------------- SOCKET SETUP ---------------- */

  useEffect(() => {
    if (!currentUser?._id) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem("accessToken") },
      transports: ["websocket"],
    });

    socketRef.current.on("receive-message", (msg) => {
      if (String(msg.chat) !== String(activeChatIdRef.current)) return;
      if (String(msg.sender) === String(currentUser._id)) return;

    setMessages((prev = []) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        _id: msg._id,
        text: msg.content,
        sent: false,
        read: true,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    });

    return () => socketRef.current.disconnect();
  }, [currentUser?._id]);

  /* ---------------- OPEN CHAT ---------------- */

  const openChat = async (chat) => {
    const res = await chatHistory(chat._id);
    const chatData = res.data[0];

    socketRef.current.emit("join-room", chat._id);
    activeChatIdRef.current = chat._id;

    setActiveChat({
      chatId: chat._id,
      chatWith: chat.chatWith,
    });

    setMessages(
      chatData?.messages.map((m) => ({
        _id: m._id,
        text: m.content,
        sent: String(m.sender._id) === String(currentUser._id),
        read: true,
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    );
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!text.trim() || !activeChat) return;

    const optimistic = {
      _id: Date.now(),
      text,
      sent: true,
      read: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");

    await createMessage(activeChat.chatId, { content: optimistic.text });
  };

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex bg-background">
      {/* CHAT LIST */}
      <aside
        className={cn(
          "relative w-full md:w-96 border-r border-border/50 bg-card/40 flex flex-col",
          activeChat && "hidden md:flex"
        )}
      >
        <div className="p-4 glass border-b">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-secondary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms
            .filter((c) =>
              c.chatWith?.username
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat._id}
                onClick={() => openChat(chat)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/70"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.chatWith?.avatar} />
                  <AvatarFallback>
                    {chat.chatWith?.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {chat.chatWith?.username}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {/* ---- Floating New Chat Button ---- */}
        <Button
          onClick={() => setShowNewChat(true)}
          className="
            absolute bottom-6 right-6
            h-12 px-5
            rounded-full
            bg-green-500 hover:bg-green-600
            text-white font-semibold
            shadow-xl hover:shadow-2xl
            transition-all duration-300
            hover:scale-105 active:scale-95
            flex items-center gap-2
          "
        >
          <span className="text-xl">+</span>
          <span>New Chat</span>
        </Button>


      </aside>
      {showNewChat && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowNewChat(false)}
    />

    {/* Modal */}
    <div className="relative w-full max-w-sm bg-background rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in">
      <h2 className="text-xl font-bold mb-2">Start New Chat</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Enter username to start chatting
      </p>

      <Input
        autoFocus
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreateChat();
          if (e.key === "Escape") setShowNewChat(false);
        }}
        className="mb-4"
      />

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setShowNewChat(false);
            setUsername("");
          }}
        >
          Cancel
        </Button>

        <Button
          className="bg-green-500 hover:bg-green-600"
          disabled={!username.trim()}
          onClick={handleCreateChat}
        >
          Create
        </Button>
      </div>
    </div>
  </div>
)}


      {/* CHAT WINDOW */}
      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* HEADER */}
            <div className="h-16 px-4 flex items-center justify-between border-b glass">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeChat.chatWith.avatar} />
                  <AvatarFallback>
                    {activeChat.chatWith.username[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">
                  {activeChat.chatWith.username}
                </p>
              </div>
            </div>
            

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages?.map((m) => (
                <div
                  key={m._id}
                  className={cn(
                    "flex",
                    m.sent ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-2 rounded-2xl",
                      m.sent
                        ? "bg-green-500 text-white rounded-br-sm"
                        : "bg-secondary rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{m.text}</p>
                    <div className="flex justify-end gap-1 text-[10px] opacity-70">
                      {m.time}
                      {m.sent &&
                        (m.read ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="h-16 px-4 flex items-center gap-2 border-t glass">
              <Input
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-full bg-secondary"
              />
              <Button
                onClick={sendMessage}
                className="rounded-full bg-green-500 hover:bg-green-600"
              >
                {text ? <Send /> : <Mic />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}

