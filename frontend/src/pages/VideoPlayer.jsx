// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { Button } from "../components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Textarea } from "../components/ui/textarea";

// import {
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   Download,
//   CheckCircle,
//   Send,
//   Bell
// } from "lucide-react";

// import { cn } from "../lib/utils.js";

// import { getVideoById } from "../services/video.api";
// import { toggleSubscription } from "../services/subscriptions.api";
// import { createComment,getVideoComments } from "../services/comments.api.js";
// /* -------------------- HELPERS -------------------- */

// const formatDate = (date) =>
//   date ? new Date(date).toISOString().split("T")[0] : "";

// const formatDuration = (seconds = 0) => {
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${String(s).padStart(2, "0")}`;
// };

// /* -------------------- COMPONENT -------------------- */

// export default function VideoPlayer() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { userData } = useSelector((state) => state.auth);

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [video, setVideo] = useState({});
//   const [owner, setOwner] = useState({});

//   const [liked, setLiked] = useState(false);
//   const [disliked, setDisliked] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [comment, setComment] = useState("");
//   const [comments,setComments]=useState([])
//   const [isPosting, setIsPosting] = useState(false);

//   /* -------------------- FETCH VIDEO -------------------- */

//   useEffect(() => {
//     if (!id) return;

//     const fetchVideo = async () => {
//       try {
//         const res = await getVideoById(id,comment);
//         const videoData = res.data.data;
//         setVideo(videoData);
//         setOwner(videoData.owner?.[0] || null);
//         const response=await getVideoComments(id)
//         setComments(response.data)
//       } catch (error) {
//         console.error("Failed to fetch video:", error);
//       }
//     };

//     fetchVideo();
//   }, [id]);

// const handleComment = async () => {
//   if (!comment.trim()) return;

//   try {
//     const res = await createComment(id, {
//       content: comment,
//     });

//     // ✅ add new comment to UI (if you have comments list)
//     setComment((prev) => [res.data, ...prev]);

//     // ✅ clear textarea
//     setComment("");
//     setIsPosting(true)
//   } catch (error) {
//     console.log("creating comment error", error?.message);
//     setIsPosting(false)
//   }
// };


//   /* -------------------- LOADING GUARD -------------------- */

//   if (!video || !owner) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading video...
//       </div>
//     );
//   }

//   /* -------------------- UI -------------------- */

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="flex pt-16">
//         <Sidebar isOpen={sidebarOpen} activeTab="" onTabChange={() => { }} />

//         <main className="flex-1 lg:ml-64 px-4 lg:px-8 pb-8">
//           <div className="maxw-[1800px] mx-auto flex flex-col lg:flex-row gap-6">

//             {/* ================= VIDEO SECTION ================= */}
//             <div className="flex-1">
//               <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
//                 <video
//                   src={video.videoFile}
//                   controls
//                   poster={video.thumbnail}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* TITLE */}
//               <h1 className="text-xl lg:text-2xl font-bold mb-2">
//                 {video.title}
//               </h1>

//               {/* META */}
//               <p className="text-sm text-muted-foreground mb-4">
//                 {video.views} views • {formatDate(video.createdAt)}
//               </p>

//               {/* ================= CHANNEL INFO ================= */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-11 w-11 cursor-pointer">
//                     <AvatarImage src={owner.avatar} />
//                     <AvatarFallback>
//                       {owner.username?.[0]?.toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div>
//                     <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
//                       <span className="font-semibold text-base">
//                         {owner.fullName}
//                       </span>
//                       <CheckCircle className="h-4 w-4 text-primary fill-primary" />
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       @{owner.username}
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   variant={isSubscribed ? "secondary" : "default"}
//                   onClick={async () => {
//                     try {
//                       const res = await toggleSubscription(owner._id);
//                       setIsSubscribed(res.data.subscribed);
//                     } catch (error) {
//                       console.log("Error toggle subscription", error?.message);
//                     }
//                   }}
//                   className={cn(
//                     "group relative rounded-full px-6 transition-all duration-200 active:scale-95",
//                     isSubscribed && "hover:bg-destructive hover:text-destructive-foreground"
//                   )}
//                 >
//                   {/* NOT SUBSCRIBED */}
//                   {!isSubscribed && (
//                     <span className="font-medium">Subscribe</span>
//                   )}

//                   {/* SUBSCRIBED */}
//                   {isSubscribed && (
//                     <span className="flex items-center gap-2 font-medium">
//                       <Bell className="h-4 w-4 fill-current" />
//                       <span className="group-hover:hidden">Subscribed</span>
//                       <span className="hidden group-hover:inline">Unsubscribe</span>
//                     </span>
//                   )}
//                 </Button>
//               </div>

//               {/* ================= ACTION BAR ================= */}
//               <div className="flex flex-wrap items-center gap-2 mb-4">
//                 <Button
//                   variant="secondary"
//                   className={`rounded-full active:scale-95 ${liked && "text-primary"
//                     }`}
//                   onClick={() => {
//                     setLiked(!liked);
//                     setDisliked(false);
//                   }}
//                 >
//                   <ThumbsUp className="h-5 w-5 mr-2" />
//                   Like
//                 </Button>

//                 <Button
//                   variant="secondary"
//                   className={`rounded-full active:scale-95 ${disliked && "text-primary"
//                     }`}
//                   onClick={() => {
//                     setDisliked(!disliked);
//                     setLiked(false);
//                   }}
//                 >
//                   <ThumbsDown className="h-5 w-5" />
//                 </Button>

//                 <Button className="rounded-full active:scale-95">
//                   <Share2 className="h-5 w-5 mr-2" /> Share
//                 </Button>

//                 <Button className="rounded-full active:scale-95">
//                   <Download className="h-5 w-5 mr-2" /> Download
//                 </Button>
//               </div>

//               {/* ================= DESCRIPTION ================= */}
//               <div className="bg-muted rounded-xl p-4 mb-6">
//                 <p className="text-sm whitespace-pre-line">
//                   {video.description}
//                 </p>
//               </div>

//               {/* ================= COMMENTS ================= */}
//               <h2 className="font-semibold text-lg mb-4">Comments</h2>

//               <div className="flex gap-3 mb-6">
//                 <Avatar>
//                   <AvatarFallback>
//                     {userData?.username?.[0]?.toUpperCase() || "U"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1">
//                   <Textarea
//                     placeholder="Add a comment..."
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                   />

//                   {comment && (
//                     <div className="flex justify-end gap-2 mt-2">
//                       <Button variant="ghost" onClick={() => setComment("")}>
//                         Cancel
//                       </Button>
//                       <Button onClick={handleComment} disabled={isPosting}>
//                         <Send className="h-4 w-4 mr-2" />
//                         {isPosting ? "Posting..." : "Comment"}
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Comments list will come here later */}
//             </div>

