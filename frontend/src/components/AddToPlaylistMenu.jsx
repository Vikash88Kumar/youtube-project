// import { useEffect, useRef, useState } from "react";
// import { MoreVertical, Plus, X } from "lucide-react";
// import { Button } from "./ui/button";
// import { removeVideoFromPlaylist } from "../services/playlists.api";
// import { useParams } from "react-router-dom";

// const AddToPlaylistMenu = ({ onAdd,videoId }) => {
//   const [open, setOpen] = useState(false);
//   const [showInput, setShowInput] = useState(false);
//   const [playlistName, setPlaylistName] = useState("");
//   const ref = useRef(null);
//     const {id}=useParams()
//   // close when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false);
//         setShowInput(false);
//         setPlaylistName("");
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className="relative"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* MORE BUTTON */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//         onClick={() => setOpen((p) => !p)}
//       >
//         <MoreVertical className="h-4 w-4" />
//       </Button>

//       {/* MENU */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-64 bg-background border rounded-xl shadow-lg p-3 z-50">
//           {!showInput ? (
//             <>
//             <button
//               className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm"
//               onClick={() => setShowInput(true)}
//             >
//               ➕ Add to playlist
//             </button>
//             <button
//               className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm"
//               onClick={() => removeVideoFromPlaylist(id,videoId)}
//             >
//                Remove from playlist
//             </button>
//             </>
//           ) : (
//             <>
//               <p className="text-sm font-semibold mb-2">
//                 Create playlist
//               </p>

//               <input
//                 value={playlistName}
//                 onChange={(e) => setPlaylistName(e.target.value)}
//                 placeholder="Playlist name"
//                 className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary"
//               />

//               <div className="flex gap-2 mt-3">
//                 <Button
//                   size="sm"
//                   disabled={!playlistName.trim()}
//                   className="bg-green-600 hover:bg-green-700 text-white flex-1"
//                   onClick={() => {
//                     onAdd(playlistName);
//                     setOpen(false);
//                     setShowInput(false);
//                     setPlaylistName("");
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => {
//                     setShowInput(false);
//                     setPlaylistName("");
//                   }}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddToPlaylistMenu;
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Plus, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../services/playlists.api";

const AddToPlaylistMenu = ({ videoId, playlistId, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeAll();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setShowInput(false);
    setPlaylistName("");
  };

  const handleAdd = async () => {
    if (!playlistName.trim()) return;
    await addVideoToPlaylist(videoId, playlistName);
    closeAll();
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Remove this video from the playlist?"
    );
    if (!confirmed) return;

    await removeVideoFromPlaylist( videoId,playlistId);
    onRemove?.();
    closeAll();
  };

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={() => setOpen((p) => !p)}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-background border rounded-xl shadow-lg p-3 z-50">
          {!showInput ? (
            <>
              <button
                className="w-full px-3 py-2 text-left hover:bg-muted rounded"
                onClick={() => setShowInput(true)}
              >
                ➕ Add to playlist
              </button>

              {playlistId && (
                <button
                  className="w-full px-3 py-2 text-left hover:bg-destructive/10 rounded text-destructive flex items-center gap-2"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove from playlist
                </button>
              )}
            </>
          ) : (
            <>
              <input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full px-3 py-2 border rounded"
              />

              <div className="flex gap-2 mt-3">
                <Button
                  className="bg-green-600 text-white flex-1"
                  disabled={!playlistName.trim()}
                  onClick={handleAdd}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>

                <Button variant="ghost" onClick={closeAll}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistMenu;
