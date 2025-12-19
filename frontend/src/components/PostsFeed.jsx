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

import PostCard from "./PostCard.jsx";



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
  },[])

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
