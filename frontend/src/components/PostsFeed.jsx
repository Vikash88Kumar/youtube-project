import { useEffect, useState,useRef } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Image,
  Smile,
  MapPin,
  BarChart3,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils.js";
import { getAllPosts,createTweet} from "../services/tweets.api.js";





const initialPosts = [
  {
    id: "1",
    user: {
      name: "Tech Insider",
      handle: "@techinsider",
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
      verified: true,
    },
    content:
      "Just dropped a new tutorial on building AI-powered apps! 🚀 Check out the full video on my channel. The future of development is here.",
    timestamp: "2h",
    likes: 2453,
    retweets: 892,
    comments: 156,
  },
  {
    id: "2",
    user: {
      name: "Gaming Pro",
      handle: "@gamingpro",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      verified: true,
    },
    content:
      "That last match was INSANE! 🎮 GG to everyone who watched the stream. New video coming tomorrow!",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    timestamp: "4h",
    likes: 8921,
    retweets: 2341,
    comments: 445,
    liked: true,
  },
  {
    id: "3",
    user: {
      name: "Music Vibes",
      handle: "@musicvibes",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    content:
      "New beat just dropped 🎵 Link in bio. Let me know what you think in the comments!",
    timestamp: "6h",
    likes: 1567,
    retweets: 423,
    comments: 89,
  },
  {
    id: "4",
    user: {
      name: "Dev Community",
      handle: "@devcommunity",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      verified: true,
    },
    content:
      "Hot take: TypeScript is not optional anymore. It's a must-have skill for any serious developer in 2024. Agree or disagree? 👇",
    timestamp: "8h",
    likes: 12453,
    retweets: 3892,
    comments: 1256,
    retweeted: true,
  },
];

/* -------------------- HELPERS -------------------- */

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

/* -------------------- POST CARD -------------------- */

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [retweeted, setRetweeted] = useState(post.retweeted || false);
  const [likes, setLikes] = useState(post.likes);
  const [retweets, setRetweets] = useState(post.retweets);

  function handleLike() {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  }

  function handleRetweet() {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  }

  return (
    <div className="p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.owner.avatar} />
          <AvatarFallback className="bg-secondary">
            {post.owner.fullName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold hover:underline cursor-pointer">
                {post.owner.fullName}
              </span>

              {/* // */}
              {true && (
                <svg
                  className="w-4 h-4 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                </svg>
              )}

              <span className="text-muted-foreground text-sm">
                @{post.owner.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {post?.createdAt.slice(0, 10)}
              </span>
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="mt-1 whitespace-pre-wrap">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border">
              <img src={post.image} alt="Post" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              {/* <span>{formatNumber(post.comments)}</span> */}
            </button>

            <button
              // onClick={handleRetweet}
              className={cn(
                "flex items-center gap-2",
                retweeted ? "text-green-500" : "text-muted-foreground"
              )}
            >
              <Repeat2 className="h-4 w-4" />
              {/* <span>{formatNumber(retweets)}</span> */}
            </button>

            <button
              // onClick={handleLike}
              className={cn(
                "flex items-center gap-2",
                liked ? "text-pink-500" : "text-muted-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              {/* <span>{formatNumber(likes)}</span> */}
            </button>

            <button className="text-muted-foreground hover:text-primary">
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- FEED -------------------- */

function PostsFeed({limit}) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);


  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    async function fetchPosts(){
      const res=await getAllPosts()
      setPosts(res.data)
    }
    fetchPosts()
  },[posts])

  const handlePost=async()=>{
    try {
      const formData=new FormData()
      formData.append("content",postContent)
      if(selectedImage){
        formData.append("image",selectedImage)
      }
      await createTweet(formData)
  
      setPostContent("")
      setSelectedImage(null)
    } catch (error) {
      console.log("frontend post error",error?.message)
    }
  }

  const Posts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="mb-8">
      {/* Compose */}
      <div className="p-4 border rounded-2xl bg-card/50 mb-6 relative">
  <div className="flex gap-3">
    <Avatar className="h-10 w-10">
      <AvatarFallback>ME</AvatarFallback>
    </Avatar>

    <div className="flex-1">
      <textarea
        placeholder="What's happening?"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        className="w-full bg-transparent resize-none outline-none minh-[80px]"
      />

      {selectedImage && (
        <div className="mt-3 relative">
          <img
            src={URL.createObjectURL(selectedImage)}
            className="rounded-xl max-h-60 object-cover"
          />
        </div>
      )}

      <div className="flex justify-between pt-3 border-t">
        <div className="flex gap-1 relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current.click()}
          >
            <Image className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmoji((prev) => !prev)}
          >
            <Smile className="h-5 w-5" />
          </Button>

          {showEmoji && (
            <div className="absolute top-10 z-50">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setPostContent((prev) => prev + emoji.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>

        <Button onClick={handlePost} disabled={!postContent.trim()} size="sm">
          <span>+</span>AddPost
        </Button>
      </div>
    </div>
  </div>
</div>


      {/* Posts */}
      <div className="border rounded-2xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Posts</h2>
        </div>
          
        {Posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default PostsFeed;
