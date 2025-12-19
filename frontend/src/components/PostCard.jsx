// import { useEffect, useState } from "react";
// import { nanoid } from "nanoid";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
// import { Button } from "./ui/button.jsx";
// import { cn } from "../lib/utils.js";
// import {
//   Heart,
//   MessageCircle,
//   Share,
//   MoreHorizontal,
// } from "lucide-react";
// import { likeTweets, getlikedTweets } from "../services/likes.api.js";
// import {
//   getTweetComments,
//   createTweetComment,
// } from "../services/comments.api.js";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import CommentItem from "./CommentItem.jsx";

// function PostCard({ post }) {
//   const navigate = useNavigate();
//   const currentUser = useSelector((state) => state.auth.userData);

//   /* ================= POST LIKE ================= */
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(0);

//   /* ================= COMMENTS ================= */
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [isPosting, setIsPosting] = useState(false);
//   const [commentsLoaded, setCommentsLoaded] = useState(false);

//   const postId = post?._id;
//   const userId = currentUser?._id;

//   /* ================= FETCH POST LIKE ================= */
//   useEffect(() => {
//     if (!postId || !userId) return;

//     const fetchLikes = async () => {
//       try {
//         const res = await getlikedTweets(postId);
//         setLiked(res.data.data.liked);
//         setLikes(res.data.data.likeCount);
//       } catch (err) {
//         console.log("Failed to fetch likes", err?.message);
//       }
//     };

//     fetchLikes();
//   }, [postId, userId]);

//   /* ================= TOGGLE POST LIKE ================= */
//   const handleLike = async () => {
//     try {
//       const res = await likeTweets(postId);
//       setLiked(res.data.data.liked);
//       setLikes(res.data.data.likeCount);
//     } catch (err) {
//       console.log("Failed to toggle like", err?.message);
//     }
//   };

//   /* ================= FETCH COMMENTS ================= */
//   const fetchComments = async () => {
//     if (commentsLoaded) return;

//     try {
//       const res = await getTweetComments(postId);
//       setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
//       setCommentsLoaded(true);
//     } catch (err) {
//       console.log("Failed to fetch comments", err?.message);
//     }
//   };

//   /* ================= ADD COMMENT (OPTIMISTIC) ================= */
// const handleAddComment = async () => {
//   if (!commentText.trim() || isPosting) return;

//   const tempId = nanoid();

//   // optimistic comment
//   const tempComment = {
//     _id: tempId,
//     content: commentText,
//     createdAt: new Date().toISOString(),
//     owner: currentUser,
//     liked: false,
//     likeCount: 0,
//     isTemp: true,
//   };

//   // 1️⃣ show comment immediately
//   setComments((prev) => [tempComment, ...prev]);
//   setCommentText("");

//   try {
//     setIsPosting(true);

//     // 2️⃣ backend call
//     const res = await createTweetComment(postId, {
//       content: tempComment.content,
//     });

//     // ✅ backend response confirmed correct
//     const realComment = res.data.data;

//     // 3️⃣ replace temp with real
//     setComments((prev) =>
//       prev.map((c) => (c._id === tempId ? realComment : c))
//     );
//   } catch (err) {
//     console.log("Failed to create comment", err?.message);

//     // rollback optimistic UI
//     setComments((prev) => prev.filter((c) => c._id !== tempId));
//   } finally {
//     setIsPosting(false);
//   }
// };


//   return (
//     <div className="p-4 border-b hover:bg-secondary/30 transition-colors">
//       <div className="flex gap-3">
//         {/* Avatar */}
//         <Avatar className="h-10 w-10">
//           <AvatarImage
//             src={post.owner?.avatar}
//             className="cursor-pointer"
//             onClick={() => navigate(`/channel/${post.owner.username}`)}
//           />
//           <AvatarFallback>
//             {post.owner?.fullName?.slice(0, 2)}
//           </AvatarFallback>
//         </Avatar>

//         <div className="flex-1 min-w-0">
//           {/* Header */}
//           <div className="flex justify-between">
//             <div>
//               <span className="font-bold cursor-pointer">
//                 {post.owner?.fullName}
//               </span>
//               <span className="text-muted-foreground text-sm ml-2">
//                 @{post.owner?.username} · {post.createdAt?.slice(0, 10)}
//               </span>
//             </div>

//             <Button variant="ghost" size="icon">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Content */}
//           <p className="mt-1">{post.content}</p>

//           {post.image && (
//             <div className="mt-3 rounded-xl overflow-hidden border">
//               <img src={post.image} alt="post" />
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-6 mt-3">
//             {/* Comments */}
//             <button
//               onClick={() =>
//                 setShowComments((prev) => {
//                   if (!prev) fetchComments();
//                   return !prev;
//                 })
//               }
//               className="flex items-center gap-2 text-muted-foreground hover:text-primary"
//             >
//               <MessageCircle className="h-4 w-4" />
//               Comments
//             </button>

//             {/* Like */}
//             <button
//               onClick={handleLike}
//               className={cn(
//                 "flex items-center gap-2",
//                 liked ? "text-pink-500" : "text-muted-foreground"
//               )}
//             >
//               <Heart className={cn("h-4 w-4", liked && "fill-current")} />
//               {likes}
//             </button>

