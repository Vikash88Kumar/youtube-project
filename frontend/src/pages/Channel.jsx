import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
  Pencil,
} from "lucide-react";

import {
  getUserChannelProfile,
} from "../services/user.api.js";
import { getChannelVideos } from "../services/dashboard.api.js";
import { getUserTweets } from "../services/tweets.api.js";
import {
  getUserChannelSubscribers,
  toggleSubscription,
} from "../services/subscriptions.api.js";

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  const [channelData, setChannelData] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [userTweets, setUserTweets] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // 🔔 subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);

  /* ================= FETCH CHANNEL ================= */
  useEffect(() => {
    if (!username) return;

    const fetchChannel = async () => {
      try {
        const profileRes = await getUserChannelProfile(username);
        const profile = profileRes.data;

        setChannelData(profile);
        setIsSubscribed(profile.isSubscribed);
        setSubscribersCount(profile.subscribersCount);

        const videosRes = await getChannelVideos(username);
        setChannelVideos(videosRes.data?.videos || []);

        const tweetsRes = await getUserTweets(username);
        setUserTweets(tweetsRes.data?.results?.[0]?.data || []);

        const subsRes = await getUserChannelSubscribers(username);
        setSubscribers(subsRes?.data || []);
      } catch (error) {
        console.error("Failed to load channel", error);
      }
    };

    fetchChannel();
  }, [username]);

  /* ================= TOGGLE SUBSCRIPTION (OPTIMISTIC) ================= */
  const handleToggleSubscription = async () => {
    if (subLoading || !channelData?._id) return;

    const prevSubscribed = isSubscribed;
    const prevCount = subscribersCount;

    // 🔥 optimistic update
    setIsSubscribed(!prevSubscribed);
    setSubscribersCount(
      prevSubscribed ? prevCount - 1 : prevCount + 1
    );
    setSubLoading(true);

    try {
      const res = await toggleSubscription(channelData._id);
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

  if (!channelData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading channel...
      </div>
    );
  }

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
          {/* ================= BANNER ================= */}
          <div className="relative h-48 md:h-64 lg:h-80">
            <img
              src={channelData.coverImage}
              alt="Channel banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ================= CHANNEL INFO ================= */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-6 py-6">
              {/* Avatar */}
              <img
                src={channelData.avatar}
                alt={channelData.username}
                className="w-28 h-28 rounded-full border-4 border-background object-cover -mt-16"
              />

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {channelData.fullName}
                  </h1>
                  <CheckCircle className="h-5 w-5 text-primary fill-primary" />
                </div>

                <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                  <span>@{channelData.username}</span>
                  <span>•</span>
                  <span>{subscribersCount} subscribers</span>
                  <span>•</span>
                  <span>{channelVideos.length} videos</span>
                </div>

                <p className="text-sm text-muted-foreground max-w-2xl">
                  {channelData.description}
                </p>

                {/* Social */}
                <div className="flex gap-3 pt-2">
                  <Twitter />
                  <Instagram />
                  <Youtube />
                  <LinkIcon />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleSubscription}
                  disabled={subLoading}
                  variant={isSubscribed ? "secondary" : "default"}
                  className="gap-2"
                >
                  {isSubscribed && <Bell className="h-4 w-4" />}
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* ================= TABS ================= */}
            <Tabs defaultValue="videos">
              <TabsList className="border-b">
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              </TabsList>

              {/* VIDEOS */}
              <TabsContent value="videos">
                {channelVideos.length === 0 ? (
                  <p className="text-muted-foreground py-8">
                    No videos yet
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
                    {channelVideos.map((video) => (
                      <VideoCard key={video._id} {...video} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* POSTS */}
              <TabsContent value="posts">
                {userTweets.length === 0 ? (
                  <p className="text-muted-foreground py-8">
                    No posts yet
                  </p>
                ) : (
                  userTweets.map((tweet) => (
                    <div key={tweet._id} className="py-4 border-b">
                      {tweet.content}
                    </div>
                  ))
                )}
              </TabsContent>

              {/* SUBSCRIBERS */}
              <TabsContent value="subscribers">
                {subscribers.length === 0 ? (
                  <p className="text-muted-foreground py-8">
                    No subscribers yet
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
                    {subscribers.map((sub) => (
                      <div
                        key={sub._id}
                        onClick={() =>
                          navigate(`/channel/${sub.username}`)
                        }
                        className="cursor-pointer text-center"
                      >
                        <img
                          src={sub.avatar}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        <p className="mt-2 text-sm">
                          {sub.username}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Channel;
