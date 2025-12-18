// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   MoreHorizontal,
// } from "lucide-react";

// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";

// /* -------------------- UI MOTION PRESETS -------------------- */

// const iconBtn =
//   "cursor-pointer transition-all duration-200 ease-out hover:bg-secondary hover:scale-105 active:scale-95";

// const cardHover =
//   "cursor-pointer transition-all duration-200 hover:bg-secondary/50 hover:scale-[1.01]";

// const avatarHover =
//   "cursor-pointer transition-transform duration-200 hover:scale-105";

// /* -------------------- MOCK DATA -------------------- */

// const suggestedVideos = [
//   {
//     id: "1",
//     title: "React 19 Full Tutorial",
//     thumbnail:
//       "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400",
//     channel: "TechVision",
//     views: "1.2M",
//     time: "2 days ago",
//   },
//   {
//     id: "2",
//     title: "Build WhatsApp Clone",
//     thumbnail:
//       "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
//     channel: "CodeCraft",
//     views: "890K",
//     time: "1 week ago",
//   },
// ];

// const commentsData = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
//     text: "This video explained everything perfectly 🔥",
//     time: "2 hours ago",
//   },
//   {
//     id: "2",
//     name: "Rahul Verma",
//     avatar:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
//     text: "Loved the UI breakdown!",
//     time: "1 day ago",
//   },
// ];

// /* -------------------- COMPONENT -------------------- */

// export default function Watch() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [comment, setComment] = useState("");

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="flex pt-16">
//         <Sidebar isOpen={sidebarOpen} activeTab="" />

//         <main className="flex-1 lg:ml-64 p-4 lg:p-6">
//           <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
//             {/* ---------------- VIDEO SECTION ---------------- */}
//             <section className="lg:col-span-2 space-y-4">
//               {/* Video Player */}
//               <div className="aspect-video rounded-xl overflow-hidden bg-black">
//                 <video
//                   controls
//                   className="w-full h-full"
//                   src="https://www.w3schools.com/html/mov_bbb.mp4"
//                 />
//               </div>

//               {/* Title */}
//               <h1 className="text-xl font-bold">
//                 Build a Professional YouTube Clone with React
//               </h1>

//               {/* Stats + Actions */}
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <p className="text-sm text-muted-foreground">
//                   1,245,334 views • 2 days ago
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <Button variant="ghost" size="sm" className={iconBtn}>
//                     <ThumbsUp className="h-4 w-4 mr-1 transition-transform group-hover:scale-110" />
//                     12K
//                   </Button>
//                   <Button variant="ghost" size="sm" className={iconBtn}>
//                     <ThumbsDown className="h-4 w-4 mr-1" />
//                   </Button>
//                   <Button variant="ghost" size="sm" className={iconBtn}>
//                     <Share2 className="h-4 w-4 mr-1" /> Share
//                   </Button>
//                   <Button variant="ghost" size="icon" className={iconBtn}>
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Channel Info */}
//               <div className="flex items-center justify-between border-t border-border pt-4">
//                 <div
//                   className="flex items-center gap-3"
//                   onClick={() => navigate("/channel")}
//                 >
//                   <Avatar className={avatarHover}>
//                     <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
//                     <AvatarFallback>TV</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold cursor-pointer hover:underline">
//                       TechVision Studio
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       2.5M subscribers
//                     </p>
//                   </div>
//                 </div>

//                 <Button className="cursor-pointer bg-green-500 hover:bg-green-600 transition-all duration-200 active:scale-95">
//                   Subscribe
//                 </Button>
//               </div>

//               {/* Description */}
//               <div className="bg-secondary/40 rounded-xl p-4 text-sm">
//                 In this video, we build a full YouTube clone using React,
//                 Tailwind CSS, and modern UI practices.
//               </div>

//               {/* ---------------- COMMENTS ---------------- */}
//               <div className="space-y-4">
//                 <h2 className="font-semibold">
//                   {commentsData.length} Comments
//                 </h2>

