import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import {useSelector } from "react-redux"
import { getWatchHistory, removeWatchHistory } from "../services/watchhistory.api";

// const historyVideos = [
//   {
//     id: "1",
//     thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
//     title: "Video You Watched Yesterday",
//     channel: "TechVision",
//     views: "1.2M",
//     timestamp: "Watched yesterday",
//     duration: "14:22",
//     channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
//   },
//   {
//     id: "2",
//     thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
//       title: "Tutorial You Started Last Week",
//       channel: "CodeMaster",
//     views: "890K",
//     timestamp: "Watched 3 days ago",
//     duration: "45:30",
//     channelAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop",
//   },
//   {
//     id: "3",
//     thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
//     title: "Concert Highlights You Enjoyed",
//     channel: "MusicWorld",
//     views: "2.1M",
//     timestamp: "Watched last week",
//     duration: "28:15",
//     channelAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop",
//   },
// ];

const History = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [historyVideos,setHistoryVideos]=useState([])
  const currentUser=useSelector((state)=>state.auth.userData)
  useEffect(()=>{
    if(!currentUser?._id) return
    const fetchHistory=async()=>{
      const res =await getWatchHistory()
      setHistoryVideos(res.data)
    } 
    fetchHistory()
  })
  const handleHistory=async()=>{
    try {
      await removeWatchHistory()
      setHistoryVideos([])
    } catch (error) {
      console.log("frontend history deleted",error?.message)
    }
  }

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Watch History</h1>
              </div>
              <Button onClick={handleHistory} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {historyVideos.length>0 ? historyVideos.map((video) => (
                <VideoCard key={video._id} {...video} />
              )):"No videos you watched"}
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

export default History;