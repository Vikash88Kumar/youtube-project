import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

/* -------------------- DATA -------------------- */

const shortsData = [
  {
    id: "1",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "React tips you MUST know 🔥",
    channel: "TechVision",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    likes: "12K",
    comments: "420",
  },
  {
    id: "2",
    video: "https://www.w3schools.com/html/movie.mp4",
    title: "Tailwind UI magic ✨",
    channel: "Frontend Labs",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    likes: "8.5K",
    comments: "210",
  },
];

/* -------------------- COMPONENT -------------------- */

export default function Shorts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} activeTab="shorts" />

        {/* ================= MAIN ================= */}
        <main className="flex-1 lg:ml-64 flex justify-center">
          {/* CENTER COLUMN (BLACK SHORTS AREA) */}
          <div className="w-full max-w-[420px] bg-black h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory">
            {shortsData.map((short) => (
              <section
                key={short.id}
                className="relative h-full snap-start flex items-center justify-center"
              >
                {/* 9:16 CONTAINER */}
                <div className="relative h-full aspect-[9/16]">
                  <video
                    src={short.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* LEFT INFO */}
                  <div className="absolute bottom-6 left-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="cursor-pointer hover:scale-105 transition">
                        <AvatarImage src={short.avatar} />
                        <AvatarFallback>
                          {short.channel[0]}
                        </AvatarFallback>
                      </Avatar>

                      <p className="font-semibold cursor-pointer hover:underline">
                        {short.channel}
                      </p>

                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 cursor-pointer"
                      >
                        Follow
                      </Button>
                    </div>

                    <p className="text-sm leading-relaxed max-w-xs">
                      {short.title}
                    </p>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 text-white">
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition">
                      <Heart className="h-7 w-7" />
                      <span className="text-xs">{short.likes}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition">
                      <MessageCircle className="h-7 w-7" />
                      <span className="text-xs">{short.comments}</span>
                    </div>

                    <div className="cursor-pointer hover:scale-110 transition">
                      <Share2 className="h-7 w-7" />
                    </div>

                    <div className="cursor-pointer hover:scale-110 transition">
                      <MoreVertical className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
