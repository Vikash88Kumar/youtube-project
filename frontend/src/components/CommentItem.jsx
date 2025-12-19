// // import { ThumbsUp, ThumbsDown } from "lucide-react";
// // import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// // import { useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import { likeComments, getLikedComment } from "../services/likes.api.js";
// // import { cn } from "../lib/utils";

// // function CommentItem({ comment }) {
// //   const navigate = useNavigate();

// //   // 🔹 Local state (source of truth)
// //   const [liked, setLiked] = useState(false);
// //   const [likeCount, setLikeCount] = useState(0);
// //   const [loading, setLoading] = useState(false);

// //   // 🔹 Fetch like state when component mounts
// //   useEffect(() => {
// //     if (!comment?._id) return;

// //     const fetchLikeState = async () => {
// //       try {
// //         const res = await getLikedComment(comment._id);
// //         const { liked, likeCount } = res.data.data;

// //         setLiked(liked);
// //         setLikeCount(likeCount);
// //       } catch (err) {
// //         console.log("Failed to fetch comment likes", err?.message);
// //       }
// //     };

// //     fetchLikeState();
// //   }, [comment?._id]);

// //   // 🔹 Toggle like
// //   const handleLike = async () => {
// //     if (loading) return;

// //     try {
// //       setLoading(true);

// //       const res = await likeComments(comment._id);
// //       const { liked, likeCount } = res.data.data;

// //       setLiked(liked);
// //       setLikeCount(likeCount);
// //     } catch (err) {
// //       console.log("Failed to toggle comment like", err?.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex gap-3">
// //       {/* Avatar */}
// //       <Avatar className="h-9 w-9">
// //         <AvatarImage
// //           src={comment.owner?.avatar}
// //           className="cursor-pointer"
// //           onClick={() => navigate(`/channel/${comment.owner.username}`)}
// //         />
// //         <AvatarFallback>
// //           {comment.owner?.username?.[0]?.toUpperCase() || "U"}
// //         </AvatarFallback>
// //       </Avatar>

// //       {/* Body */}
// //       <div className="flex-1">
// //         {/* Header */}
// //         <div className="flex items-center gap-2">
// //           <span className="font-semibold text-sm">
// //             {comment.owner?.username}
// //           </span>
// //           <span className="text-xs text-muted-foreground">
// //             {new Date(comment.createdAt).toISOString().split("T")[0]}
// //           </span>
// //         </div>

// //         {/* Content */}
// //         <p className="text-sm mt-1 whitespace-pre-line">
// //           {comment.content}
// //         </p>

// //         {/* Actions */}
// //         <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
// //           {/* 👍 Like */}
// //           <button
// //             onClick={handleLike}
// //             disabled={loading}
// //             className={cn(
// //               "flex items-center gap-1 transition-colors",
// //               liked ? "text-primary" : "hover:text-primary",
// //               loading && "opacity-60 cursor-not-allowed"
// //             )}
// //           >
// //             <ThumbsUp
// //               className={cn(
// //                 "h-4 w-4",
// //                 liked && "fill-current"
// //               )}
// //             />
// //             {likeCount}
// //           </button>

// //           {/* 👎 Dislike (UI only) */}
// //           <button className="hover:text-primary">
// //             <ThumbsDown className="h-4 w-4" />
// //           </button>

// //           <button className="hover:text-primary">
// //             Reply
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CommentItem;
// import { useEffect, useState } from "react";
// import { ThumbsUp } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { cn } from "../lib/utils";
// import { likeComments, getLikedComment } from "../services/likes.api";

// function CommentItem({ comment }) {
//   const isTemp = !comment?._id || comment.isTemp;

//   const [liked, setLiked] = useState(comment.liked ?? false);
//   const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);

//   /* 🔥 FETCH LIKE STATE ONLY FOR REAL COMMENTS */
//   useEffect(() => {
//     if (isTemp) return; // ⛔ DO NOTHING

//     const fetchLikeState = async () => {
//       try {
//         const res = await getLikedComment(comment._id);
//         setLiked(res.data.data.liked);
//         setLikeCount(res.data.data.likeCount);
//       } catch (err) {
//         console.log("Failed to fetch comment likes", err?.message);
//       }
//     };

//     fetchLikeState();
//   }, [comment._id, isTemp]);

//   /* 🔥 TOGGLE LIKE */
//   const handleLike = async () => {
//     if (isTemp) return; // ⛔ disable like on temp comment

//     try {
//       const res = await likeComments(comment._id);
//       setLiked(res.data.data.liked);
//       setLikeCount(res.data.data.likeCount);
//     } catch (err) {
//       console.log("Failed to toggle comment like", err?.message);
//     }
//   };

//   return (
//     <div className="flex gap-3">
//       <Avatar className="h-8 w-8">
//         <AvatarImage src={comment.owner?.avatar} />
//         <AvatarFallback>
//           {comment.owner?.username?.[0]?.toUpperCase()}
//         </AvatarFallback>
//       </Avatar>

//       <div className="flex-1">
//         <div className="flex gap-2 text-sm">
//           <span className="font-semibold">
//             {comment.owner?.username}
//           </span>
//           <span className="text-muted-foreground">
//             {new Date(comment.createdAt).toISOString().split("T")[0]}
//           </span>
//         </div>

//         <p className="text-sm mt-1">{comment.content}</p>

//         <button
//           onClick={handleLike}
//           disabled={isTemp}
//           className={cn(
//             "flex items-center gap-1 mt-2 text-xs",
//             liked ? "text-primary" : "text-muted-foreground",
//             isTemp && "opacity-50 cursor-not-allowed"
//           )}
//         >
//           <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
//           {likeCount}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CommentItem;
import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";
import { likeComments, getLikedComment } from "../services/likes.api";
import { useNavigate } from "react-router-dom";

function CommentItem({ comment }) {
  const navigate = useNavigate();
  const isTemp = comment.isTemp;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  /* ---------------- FETCH LIKE STATE ---------------- */
  useEffect(() => {
    if (isTemp) return;

    (async () => {
      try {
        const res = await getLikedComment(comment._id);
        setLiked(res.data.data.liked);
        setLikeCount(res.data.data.likeCount);
      } catch {
        // silent
      }
    })();
  }, [comment._id, isTemp]);

  /* ---------------- TOGGLE LIKE ---------------- */
  const handleLike = async () => {
    if (isTemp) return;

    try {
      const res = await likeComments(comment._id);
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch {}
  };

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment.owner?.avatar}
          onClick={() => navigate(`/channel/${comment.owner?.username}`)}
          className="cursor-pointer"
        />
        <AvatarFallback>
          {comment.owner?.username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex gap-2 text-sm">
          <span className="font-semibold">{comment.owner?.username}</span>
          <span className="text-muted-foreground">
            {comment.createdAt?.slice(0, 10)}
          </span>
        </div>

        <p className="text-sm mt-1">{comment.content}</p>

        <button
          disabled={isTemp}
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            liked ? "text-primary" : "text-muted-foreground",
            isTemp && "opacity-50 cursor-not-allowed"
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
          {likeCount}
        </button>
      </div>
    </div>
  );
}

export default CommentItem;
