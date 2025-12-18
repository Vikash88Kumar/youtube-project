import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { Flame } from "lucide-react";

const trendingVideos = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
    title: "Most Viewed Video This Week - Breaking Records!",
    channel: "TrendMaster",
    views: "15M",
    timestamp: "2 hours ago",
    duration: "18:45",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
    title: "Viral Tech Review Everyone's Talking About",
    channel: "TechViral",
    views: "8.2M",
    timestamp: "5 hours ago",
    duration: "22:10",
    channelAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f5f0e?w=400&h=225&fit=crop",
    title: "Epic Gaming Moment That Broke the Internet",
    channel: "GameLegend",
    views: "5.1M",
    timestamp: "8 hours ago",
    duration: "15:30",
    channelAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
    title: "Documentary That Changed Everything",
    channel: "DocuWorld",
    views: "3.8M",
    timestamp: "12 hours ago",
    duration: "45:00",
    channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
  },
];

const Trending = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");

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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Trending</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
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
};

export default Trending;