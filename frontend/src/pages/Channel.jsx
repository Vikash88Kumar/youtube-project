import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { Button } from "../components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import {
  Bell,
  Share2,
  MoreHorizontal,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  Pencil
} from "lucide-react";
import { useEffect } from "react";
import { getUserChannelProfile } from "../services/user.api.js";
import { getChannelVideos } from "../services/dashboard.api.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserTweets } from "../services/tweets.api.js";
import { getUserChannelSubscribers,toggleSubscription } from "../services/subscriptions.api.js";

// const channelData = {
//   name: "TechVision Studio",
//   username: "@techvisionstudio",
//   avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
//   banner: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&h=400&fit=crop",
//   subscribers: "2.5M",
//   totalViews: "150M",
//   videosCount: 342,
//   description: "Welcome to TechVision Studio! We create high-quality tech content, tutorials, and reviews. Join us on this journey to explore the latest in technology.",
//   joinedDate: "Jan 15, 2019",
//   location: "San Francisco, CA",
//   socialLinks: {
//     twitter: "techvision",
//     instagram: "techvisionstudio",
//     website: "techvision.studio"
//   },
//   isVerified: true,
// };

// const channelVideos = [
//   {
//     id: "1",
//     thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
//     title: "Ultimate Guide to React 19 Features",
//     channel: "TechVision Studio",
//     views: "1.2M",
//     timestamp: "2 days ago",
//     duration: "24:15",
//     channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
//   },
//   {
//     id: "2",
//     thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
//     title: "Build a Full Stack App in 2024",
//     channel: "TechVision Studio",
//     views: "890K",
//     timestamp: "1 week ago",
//     duration: "45:30",
//     channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
//   },
//   {
//     id: "3",
//     thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
//     title: "AI Tools Every Developer Needs",
//     channel: "TechVision Studio",
//     views: "2.1M",
//     timestamp: "2 weeks ago",
//     duration: "18:42",
//     channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
//   },
//   {
//     id: "4",
//     thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
//     title: "Master TypeScript in 1 Hour",
//     channel: "TechVision Studio",
//     views: "3.5M",
//     timestamp: "1 month ago",
//     duration: "58:20",
//     channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
//   },
// ];