//                 {/* Add comment */}
//                 <div className="flex items-start gap-3">
//                   <Avatar className={avatarHover}>
//                     <AvatarFallback>U</AvatarFallback>
//                   </Avatar>
//                   <Input
//                     placeholder="Add a comment..."
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     className="rounded-full focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 {/* Comment list */}
//                 {commentsData.map((c) => (
//                   <div key={c.id} className="flex gap-3">
//                     <Avatar className={avatarHover}>
//                       <AvatarImage src={c.avatar} />
//                       <AvatarFallback>{c.name[0]}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-semibold">
//                         {c.name}{" "}
//                         <span className="text-xs text-muted-foreground">
//                           {c.time}
//                         </span>
//                       </p>
//                       <p className="text-sm">{c.text}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* ---------------- SUGGESTED VIDEOS ---------------- */}
//             <aside className="space-y-4">
//               {suggestedVideos.map((v) => (
//                 <div
//                   key={v.id}
//                   className={`${cardHover} flex gap-3 p-2 rounded-lg`}
//                   onClick={() => navigate(`/watch/${v.id}`)}
//                 >
//                   <img
//                     src={v.thumbnail}
//                     alt={v.title}
//                     className="w-40 h-24 rounded-lg object-cover"
//                   />
//                   <div>
//                     <p className="font-semibold text-sm line-clamp-2">
//                       {v.title}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {v.channel}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {v.views} • {v.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </aside>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

/* -------------------- UI HELPERS -------------------- */

const iconBtn =
  "cursor-pointer transition-all duration-200 hover:bg-secondary hover:scale-105 active:scale-95";

const card =
  "glass rounded-xl p-4 transition-all duration-200";

const cardHover =
  "cursor-pointer hover:bg-secondary/40 hover:scale-[1.01]";

/* -------------------- MOCK DATA -------------------- */

const suggestedVideos = [
  {
    id: "1",
    title: "React 19 Full Tutorial (2025)",
    thumbnail:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400",
    channel: "TechVision",
    views: "1.2M",
    time: "2 days ago",
  },
  {
    id: "2",
    title: "Build WhatsApp Clone UI",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    channel: "CodeCraft",
    views: "890K",
    time: "1 week ago",
  },
  {
    id: "3",
    title: "Tailwind UI Tips You MUST Know",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    channel: "Frontend Labs",
    views: "650K",
    time: "3 weeks ago",
  },
];

const commentsData = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    text: "This UI feels premium 🔥 Learned a lot!",
    time: "2 hours ago",
  },
  {
    id: "2",
    name: "Rahul Verma",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    text: "Clean layout and smooth UX 👌",
    time: "1 day ago",
  },
];

/* -------------------- COMPONENT -------------------- */

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} activeTab="" />

        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">
            {/* ================= VIDEO AREA ================= */}
            <section className="lg:col-span-8 space-y-6">
              {/* Video */}
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg">
                <video
                  controls
                  className="w-full aspect-video"
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold leading-snug">
                Build a Professional YouTube Clone with React & Tailwind
              </h1>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  1,245,334 views • 2 days ago
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className={iconBtn}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> 12K
                  </Button>
                  <Button variant="ghost" size="sm" className={iconBtn}>
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className={iconBtn}>
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                  <Button variant="ghost" size="icon" className={iconBtn}>
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className={iconBtn}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Channel */}
              <div className={`${card} flex items-center justify-between`}>
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate("/channel")}
                >
                  <Avatar className="hover:scale-105 transition-transform">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
                    <AvatarFallback>TV</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold hover:underline">
                      TechVision Studio
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2.5M subscribers
                    </p>
                  </div>
                </div>

                <Button className="cursor-pointer bg-green-500 hover:bg-green-600 transition-all active:scale-95">
                  Subscribe
                </Button>
              </div>

              {/* Description */}
              <div className={card}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  In this video, we build a full YouTube-style platform using
                  React, Tailwind CSS, modern UI patterns, and production-grade
                  component structure.
                </p>
              </div>

              {/* Comments */}
              <div className={`${card} space-y-4`}>
                <h2 className="font-semibold">
                  {commentsData.length} Comments
                </h2>

                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="rounded-full"
                  />
                </div>

                {commentsData.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {c.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          {c.time}
                        </span>
                      </p>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= SIDEBAR ================= */}
            <aside className="lg:col-span-4 space-y-4 sticky top-20 h-fit">
              {suggestedVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/watch/${v.id}`)}
                  className={`${card} ${cardHover} flex gap-3`}
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-40 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm line-clamp-2">
                      {v.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {v.channel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {v.views} • {v.time}
                    </p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
