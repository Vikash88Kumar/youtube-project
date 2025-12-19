import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { getPlaylistById } from "../services/playlists.api.js";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoCard from "../components/VideoCard.jsx";
function PlaylistPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
  
    function handleMenuClick() {
      setSidebarOpen(!sidebarOpen);
    }
  
    function handleOverlayClick() {
      setSidebarOpen(false);
    }

  useEffect(() => {
    if (!playlistId) return;

    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylistById(playlistId);
        setPlaylist(res.data.data);
      } catch (err) {
        console.error("Failed to load playlist", err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = (videoId) => {
  setPlaylist((prev) => ({
    ...prev,
    videos: prev.videos.filter((v) => v._id !== videoId),
  }));
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading playlist...
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Playlist not found
      </div>
    );
  }

  return (
   
    <div className="min-h-screen bg-background overflow-x-hidden">
          <Navbar onMenuClick={handleMenuClick} />
    
          <div className="flex pt-16 overflow-x-hidden">
            <Sidebar
              isOpen={sidebarOpen}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
    
            {/* Main content */}
            <main className="min-w-0 flex-1 lg:ml-64 "> 
                         <div className="min-h-screen bg-background px-4 lg:px-8 py-6">
           <div className="max-w-6xl mx-auto">

             {/* ===== PLAYLIST HEADER ===== */}
                <div className="mb-6">
               <h1 className="text-2xl font-bold">{playlist.title}</h1>
               {playlist.description && (
            <p className="text-muted-foreground mt-1">
              {playlist.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {/* {playlist.videos.length} videos */}
          </p>
        </div>

        {/* ===== VIDEO LIST ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {playlist.videos.map((video, index) => (
          <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            <VideoCard {...video} playlistId={playlist._id} onRemoveFromPlaylist={handleRemoveVideo} />
          </div>
        ))}
      </div>

      </div>
    </div> 
            </main>
          </div>
    
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
              onClick={handleOverlayClick}
            />
          )}
        </div>
  );
}

export default PlaylistPage;
