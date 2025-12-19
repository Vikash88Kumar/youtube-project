import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Posts from "./pages/Posts";
import Trending from "./pages/Trending";
import Subscriptions from "./pages/Subscriptions";
import History from "./pages/watchHistory";
import Liked from "./pages/Liked";
import Playlists from "./pages/Playlists";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channel from "./pages/Channel";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";
import Watch from "./pages/Watch";
import Shorts from "./pages/Shorts";
import VideoPlayer from "./pages/VideoPlayer";
import Notifications from "./pages/Notifications";
import SearchResults from "./pages/SearchResults";
import PlaylistPage from "./pages/PlaylistPage";




import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./services/user.api";
import { login,logout } from "./contextapi/authSlice";
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => { 
    const restoreAuth = async () => {
      try {
        const res = await getCurrentUser(); // reads cookie
        dispatch(login(res.data.data));     // restore redux
      } catch (error) {
        dispatch(logout()); // not logged in
      }
    };

    restoreAuth();
  }, [dispatch]);

  return( <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/history" element={<History />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/shorts/:id" element={<Shorts />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/search" element={<SearchResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)
}
export default App;