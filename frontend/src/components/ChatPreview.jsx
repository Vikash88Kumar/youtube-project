import { Search, Edit, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { cn } from "../lib/utils.js";

/* -------------------- DATA -------------------- */

const chats = [
  {
    id: "1",
    name: "Tech Creators Hub",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    lastMessage: "Check out this new tutorial!",
    time: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    name: "Gaming Squad",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "GG! That was amazing 🎮",
    time: "15m",
    online: true,
    isTyping: true,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Thanks for sharing the video!",
    time: "1h",
    delivered: true,
    read: true,
  },
  {
    id: "4",
    name: "Music Lovers",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "New playlist just dropped 🎵",
    time: "3h",
    unread: 1,
  },
  {
    id: "5",
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "See you at the stream!",
    time: "1d",
    delivered: true,
  },
];

/* -------------------- COMPONENT -------------------- */

function ChatPreview() {
  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 glass border-l border-border/50 hidden xl:flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Messages</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9 h-9 bg-secondary border-transparent focus:border-primary/50 rounded-full text-sm"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-secondary/50",
              index === 0 && "bg-primary/5"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-secondary">
                  {chat.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {chat.time}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-0.5">
                {chat.delivered && !chat.read && (
                  <Check className="h-3 w-3 text-muted-foreground" />
                )}
                {chat.read && (
                  <CheckCheck className="h-3 w-3 text-primary" />
                )}

                <p
                  className={cn(
                    "text-sm truncate",
                    chat.unread
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {chat.isTyping ? (
                    <span className="text-primary italic">typing...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
              </div>
            </div>

            {chat.unread && (
              <span className="w-5 h-5 rounded-full gradient-primary text-xs font-bold flex items-center justify-center text-primary-foreground">
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatPreview;
