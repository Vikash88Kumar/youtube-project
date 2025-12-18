import { Play, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { addVideoTowatchHistory } from "../services/watchhistory.api";
const VideoCard = ({
  _id ,
  thumbnail,
  title,
  channel,
  owner,
  views,
  createdAt,
  duration,
  isLive = false,
}) => {
  const navigate = useNavigate();
  const {username,fullName,avatar}=owner || {}
  return (
    <div
      className="group cursor-pointer animate-fade-in"
      onClick={async() =>{ 
      try {
          await addVideoTowatchHistory(_id);
          navigate(`/videos/${_id}`);
        } catch (error) {
          console.error("Failed to add to history", error);
          navigate(`/videos/${_id}`); 
        }
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Play
              className="h-6 w-6 text-primary-foreground ml-1"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-background/90 text-xs font-medium">
          {isLive ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              LIVE
            </span>
          ) : (
            (Number(duration) || 0).toFixed(2)
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={owner?.avatar} />
          <AvatarFallback className="bg-secondary text-xs"> 
            {/* {fullName}  */}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors">
            {owner?.fullName}
          </p>

          <p className="text-sm text-muted-foreground">
            {views} views • {createdAt ? new Date(createdAt).toISOString().split("T")[0] : ""}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;
