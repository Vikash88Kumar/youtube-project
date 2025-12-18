import VideoCard from "./VideoCard";
import ShortsCarousel from "./ShortsCarousel";
import PostsFeed from "./PostsFeed";
import { Button } from "./ui/button.jsx";
import { useEffect } from "react";
import { getAllVideos } from "../services/video.api.js";
import { useState } from "react";

/* -------------------- DATA -------------------- */

const categories = [
  "All",
  "Gaming",
  "Music",
  "Live",
  "Tech",
  "Sports",
  "News",
  "Comedy",
  "Education",
  "Vlogs",
];

const videos = [
  {
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    title: "Building a Full-Stack App in 2024 - Complete Tutorial",
    channel: "Code Masters",
    channelAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: "1.2M",
    timestamp: "2 days ago",
    duration: "45:23",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
    title: "Epic Gaming Marathon - 24 Hours Challenge! 🎮",
    channel: "GameZone",
    channelAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    views: "856K",
    timestamp: "5 hours ago",
    duration: "3:42:15",
    isLive: true,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop",
    title: "Top 10 Music Hits of the Year - Official Countdown",
    channel: "Music Central",
    channelAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    views: "2.3M",
    timestamp: "1 week ago",
    duration: "18:45",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop",
    title: "React 19 New Features - Everything You Need to Know",
    channel: "Dev Insider",
    channelAvatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    views: "423K",
    timestamp: "3 days ago",
    duration: "22:10",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    title: "The Future of AI in Software Development",
    channel: "Tech Talks",
    channelAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    views: "1.8M",
    timestamp: "4 days ago",
    duration: "32:18",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop",
    title: "Debugging Like a Pro - Advanced Techniques",
    channel: "Code Academy",
    channelAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    views: "567K",
    timestamp: "1 day ago",
    duration: "28:55",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",
    title: "Retro Gaming Collection Tour - Hidden Gems!",
    channel: "Retro Gamer",
    channelAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: "234K",
    timestamp: "6 days ago",
    duration: "15:42",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    title: "Cybersecurity Essentials for Developers",
    channel: "Security Hub",
    channelAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    views: "892K",
    timestamp: "2 weeks ago",
    duration: "41:30",
  },
];

/* -------------------- COMPONENT -------------------- */

function VideoFeed() {
  const [videos,setVideos]=useState([])
  useEffect(()=>{
    const allVideos=async()=>{
      try {
        const res=await getAllVideos()
        setVideos(res.data.videos)
      } catch (error) {
        console.log("All videos error",error?.message)
      }
    }
    allVideos()
  },[])




  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? "default" : "secondary"}
            size="sm"
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Shorts */}
      <ShortsCarousel />

      {/* Posts */}
      <PostsFeed limit={2}/>

      {/* Video Grid */}
      <h2 className="text-xl font-bold mb-4">Recommended Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            <VideoCard {...video} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoFeed;
