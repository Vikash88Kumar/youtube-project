import { Play, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* -------------------- DATA -------------------- */

const shorts = [
  {
    id: "693c5be4efc9e73403f662bd",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=700&fit=crop",
    title: "Mind-blowing coding trick! 🤯",
    views: "2.3M",
    channel: "CodeTips",
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=700&fit=crop",
    title: "Epic gaming moment",
    views: "1.8M",
    channel: "GameClips",
  },
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=700&fit=crop",
    title: "New beat just dropped 🎵",
    views: "956K",
    channel: "BeatMaker",
  },
  {
    id: "4",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=700&fit=crop",
    title: "Tech hack you need!",
    views: "3.1M",
    channel: "TechHacks",
  },
  {
    id: "5",
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=700&fit=crop",
    title: "Retro game nostalgia",
    views: "780K",
    channel: "RetroVibes",
  },
  {
    id: "6",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop",
    title: "Crazy life hack 💡",
    views: "4.2M",
    channel: "LifeHacks",
  },
  {
    id: "7",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop",
    title: "Wait for it... 😂",
    views: "5.6M",
    channel: "FunnyClips",
  },
  {
    id: "8",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=700&fit=crop",
    title: "AI does something crazy",
    views: "2.9M",
    channel: "AIDaily",
  },
];

/* -------------------- COMPONENT -------------------- */

function ShortsCarousel() {
    const navigate = useNavigate();
  
    return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Flame className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Shorts</h2>
      </div>

      {/* Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 lg:-mx-6 lg:px-6">
        {shorts.map((short, index) => (
          <div
              key={short.id}
              onClick={() => navigate(`/shorts/${short.id}`)}
              className="group shrink-0 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
 
            {/* Card */}
            <div className="relative w-40 sm:w-44 rounded-2xl overflow-hidden bg-secondary"
                style={{ aspectRatio: "9 / 16" }}>

              <img
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />

              {/* Play button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                  <Play
                    className="h-5 w-5 text-primary-foreground ml-0.5"
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold line-clamp-2 mb-1">
                  {short.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {short.views} views
                </p>
              </div>

              {/* Channel badge */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded-full glass text-xs font-medium">
                {short.channel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortsCarousel;
