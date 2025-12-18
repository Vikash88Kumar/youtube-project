import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  PlaySquare,
  Plus,
  ImagePlus,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog.jsx";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { createPlaylist, getUserPlaylists } from "../services/playlists.api";

const Playlists = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("playlists");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentUser = useSelector((state) => state.auth.userData);

  /* ---------------- FETCH PLAYLISTS ---------------- */

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchPlaylists = async () => {
      try {
        const res = await getUserPlaylists(currentUser._id);
        setPlaylists(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch playlists", error);
      }
    };

    fetchPlaylists();
  }, [currentUser?._id]);

  /* ---------------- NEW PLAYLIST STATE ---------------- */

  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    visibility: "public",
    thumbnailPreview: null,
    thumbnailFile: null,
  });

  /* ---------------- THUMBNAIL HANDLER ---------------- */

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewPlaylist((prev) => ({
      ...prev,
      thumbnailPreview: URL.createObjectURL(file),
      thumbnailFile: file,
    }));
  };

  /* ---------------- CREATE PLAYLIST ---------------- */

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim() || isCreating) return;

    try {
      setIsCreating(true);

      const formData = new FormData();
      formData.append("name", newPlaylist.name);
      formData.append("description", newPlaylist.description);
      formData.append("visibility", newPlaylist.visibility);

      if (newPlaylist.thumbnailFile) {
        formData.append("thumbnail", newPlaylist.thumbnailFile);
      }

      const res = await createPlaylist(formData);

      // ✅ Update UI immediately
      if (res?.data?._id) {
        setPlaylists((prev) => [res.data, ...prev]);
        setSuccessMessage("Playlist created successfully 🎉");

        // auto-hide success message
        setTimeout(() => setSuccessMessage(""), 3000);
      }

      // reset form
      setNewPlaylist({
        name: "",
        description: "",
        visibility: "public",
        thumbnailPreview: null,
        thumbnailFile: null,
      });

      setDialogOpen(false);
    } catch (error) {
      console.error("Create playlist failed", error?.message);
    } finally {
      setIsCreating(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <PlaySquare className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Playlists</h1>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Playlist
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                    <DialogDescription>
                      Add a thumbnail, name and visibility.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    {/* Thumbnail */}
                    <div className="space-y-2">
                      <Label>Thumbnail</Label>

                      {newPlaylist.thumbnailPreview ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={newPlaylist.thumbnailPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            disabled={isCreating}
                            onClick={() =>
                              setNewPlaylist((prev) => ({
                                ...prev,
                                thumbnailPreview: null,
                                thumbnailFile: null,
                              }))
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50">
                          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Upload thumbnail
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailChange}
                            disabled={isCreating}
                          />
                        </label>
                      )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label>Playlist Name</Label>
                      <Input
                        value={newPlaylist.name}
                        disabled={isCreating}
                        onChange={(e) =>
                          setNewPlaylist((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter playlist name"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        disabled={isCreating}
                        value={newPlaylist.description}
                        onChange={(e) =>
                          setNewPlaylist((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Optional description"
                      />
                    </div>

                    {/* Visibility */}
                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <Select
                        value={newPlaylist.visibility}
                        onValueChange={(value) =>
                          setNewPlaylist((prev) => ({
                            ...prev,
                            visibility: value,
                          }))
                        }
                        disabled={isCreating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled={isCreating}
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleCreatePlaylist}
                        disabled={!newPlaylist.name.trim() || isCreating}
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Playlist"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-500/10 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Playlists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(playlists) &&
                playlists.filter(Boolean).map((playlist) => (
                  <div key={playlist._id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded text-xs">
                        {playlist?.videos?.length || 0} videos
                      </div>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary">
                      {playlist.name}
                    </h3>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Playlists;
