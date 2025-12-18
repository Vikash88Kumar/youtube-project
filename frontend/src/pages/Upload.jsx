import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Upload,
  Image as ImageIcon,
  Film,
  Globe,
  Lock,
  Users,
  X,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";
import { publishAVideo } from "../services/video.api";

/* -------------------- COMPONENT -------------------- */

export default function UploadVideo() {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    visibility: "public",
    category: "",
  });

  /* -------------------- HANDLERS -------------------- */

  const selectVideo = (e) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const selectThumbnail = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnail(file);

      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startUpload = async (e) => {
  e.preventDefault();

  try {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail",thumbnail)
    formData.append("title", form.title);
    formData.append("description", form.description);

    await publishAVideo(formData, setProgress);

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Upload failed");
  } finally {
    setUploading(false);
  }
};


  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} activeTab="upload" />

        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Upload video</h1>

            {!videoFile ? (
              /* -------- DROP ZONE -------- */
              <div
                className="border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center bg-card hover:border-primary transition"
                onClick={() => videoInputRef.current.click()}
              >
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Upload className="h-10 w-10 text-primary" />
                </div>

                <h2 className="text-lg font-semibold">
                  Drag and drop video files to upload
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Your videos will be private until you publish them
                </p>

                <Button className="mt-6">Select files</Button>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={selectVideo}
                />
              </div>
            ) : (
              /* -------- MAIN FORM -------- */
              <form onSubmit={startUpload} className="grid lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Video Info */}
                  <div className="glass rounded-xl p-6 space-y-4">
                    <Label>Title (required)</Label>
                    <Input
                      value={form.title}
                      maxLength={100}
                      placeholder="Add a title that describes your video"
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />

                    <Label>Description</Label>
                    <Textarea
                      rows={6}
                      placeholder="Tell viewers about your video"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="glass rounded-xl p-6">
                    <Label>Thumbnail</Label>
                    <div
                      onClick={() => thumbInputRef.current.click()}
                      className={cn(
                        "mt-3 aspect-video border rounded-lg flex items-center justify-center cursor-pointer",
                        "hover:border-primary transition overflow-hidden"
                      )}
                    >
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Upload thumbnail
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={selectThumbnail}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  {/* Video File */}
                  <div className="glass rounded-xl p-4 flex gap-3">
                    <Film className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{videoFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      {uploading && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs mt-1 text-muted-foreground">
                            Uploading {progress}%
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Visibility */}
                  <div className="glass rounded-xl p-6 space-y-3">
                    <Label>Visibility</Label>

                    {[
                      { value: "public", label: "Public", icon: Globe },
                      { value: "unlisted", label: "Unlisted", icon: Users },
                      { value: "private", label: "Private", icon: Lock },
                    ].map((v) => (
                      <label
                        key={v.value}
                        className={cn(
                          "flex gap-3 p-3 rounded-lg border cursor-pointer",
                          form.visibility === v.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        )}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={v.value}
                          checked={form.visibility === v.value}
                          onChange={(e) =>
                            setForm({ ...form, visibility: e.target.value })
                          }
                          hidden
                        />
                        <v.icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium capitalize">{v.value}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!form.title || uploading}
                    >
                      Publish
                    </Button>
                  </div>
                </div>
              </form>
            )}
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
}
