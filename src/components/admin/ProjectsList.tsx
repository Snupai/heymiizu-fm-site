import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";
import Image from "next/image";

type Project = Database['public']['Tables']['projects']['Row'] & {
    categories: Database['public']['Tables']['categories']['Row'] | null;
};

interface ProjectsListProps {
    refreshTrigger: number;
    onEdit: (project: Project) => void;
    onDelete: () => void;
}

export const ProjectsList = ({ refreshTrigger, onEdit, onDelete }: ProjectsListProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        void fetchProjects();
    }, [refreshTrigger]);

    const fetchProjects = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*, categories(*)")
            .order("order_index");

        if (data) {
            // Cast the data to match the expected type structure since Supabase joins can be tricky to type automatically
            setProjects(data as unknown as Project[]);
        }
        setLoading(false);
    };

    const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
        // If Shift is held, delete immediately without confirmation
        if (e.shiftKey) {
            void performDelete(project.id);
        } else {
            // Show confirmation dialog
            setProjectToDelete({ id: project.id, title: project.title });
            setShowDeleteDialog(true);
        }
    };

    const performDelete = async (id: string) => {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete project");
        } else {
            toast.success("Project deleted");
            onDelete();
        }
        setShowDeleteDialog(false);
        setProjectToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (projectToDelete) {
            void performDelete(projectToDelete.id);
        }
    };

    if (loading) return <p className="text-muted-foreground">Loading...</p>;

    if (projects.length === 0) {
        return <p className="text-muted-foreground">No projects yet. Add your first one!</p>;
    }

    return (
        <>
            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative w-24 h-16 rounded overflow-hidden">
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {project.categories?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(project)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => handleDeleteClick(e, project)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-white border border-black/10 rounded-lg p-6 max-w-md [&>button]:hidden">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-ink text-xl font-bold mb-2">
                            Delete Project
                        </DialogTitle>
                        <DialogDescription className="text-ink/70 text-base">
                            Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setProjectToDelete(null);
                            }}
                            className="px-5 py-2 rounded-full bg-white text-brand border border-brand hover:bg-brand-light transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="px-5 py-2 rounded-full bg-brand hover:bg-brand-dark text-white transition-colors"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
