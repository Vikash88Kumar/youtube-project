import {
  Home,
  Users,
  Clock,
  ThumbsUp,
  PlaySquare,
  MessageCircle,
  Settings,
  Flame,
  Twitter,
} from "lucide-react";
import { cn } from "../lib/utils.js";
import { useNavigate, useLocation } from "react-router-dom";

/* -------------------- DATA -------------------- */

const menuItems = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "posts", icon: Twitter, label: "Posts", path: "/posts" },
  { id: "trending", icon: Flame, label: "Trending", path: "/trending" },
  { id: "subscriptions", icon: Users, label: "Subscriptions", path: "/subscriptions" },
  { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages", badge: 5 },
];

const libraryItems = [
  { id: "history", icon: Clock, label: "History", path: "/history" },
  { id: "liked", icon: ThumbsUp, label: "Liked Videos", path: "/liked" },
  { id: "playlists", icon: PlaySquare, label: "Playlists", path: "/playlists" },
];

/* -------------------- COMPONENT -------------------- */

const Sidebar = ({ isOpen, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (id, path) => {
    onTabChange(id);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const baseBtn =
    "group w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left";

  const transition =
    "transition-[transform,box-shadow,background-color,color] duration-300 ease-out";

const hoverEffect =
  "hover:bg-green-500/20 hover:text-green-400 hover:translate-x-1 hover:scale-[1.02] hover:shadow-md active:scale-[0.97]";


  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 w-64 glass border-r border-border/50",
        "transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4 overflow-y-auto">
        {/* Main navigation */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.path)}
              className={cn(
                baseBtn,
                transition,
                hoverEffect,
                isActive(item.path)
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-green-600" />
              <span className="font-medium">{item.label}</span>

              {item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full gradient-primary text-xs font-bold flex items-center justify-center text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 my-4" />

        {/* Library */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Library
          </p>

          {libraryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.path)}
              className={cn(
                baseBtn,
                transition,
                hoverEffect,
                isActive(item.path)
                  ? "bg-green-500/20 text-green-600 shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Settings */}
        <button
          onClick={() => handleItemClick("settings", "/settings")}
          className={cn(
            baseBtn,
            transition,
            hoverEffect,
            isActive("/settings")
              ? "bg-primary/15 text-primary shadow-sm"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
