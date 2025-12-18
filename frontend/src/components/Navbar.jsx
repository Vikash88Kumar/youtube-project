import { Search, Bell, Upload, Menu } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const iconButtonClass =
    "relative cursor-pointer transition-all duration-200 ease-out hover:bg-secondary hover:scale-105 active:scale-95";
  const currentUser=useSelector((state)=>state.auth.userData)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">
              Vid<span className="text-gradient">Chat</span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos, channels, or chats..."
              className="w-full pl-11 pr-4 h-11 bg-secondary border-border/50 focus:border-primary/50 rounded-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5 md:hidden" />
          </Button>

          {/* ✅ Upload navigation */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/upload")}
            className={iconButtonClass}
          >
            <Upload className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          </Button>


          <Button
            variant="ghost"
            size="icon"
            className={iconButtonClass}
            onClick={()=> navigate("/notifications")}
          >
            <Bell className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </Button>


          <Avatar onClick={() => navigate("/channel")} className="h-9 w-9 border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-secondary">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
