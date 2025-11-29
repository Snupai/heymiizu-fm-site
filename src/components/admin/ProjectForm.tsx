import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/lib/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProjectFormProps {
    project?: Project;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState(project?.title ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [categoryId, setCategoryId] = useState(project?.category_id ?? "");
    const [externalLink, setExternalLink] = useState(project?.external_link ?? "");
    const [aspectRatio, setAspectRatio] = useState<"16:9" | "4:3" | "3:4" | null>(project?.aspect_ratio ?? "16:9");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        void fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("*").order("order_index");
        if (data) setCategories(data);
    };

    const uploadFile = async (file: File, bucket: string, path: string) => {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 500);

        try {
            let videoUrl = project?.video_url;
            let thumbnailUrl = project?.thumbnail_url;

            if (videoFile) {
                const videoPath = `${Date.now()}_${videoFile.name}`;
                videoUrl = await uploadFile(videoFile, "project-videos", videoPath);
            }

            if (thumbnailFile) {
                const thumbnailPath = `${Date.now()}_${thumbnailFile.name}`;
                thumbnailUrl = await uploadFile(thumbnailFile, "project-thumbnails", thumbnailPath);
            }

            if (!videoUrl || !thumbnailUrl) {
                throw new Error("Video and thumbnail are required");
            }

            const projectData = {
                title,
                description,
                category_id: categoryId,
                external_link: externalLink || null,
                video_url: videoUrl,
                thumbnail_url: thumbnailUrl,
                aspect_ratio: aspectRatio,
            };

            if (project) {
                const { error } = await supabase
                    .from("projects")
                    .update(projectData)
                    .eq("id", project.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("projects")
                    .insert([projectData]);
                if (error) throw error;
            }

            onSuccess();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save project";
            toast.error(errorMessage);
        } finally {
            clearInterval(progressInterval);
            setUploadProgress(100);
            // Small delay to show 100% before closing/resetting
            setTimeout(() => {
                setLoading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.icon && `${cat.icon} `}{cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio ?? "16:9"} onValueChange={(value) => setAspectRatio(value as "16:9" | "4:3" | "3:4")}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                        <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="externalLink">External Link (optional)</Label>
                <Input
                    id="externalLink"
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="video">Video {!project && "*"}</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const fileSizeInMB = file.size / (1024 * 1024);
                                if (fileSizeInMB > 25) {
                                    toast.error("Video file size must be less than 25MB");
                                    e.target.value = ""; // Clear the input
                                    setVideoFile(null);
                                    return;
                                }
                                if (fileSizeInMB > 15) {
                                    const confirmUpload = window.confirm("The video file is larger than 15MB. Do you want to continue?");
                                    if (!confirmUpload) {
                                        e.target.value = ""; // Clear the input
                                        setVideoFile(null);
                                        return;
                                    }
                                }
                                setVideoFile(file);
                            } else {
                                setVideoFile(null);
                            }
                        }}
                        required={!project}
                    />
                    <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                {project && <p className="text-xs text-muted-foreground">Leave empty to keep current video</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail {!project && "*"}</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                        required={!project}
                    />
                    <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                {project && <p className="text-xs text-muted-foreground">Leave empty to keep current thumbnail</p>}
            </div>

            <div className="flex flex-col gap-4">
                {loading && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}
                <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};