//             {/* ================= RELATED VIDEOS ================= */}
//             <aside className="lg:w-[380px]">
//               <p className="text-muted-foreground">
//                 Related videos coming soon
//               </p>
//             </aside>

//           </div>
//         </main>
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  CheckCircle,
  Bell,
  Send,
} from "lucide-react";

import { cn } from "../lib/utils";

import { getVideoById ,} from "../services/video.api";
import { toggleSubscription } from "../services/subscriptions.api";
import {
  createComment,
  getVideoComments,
} from "../services/comments.api";
import { likeVideos } from "../services/likes.api";
/* -------------------- HELPERS -------------------- */

const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

/* -------------------- COMPONENT -------------------- */

export default function VideoPlayer() {
  const { id } = useParams();
  const { userData } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /* -------------------- COMMENTS STATE -------------------- */
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  /* -------------------- FETCH VIDEO + COMMENTS -------------------- */

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const videoRes = await getVideoById(id);
        const videoData = videoRes.data.data;

        setVideo(videoData);
        setOwner(videoData.owner?.[0] || null);
        setIsSubscribed(videoData.isSubscribed || false);

        const commentsRes = await getVideoComments(id);
        setComments(Array.isArray(commentsRes.data?.comments)? commentsRes.data.comments: []);
        console.log(commentsRes)

      } catch (error) {
        console.error("Failed to fetch video data", error);
      }
    };

    fetchData();
  }, [id]);

  /* -------------------- ADD COMMENT -------------------- */

  const handleComment = async () => {
    if (!comment.trim() || isPosting) return;

    try {
      setIsPosting(true);

      const res = await createComment(id, { content: comment });

      // add new comment on top (YouTube behavior)
      setComments((prev) => [res.data, ...prev]);
      setComment("");
    } catch (error) {
      console.log("Error creating comment", error?.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike=async()=>{
    try {
      const res = await likeVideos(id);
    } catch (error) {
      console.log("Error creating like", error?.message);
    } 
  }

  /* -------------------- LOADING -------------------- */

  if (!video || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading video...
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} activeTab="" onTabChange={() => {}} />

        <main className="flex-1 lg:ml-64 px-4 lg:px-8 pb-8">
          <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-6">

            {/* ================= VIDEO SECTION ================= */}
            <div className="flex-1">
              {/* Video */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                <video
                  src={video.videoFile}
                  controls
                  poster={video.thumbnail}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h1 className="text-xl lg:text-2xl font-bold mb-2">
                {video.title}
              </h1>

              {/* Meta */}
              <p className="text-sm text-muted-foreground mb-4">
                {video.views} views • {formatDate(video.createdAt)}
              </p>

              {/* ================= CHANNEL INFO ================= */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={owner.avatar} />
                    <AvatarFallback>
                      {owner.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {owner.fullName}
                      </span>
                      <CheckCircle className="h-4 w-4 text-primary fill-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      @{owner.username}
                    </p>
                  </div>
                </div>

                {/* Subscribe Button (YouTube-style) */}
                <Button
                  variant={isSubscribed ? "secondary" : "default"}
                  onClick={async () => {
                    try {
                      const res = await toggleSubscription(owner._id);
                      setIsSubscribed(res.data.subscribed);
                    } catch (error) {
                      console.log("Toggle subscription error", error?.message);
                    }
                  }}
                  className={cn(
                    "group rounded-full px-6 transition-all active:scale-95",
                    isSubscribed &&
                      "hover:bg-destructive hover:text-destructive-foreground"
                  )}
                >
                  {!isSubscribed ? (
                    "Subscribe"
                  ) : (
                    <span className="flex items-center gap-2">
                      <Bell className="h-4 w-4 fill-current" />
                      <span className="group-hover:hidden">Subscribed</span>
                      <span className="hidden group-hover:inline">
                        Unsubscribe
                      </span>
                    </span>
                  )}
                </Button>
              </div>

              {/* ================= ACTION BAR ================= */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button
                  variant="secondary"
                  className={cn("rounded-full", liked && "text-primary")}
                  onClick={handleLike
                    // () => {
                    //  setLiked(!liked);
                    //  setDisliked(false);
                    // }
                  }
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Like
                </Button>

                <Button
                  variant="secondary"
                  className={cn("rounded-full", disliked && "text-primary")}
                  onClick={() => {
                    setDisliked(!disliked);
                    setLiked(false);
                  }}
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>

                <Button className="rounded-full">
                  <Share2 className="h-5 w-5 mr-2" /> Share
                </Button>

                <Button className="rounded-full">
                  <Download className="h-5 w-5 mr-2" /> Download
                </Button>
              </div>

              {/* ================= DESCRIPTION ================= */}
              <div className="bg-muted rounded-xl p-4 mb-6">
                <p className="text-sm whitespace-pre-line">
                  {video.description}
                </p>
              </div>

              {/* ================= COMMENTS ================= */}
              <h2 className="font-semibold text-lg mb-4">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              <div className="flex gap-3 mb-6">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback>
                    {userData?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isPosting}
                  />

                  {comment && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        onClick={() => setComment("")}
                        disabled={isPosting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleComment}
                        disabled={isPosting}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isPosting ? "Posting..." : "Comment"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c._id} className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={c.owner?.avatar} />
                        <AvatarFallback>
                          {c.owner?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {c.owner?.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm mt-1 whitespace-pre-line">
                          {c.content}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs">
                          <button className="flex items-center gap-1 hover:text-primary">
                            <ThumbsUp className="h-4 w-4" />
                            {c.likesCount || 0}
                          </button>
                          <button className="hover:text-primary">
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                          <button className="hover:text-primary">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first to comment.
                  </p>
                )}
              </div>
            </div>

            {/* ================= RELATED VIDEOS ================= */}
            <aside className="lg:w-[380px]">
              <p className="text-muted-foreground">
                Related videos coming soon
              </p>
            </aside>
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