//             {/* Share */}
//             <button className="text-muted-foreground hover:text-primary">
//               <Share className="h-4 w-4" />
//             </button>
//           </div>

//           {/* ================= COMMENTS SECTION ================= */}
//           {showComments && (
//             <div className="mt-4 border-t pt-4 space-y-4">
//               {/* Add comment */}
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={currentUser?.avatar} />
//                   <AvatarFallback>
//                     {currentUser?.username?.[0]?.toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1">
//                   <input
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     placeholder="Write a comment..."
//                     className="w-full px-3 py-2 text-sm border rounded-full outline-none focus:ring-2 focus:ring-primary"
//                   />

//                   <div className="flex justify-end mt-2">
//                     <Button
//                       size="sm"
//                       disabled={!commentText.trim() || isPosting}
//                       onClick={handleAddComment}
//                     >
//                       {isPosting ? "Posting..." : "Comment"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Comment list */}
//               {comments
//                 .filter((c) => c && c._id)
//                 .map((comment) => (
//                   <CommentItem key={comment._id} comment={comment} />
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PostCard;
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils.js";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { likeTweets, getlikedTweets } from "../services/likes.api.js";
import {
  getTweetComments,
  createTweetComment,
} from "../services/comments.api.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommentItem from "./CommentItem.jsx";

function PostCard({ post }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  /* ================= POST LIKE ================= */
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  /* ================= COMMENTS ================= */
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const postId = post?._id;
  const userId = currentUser?._id;

  /* ================= FETCH POST LIKE ================= */
  useEffect(() => {
    if (!postId || !userId) return;

    const fetchLikes = async () => {
      try {
        const res = await getlikedTweets(postId);
        setLiked(res.data.data.liked);
        setLikes(res.data.data.likeCount);
      } catch (err) {
        console.log("Failed to fetch likes", err?.message);
      }
    };

    fetchLikes();
  }, [postId, userId]);

  /* ================= TOGGLE POST LIKE ================= */
  const handleLike = async () => {
    try {
      const res = await likeTweets(postId);
      setLiked(res.data.data.liked);
      setLikes(res.data.data.likeCount);
    } catch (err) {
      console.log("Failed to toggle like", err?.message);
    }
  };

  /* ================= FETCH COMMENTS ================= */
  const fetchComments = async () => {
    if (commentsLoaded) return;

    try {
      const res = await getTweetComments(postId);
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
      setCommentsLoaded(true);
    } catch (err) {
      console.log("Failed to fetch comments", err?.message);
    }
  };

  /* ================= ADD COMMENT (OPTIMISTIC) ================= */
const handleAddComment = async () => {
  if (!commentText.trim() || isPosting) return;

  const tempId = nanoid();

  const tempComment = {
    _id: tempId,
    content: commentText,
    createdAt: new Date().toISOString(),
    owner: currentUser,
    isTemp: true,
  };

  setComments((prev) => [tempComment, ...prev]);
  setCommentText("");

  try {
    setIsPosting(true);

    const res = await createTweetComment(postId, {
      content: tempComment.content,
    });

    // ✅ ONLY runs on success
    const realComment = res?.data?.data;
    if (!realComment) {
      throw new Error("Backend returned no comment");
    }

    setComments((prev) =>
      prev.map((c) => (c._id === tempId ? realComment : c))
    );
  } catch (err) {
    // ❌ Axios error → err.response exists, NOT res
    console.error(
      "Create comment failed:",
      err?.response?.data || err.message
    );

    // rollback optimistic UI
    setComments((prev) => prev.filter((c) => c._id !== tempId));
  } finally {
    setIsPosting(false);
  }
};



  return (
    <div className="p-4 border-b hover:bg-secondary/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={post.owner?.avatar}
            className="cursor-pointer"
            onClick={() => navigate(`/channel/${post.owner.username}`)}
          />
          <AvatarFallback>
            {post.owner?.fullName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <span className="font-bold cursor-pointer">
                {post.owner?.fullName}
              </span>
              <span className="text-muted-foreground text-sm ml-2">
                @{post.owner?.username} · {post.createdAt?.slice(0, 10)}
              </span>
            </div>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="mt-1">{post.content}</p>

          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden border">
              <img src={post.image} alt="post" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 mt-3">
            {/* Comments */}
            <button
              onClick={() =>
                setShowComments((prev) => {
                  if (!prev) fetchComments();
                  return !prev;
                })
              }
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Comments
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2",
                liked ? "text-pink-500" : "text-muted-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              {likes}
            </button>

            {/* Share */}
            <button className="text-muted-foreground hover:text-primary">
              <Share className="h-4 w-4" />
            </button>
          </div>

          {/* ================= COMMENTS SECTION ================= */}
          {showComments && (
            <div className="mt-4 border-t pt-4 space-y-4">
              {/* Add comment */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>
                    {currentUser?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 text-sm border rounded-full outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      disabled={!commentText.trim() || isPosting}
                      onClick={handleAddComment}
                    >
                      {isPosting ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment list */}
              {comments
                .filter((c) => c && c._id)
                .map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
