import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Play,
  Settings,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const notifications = [
  {
    id: "1",
    type: "like",
    user: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    action: "liked your video",
    target: "Building a Modern Web App with React",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=68&fit=crop",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "comment",
    user: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    action: "commented on your video",
    target: "This is amazing content! Keep it up 🔥",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=120&h=68&fit=crop",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "subscriber",
    user: "Tech Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    action: "subscribed to your channel",
    target: null,
    thumbnail: null,
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "like",
    user: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    action: "liked your comment",
    target: "Great explanation of TypeScript generics!",
    thumbnail: null,
    time: "2 hours ago",
    read: true,
  },
];

const getIcon = (type) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-destructive fill-destructive" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-primary" />;
    case "subscriber":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "upload":
      return <Play className="h-4 w-4 text-primary fill-primary" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [notificationsList, setNotificationsList] = useState(notifications);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map((n) => ({ ...n, read: true }))
    );
  };

  const filterByType = (type) => {
    if (type === "all") return notificationsList;
    return notificationsList.filter((n) => n.type === type);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="like">Likes</TabsTrigger>
                <TabsTrigger value="comment">Comments</TabsTrigger>
                <TabsTrigger value="subscriber">Subscribers</TabsTrigger>
                <TabsTrigger value="upload">Uploads</TabsTrigger>
              </TabsList>

              {["all", "like", "comment", "subscriber", "upload"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <div className="space-y-2">
                      {filterByType(tab).map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors hover:bg-secondary/50 ${
                            !notification.read
                              ? "bg-primary/5 border-l-4 border-primary"
                              : ""
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {notification.user[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">
                                {notification.user}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {notification.action}
                              </span>
                            </p>
                            {notification.target && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {notification.target}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>

                          {notification.thumbnail && (
                            <img
                              src={notification.thumbnail}
                              alt=""
                              className="w-24 h-14 rounded-lg object-cover"
                            />
                          )}

                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}