const Channel = () => {
  const { username } = useParams()


  const [channelData, setChannelData] = useState({})
  const [getchannelvideos, setGetChannelvideos] = useState([])
  const [userTweets, setUserTweets] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("channel");
  const navigate = useNavigate()
  const [subscribers,setSubscribers]=useState([])
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);


  const handleToggleSubscription = async () => {
    if (subLoading) return;

    // save previous state (rollback safety)
    const prevSubscribed = isSubscribed;
    const prevCount = subscribersCount;

    // optimistic UI update
    setIsSubscribed(!prevSubscribed);
    setSubscribersCount(
      prevSubscribed ? prevCount - 1 : prevCount + 1
    );
    setSubLoading(true);

    try {
      // call backend controller
      const res = await toggleSubscription(owner._id);

      // sync with backend (source of truth)
      setIsSubscribed(res.data.data.subscribed);
      setSubscribersCount(res.data.data.subscribersCount);
    } catch (error) {
      console.error("Subscription toggle failed", error?.message);

      // rollback UI
      setIsSubscribed(prevSubscribed);
      setSubscribersCount(prevCount);
    } finally {
      setSubLoading(false);
    }
  };


  //useEffect
  useEffect(() => {
    if (!username) return;
    const fetchChannel = async () => {
      try {
        const res = await getUserChannelProfile(username)
        setChannelData(res.data);
        setIsSubscribed(res.data.isSubscribed)
        const re = await getChannelVideos(username)
        setGetChannelvideos(re.data?.videos)
        const response = await getUserTweets(username);
        setUserTweets(response.data?.results[0].data);
        const resp = await getUserChannelSubscribers(username)
        setSubscribers(resp[0]?.subscriber)

      } catch (error) {
        console.error(error);
      }
    };

    fetchChannel();
  }, [username]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 lg:ml-64">
          {/* Banner */}
          <div className="relative h-48 md:h-64 lg:h-80 group">
            <img
              src={channelData.coverImage}
              alt="Channel banner"
              className="w-full h-full object-cover"
            />

            {/* Edit cover button */}
            <button
              type="button"
              className="
                absolute top-4 right-4
                bg-black/60 text-white
                p-2 rounded-full
                opacity-0 scale-90
                transition-all duration-200 ease-out
                group-hover:opacity-100 group-hover:scale-100
                hover:bg-black/80
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-white
              "
              title="Edit cover image"
            >
              <Pencil className="h-6 w-6" />
            </button>
          </div>



          {/* Channel Info */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 py-6">
              {/* Avatar */}
              <div className="-mt-16 md:-mt-12 z-10 relative w-fit group">
                <img
                  src={channelData.avatar}
                  alt={channelData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background object-cover"
                />

                {/* Edit avatar button */}
                <button
                  type="button"
                  className="
                      absolute bottom-14 right-1
                      bg-black/70 text-white
                      p-1.5 rounded-full
                      opacity-0 scale-90
                      transition-all duration-200 ease-out
                      group-hover:opacity-100 group-hover:scale-100
                      hover:bg-black/90
                      cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-white
                    "
                  title="Edit avatar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>



              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{channelData.fullName}</h1>
                  {channelData && (
                    <CheckCircle className="h-5 w-5 text-primary fill-primary" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>@{channelData.username}</span>
                  <span>•</span>
                  <span>{channelData.channelsSubscribedToCount} channelSubscribedTo</span>
                  <span>•</span>
                  <span>{channelData.subscribersCount} subscribers</span>
                  <span>•</span>
                  <span>{getchannelvideos.length} videos</span>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                  {channelData?.description}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Twitter className="h-7 w-7" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Instagram className="h-7 w-7" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Youtube className="h-7 w-7" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <LinkIcon className="h-7 w-7" />
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-2">
                <Button
                  onClick={handleToggleSubscription}
                  variant={isSubscribed ? "secondary" : "default"}
                  className="gap-2 rounded-full"
                  disabled={subLoading}
                >
                  {isSubscribed && <Bell className="h-4 w-4" />}
                  {subLoading
                    ? "Updating..."
                    : isSubscribed
                      ? "Subscribed"
                      : "Subscribe"}
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-6">
                <TabsTrigger
                  value="videos"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="shorts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Shorts
                </TabsTrigger>
                <TabsTrigger
                  value="playlists"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Playlists
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="community"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Community
                </TabsTrigger>
                <TabsTrigger
                  value="subscribers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Your Subscribers
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                  {!getChannelVideos ? "No Videos yet" : getchannelvideos.map((video) => {
                    const owner = video.owner; // already populated from backend

                    return (
                      <div
                        key={video._id}
                        onClick={() => { navigate(`/videos/${video._id}`) }}
                        className="group cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Duration */}
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {Math.floor(video.duration / 60)}:
                            {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex gap-3 mt-3">
                          {/* Channel Avatar */}
                          <img
                            src={channelData.avatar}
                            alt={owner?.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />

                          {/* Text */}
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {video.title}
                            </h3>

                            <p className="text-xs text-muted-foreground mt-1">
                              {channelData?.username}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {video.views} views •{" "}
                              {new Date(video.createdAt).toISOString().split("T")[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </TabsContent>

              <TabsContent value="shorts">
                <p className="text-muted-foreground py-8">No shorts yet</p>
              </TabsContent>

              <TabsContent value="posts" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                  {!userTweets ? "No Tweets yet" : userTweets?.map((tweet) => {
                    const owner = tweet.owner;

                    return (
                      <div
                        key={tweet._id}
                        onClick={() => { navigate(`/tweet/${tweet._id}`) }}
                        className="group cursor-pointer"
                      >
                        {/* Thumbnail */}
                        {tweet.image ? <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                          <img
                            src={tweet.image}
                            alt={tweet.content}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div> : ""}

                        {/* Info */}
                        <div className="flex gap-3 mt-3">
                          {/* Channel Avatar */}
                          <img
                            src={owner.avatar}
                            alt={owner?.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />

                          {/* Text */}
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {tweet.content}
                            </h3>

                            <p className="text-xs text-muted-foreground mt-1">
                              {tweet.owner?.username}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {tweet?.views} views •{" "}
                              {new Date(tweet.createdAt).toISOString().split("T")[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </TabsContent>

              <TabsContent value="subscribers" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                  {subscribers.length ===0 ?(  <p className="text-muted-foreground">No subscribers yet</p>
                  ) : ( subscribers?.map((subscriber) => {
                  return (
                      <div
                        key={subscriber._id}
                        onClick={() => { navigate(`/channel/${subscriber?.username}`) }}
                        className="group cursor-pointer"
                      >

                        {subscriber.avatar ? (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black">
                            <img
                              src={subscriber.avatar}
                              alt={subscriber.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : ""}
                        <div>{subscriber.username}</div>
                      </div>
                    );
                  }))}

                </div>
              </TabsContent>

              <TabsContent value="playlists">
                <p className="text-muted-foreground py-8">No playlists yet</p>
              </TabsContent>

              <TabsContent value="community">
                <p className="text-muted-foreground py-8">No community posts yet</p>
              </TabsContent>

              <TabsContent value="about" className="max-w-2xl">
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{channelData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2">{channelData.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Joined:</span>
                      <span className="ml-2">{channelData.joinedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total views:</span>
                      <span className="ml-2">{channelData.totalViews}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
};

export default Channel;