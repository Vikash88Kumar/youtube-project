import { Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { addVideoTowatchHistory } from "../services/watchhistory.api";
import AddToPlaylistMenu from "./AddToPlaylistMenu.jsx";
import { addVideoToPlaylist } from "../services/playlists.api.js";
const VideoCard = ({
  _id,
  thumbnail,
  title,
  owner,
  views,
  createdAt,
  duration,
  isLive = false,
  playlistId,
  onRemoveFromPlaylist
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer animate-fade-in"
      onClick={async () => {
        try {
          await addVideoTowatchHistory(_id);
        } catch {}
        navigate(`/videos/${_id}`);
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
          {isLive ? "LIVE" : (Number(duration) || 0).toFixed(2)}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={owner?.avatar} />
          <AvatarFallback>
            {owner?.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {owner?.fullName}
          </p>

          <p className="text-sm text-muted-foreground">
            {views} views •{" "}
            {createdAt
              ? new Date(createdAt).toISOString().split("T")[0]
              : ""}
          </p>
        </div>

        {/* 🔥 ADD TO PLAYLIST MENU */}
        <AddToPlaylistMenu videoId={_id} playlistId={playlistId}  onRemove={() => onRemoveFromPlaylist?.(_id)}
          onAdd={(playlistName) => {
            addVideoToPlaylist(_id,playlistName)
          }}
        />
      </div>
    </div>
  );
};

export default VideoCard;
