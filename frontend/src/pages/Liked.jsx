import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { ThumbsUp } from "lucide-react";
import { getLikedVideos } from "../services/likes.api";

const Liked = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("liked");
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(()=>{
    const fetchLikedVideos=async()=>{
      const rse=await getLikedVideos()
      setLikedVideos(rse.data)
    }
    fetchLikedVideos()
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
              <ThumbsUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Liked Videos</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedVideos.map((v) => (
                <VideoCard key={v._id} {...v.video} />
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

export default Liked;