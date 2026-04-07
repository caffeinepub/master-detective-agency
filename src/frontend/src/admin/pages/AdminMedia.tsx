import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Principal } from "@icp-sdk/core/principal";
import { Camera, SwitchCamera, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useCamera } from "../../camera/useCamera";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAddMedia,
  useAllMedia,
  useDeleteMedia,
} from "../../hooks/useQueries";

export function AdminMedia() {
  const { data: media = [], isLoading } = useAllMedia();
  const addMedia = useAddMedia();
  const deleteMedia = useDeleteMedia();
  const { identity } = useInternetIdentity();
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isActive,
    isLoading: camLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
    error: camError,
  } = useCamera();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !identity) return;
    for (const file of Array.from(files)) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        const id = `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await addMedia.mutateAsync({
          id,
          fileName: file.name,
          fileType: file.type,
          category: "gallery",
          uploadedBy: identity.getPrincipal() as unknown as Principal,
          caseId: null,
          blob,
        });
        toast.success(`Uploaded: ${file.name}`);
      } catch {
        toast.error(`Failed to upload: ${file.name}`);
      }
    }
    e.target.value = "";
  };

  const handleCameraCapture = async () => {
    const photo = await capturePhoto();
    if (!photo || !identity) return;
    try {
      const bytes = new Uint8Array(await photo.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const id = `camera-${Date.now()}`;
      await addMedia.mutateAsync({
        id,
        fileName: photo.name,
        fileType: photo.type,
        category: "camera",
        uploadedBy: identity.getPrincipal() as unknown as Principal,
        caseId: null,
        blob,
      });
      toast.success("Photo captured and saved!");
      stopCamera();
      setCameraOpen(false);
    } catch {
      toast.error("Failed to save photo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia.mutateAsync(id);
      toast.success("Media deleted");
    } catch {
      toast.error("Failed to delete media");
    }
  };

  const openCamera = async () => {
    setCameraOpen(true);
    await startCamera();
  };

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground">
            🖼️ Media Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {media.length} files
          </p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold"
            data-ocid="media.upload_button"
          >
            <Upload className="w-4 h-4 mr-1" /> Upload
          </Button>
          <Button
            onClick={openCamera}
            variant="outline"
            className="border-border text-foreground hover:bg-muted text-xs uppercase tracking-wider"
            data-ocid="media.secondary_button"
          >
            <Camera className="w-4 h-4 mr-1" /> Camera
          </Button>
        </div>
      </div>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onOpenChange={(open) => !open && closeCamera()}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="media.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display uppercase">
              Camera Capture
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {camError && (
              <p className="text-destructive text-sm">{camError.message}</p>
            )}
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-2">
              {!isActive ? (
                <Button
                  onClick={startCamera}
                  disabled={camLoading}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent text-xs"
                  data-ocid="media.primary_button"
                >
                  {camLoading ? "Starting..." : "Start Camera"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCameraCapture}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-accent text-xs"
                    data-ocid="media.primary_button"
                  >
                    📷 Capture
                  </Button>
                  <Button
                    onClick={() => switchCamera()}
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground"
                    data-ocid="media.toggle"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery */}
      {isLoading ? (
        <div
          className="py-12 text-center text-muted-foreground"
          data-ocid="media.loading_state"
        >
          Loading media...
        </div>
      ) : media.length === 0 ? (
        <div
          className="py-12 text-center bg-card border border-border rounded-lg"
          data-ocid="media.empty_state"
        >
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-foreground font-bold">No media files</p>
          <p className="text-muted-foreground text-sm mt-1">
            Upload files or use the camera to add media
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          data-ocid="media.list"
        >
          {media.map((item, i) => (
            <div
              key={item.id}
              className="group relative bg-card border border-border rounded-lg overflow-hidden aspect-square"
              data-ocid={`media.item.${i + 1}`}
            >
              {item.blob ? (
                <img
                  src={item.blob.getDirectURL()}
                  alt={item.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3">
                  <p className="text-2xl mb-1">📄</p>
                  <p className="text-xs text-muted-foreground truncate w-full text-center">
                    {item.fileName}
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/80 text-xs"
                  data-ocid="media.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
