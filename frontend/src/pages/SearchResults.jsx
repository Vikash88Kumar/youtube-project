import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import VideoCard from "../components/VideoCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const allVideos = [
  {
    id: "1",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    title: "Building a Modern Web Application with React and TypeScript",
    channel: "Tech Academy",
    channelAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    views: "1.2M",
    timestamp: "2 weeks ago",
    duration: "24:35",
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop",
    title: "TypeScript for Beginners - Complete Tutorial 2024",
    channel: "Code Academy",
    channelAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    views: "856K",
    timestamp: "1 month ago",
    duration: "1:30:00",
  },
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
    title: "CSS Grid & Flexbox Masterclass - Build Any Layout",
    channel: "Web Wizards",
    channelAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: "654K",
    timestamp: "2 weeks ago",
    duration: "58:20",
  },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [uploadDate, setUploadDate] = useState("any");
  const [duration, setDuration] = useState("any");

  const filteredVideos = allVideos.filter((video) => {
    const q = query.toLowerCase();
    return (
      video.title.toLowerCase().includes(q) ||
      video.channel.toLowerCase().includes(q)
    );
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "views") {
      const parseViews = (v) =>
        parseFloat(v.replace(/[KM]/g, "")) *
        (v.includes("M") ? 1000 : 1);
      return parseViews(b.views) - parseViews(a.views);
    }
    return 0;
  });

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
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-xl font-semibold">
                Results for{" "}
                <span className="text-primary">"{query}"</span>
              </h1>
              <span className="text-sm text-muted-foreground">
                {sortedVideos.length} videos
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-border">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Select value={uploadDate} onValueChange={setUploadDate}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Upload date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="short">Under 4 min</SelectItem>
                  <SelectItem value="long">Over 20 min</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="views">View count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            {sortedVideos.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-xl font-semibold mb-2">
                  No results found
                </h2>
                <p className="text-muted-foreground">
                  Try different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVideos.map((video) => (
                  <VideoCard key={video.id} {...video} />
                ))}
              </div>
            )}
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
