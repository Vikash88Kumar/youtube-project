import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { getNotifications, markAllNotificationsRead } from "../services/notification.api";
import { formatDistanceToNow } from "date-fns";

const getIcon = (type) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-destructive fill-destructive" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-primary" />;
    case "subscriber":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "welcome":
      return <Play className="h-4 w-4 text-primary fill-primary" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications()
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    }
  });

  const notificationsList = notificationsData?.data?.data?.notifications || [];
  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
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
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={markAllReadMutation.isPending || unreadCount === 0}>
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
                <TabsTrigger value="welcome">Welcome</TabsTrigger>
              </TabsList>

              {["all", "like", "comment", "subscriber", "welcome"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <div className="space-y-2">
                      {isLoading ? (
                        <p className="text-muted-foreground text-center py-4">Loading notifications...</p>
                      ) : filterByType(tab).length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No notifications found.</p>
                      ) : filterByType(tab).map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors hover:bg-secondary/50 ${
                            !notification.isRead
                              ? "bg-primary/5 border-l-4 border-primary"
                              : ""
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={notification.sender?.avatar} />
                            <AvatarFallback>
                              {notification.sender?.fullName?.[0] || getIcon(notification.type)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="text-sm">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>

                          {!notification.isRead && (
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