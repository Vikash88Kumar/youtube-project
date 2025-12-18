import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { Users } from "lucide-react";
import { useEffect } from "react";
import {useSelector} from "react-redux"
import { getSubscribedChannels } from "../services/subscriptions.api";


const subscriptionVideos = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
    title: "New Upload from Your Favorite Creator",
    channel: "TechVision",
    views: "125K",
    timestamp: "1 hour ago",
    duration: "14:22",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
    title: "Exclusive Music Session - Live Recording",
    channel: "MusicMaster",
    views: "89K",
    timestamp: "3 hours ago",
    duration: "28:15",
    channelAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f5f0e?w=400&h=225&fit=crop",
    title: "Epic Gameplay - New Season Launch",
    channel: "GameZone",
    views: "456K",
    timestamp: "5 hours ago",
    duration: "32:10",
    channelAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop",
  },
];

const Subscriptions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [subscribedChannels,setsubscribedChannels]=useState([])
  const currentUser=useSelector((state)=>state.auth.userData)
  useEffect(()=>{
    if(!currentUser?._id) return;
    const fetchChannel=async()=>{
      const res=await getSubscribedChannels(currentUser._id)
      setsubscribedChannels(res.data)
    }
    fetchChannel()
  })
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
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Subscriptions</h1>
            </div>

            {/* Subscribed channels row */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {subscribedChannels?.map((channel) => (
                <div key={channel._id} className="flex flex-col items-center gap-2 minw-[80px]">
                  <img 
                    src={channel.avatar} 
                    alt={channel.username}
                    className="w-16 h-16 rounded-full border-2 border-primary"
                  />
                  <span className="text-sm font-medium text-center">{channel.username}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-lg font-semibold mb-4">Latest Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subscriptionVideos.map((video) => (
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

export default Subscriptions;