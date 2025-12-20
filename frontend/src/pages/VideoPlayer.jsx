import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";

import {
  ThumbsUp,
  Share2,
  Download,
  CheckCircle,
  Bell,
  Send,
} from "lucide-react";

import { cn } from "../lib/utils";

import { getVideoById } from "../services/video.api";
import { toggleSubscription } from "../services/subscriptions.api";
import {
  createComment,
  getVideoComments,
} from "../services/comments.api";
import {
  likeVideos,
  getLikedperVideo,
} from "../services/likes.api";

import CommentItem from "../components/CommentItem";

/* ================= HELPERS ================= */
const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

/* ================= COMPONENT ================= */
export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= VIDEO ================= */
  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);

  /* ================= VIDEO LIKE ================= */
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  /* ================= COMMENTS ================= */
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);


  const handleToggleSubscription = async (id) => {
  if (subLoading) return;

  const prevSubscribed = isSubscribed;
  const prevCount = subscribersCount;

  // 🔥 optimistic update
  setIsSubscribed(!prevSubscribed);
  setSubscribersCount(
    prevSubscribed ? prevCount - 1 : prevCount + 1
  );
  setSubLoading(true);

  try {
    const res = await toggleSubscription(id);

    // ✅ backend is source of truth
    setIsSubscribed(res.data.data.subscribed);
    setSubscribersCount(res.data.data.subscribersCount);
  } catch (error) {
    console.error("Subscription toggle failed", error?.message);

    // ❌ rollback
    setIsSubscribed(prevSubscribed);
    setSubscribersCount(prevCount);
  } finally {
    setSubLoading(false);
  }
};






  /* ================= FETCH VIDEO ================= */
  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await getVideoById(id);
        const videoData = res.data.data;

        setVideo(videoData);
        setOwner(videoData.owner?.[0] || null);
        setIsSubscribed(videoData.isSubscribed || false);
      } catch (err) {
        console.error("Failed to fetch video", err);
      }
    };

    fetchVideo();
  }, [id]);

  /* ================= FETCH VIDEO LIKE ================= */
  useEffect(() => {
    if (!id || !userData?._id) return;

    const fetchLike = async () => {
      try {
        const res = await getLikedperVideo(id);
        setLiked(res.data.data.liked);
        setLikeCount(res.data.data.likeCount);
      } catch (err) {
        console.log("Failed to fetch video like", err?.message);
      }
    };

    fetchLike();
  }, [id, userData?._id]);

  /* ================= TOGGLE VIDEO LIKE ================= */
  const handleVideoLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);

    // optimistic UI
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await likeVideos(id);
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (err) {
      // rollback
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const res = await getVideoComments(id);
        setComments(
          Array.isArray(res.data.comments) ? res.data.comments : []
        );
      } catch (err) {
        console.log("Failed to fetch comments", err?.message);
      }
    };

    fetchComments();
  }, [id]);

  /* ================= ADD COMMENT ================= */
  const handleAddComment = async () => {
    if (!commentText.trim() || isPosting) return;

    try {
      setIsPosting(true);

      const res = await createComment(id, {
        content: commentText,
      });

      // backend already returns populated owner + like defaults
      setComments((prev) => [res.data.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.log("Failed to create comment", err?.message);
    } finally {
      setIsPosting(false);
    }
  };

  /* ================= LOADING ================= */
  if (!video || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading video...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen max-w-7xl bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} activeTab="" onTabChange={() => {}} />

        <main className="flex-1 lg:ml-64 px-4 lg:px-8 pb-8 pt-8">
          <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-6">

            {/* ================= VIDEO SECTION ================= */}
            <div className="flex-1">
              <div className=" aspect-video bg-black rounded-xl overflow-hidden mb-4 flex justify-center">
            <video
              src={video.videoFile}
              controls
              poster={video.thumbnail}
              className="h-full  object-contain"
            />
          </div>

              <h1 className="text-xl lg:text-2xl font-bold mb-2">
                {video.title}
              </h1>

              <p className="text-sm text-muted-foreground mb-4">
                {video.views} views • {formatDate(video.createdAt)}
              </p>

              {/* ================= CHANNEL ================= */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarImage
                      src={owner.avatar}
                      onClick={() => navigate(`/channel/${owner.username}`)}
                      className="cursor-pointer"
                    />
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

                <Button
                onClick={handleToggleSubscription(owner?._id)}
                disabled={subLoading}
                variant={isSubscribed ? "secondary" : "default"}
                className="gap-2 transition-all"
              >
                {isSubscribed && <Bell className="h-4 w-4" />}
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
              </div>

              {/* ================= ACTION BAR ================= */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="secondary"
                  disabled={likeLoading}
                  onClick={handleVideoLike}
                  className={cn("rounded-full", liked && "text-primary")}
                >
                  <ThumbsUp
                    className={cn("h-5 w-5 mr-2", liked && "fill-current")}
                  />
                  {likeCount}
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
                    {userData?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />

                  {commentText && (
                    <div className="flex justify-end mt-2">
                      <Button
                        onClick={handleAddComment}
                        disabled={isPosting}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isPosting ? "Posting..." : "Comment"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-6">
                {comments.map((c) => (
                  <CommentItem key={c._id} comment={c} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
