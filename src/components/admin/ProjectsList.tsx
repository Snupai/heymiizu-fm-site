import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";
import Image from "next/image";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

interface ProjectsListProps {
  refreshTrigger: number;
  onEdit: (project: Project) => void;
  onDelete: () => void;
}

export const ProjectsList = ({
  refreshTrigger,
  onEdit,
  onDelete,
}: ProjectsListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*, categories(*)")
        .order("order_index");

      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }

    void fetchProjects();
  }, [refreshTrigger]);

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
    return (
      <p className="text-muted-foreground">
        No projects yet. Add your first one!
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex flex-col items-stretch gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="break-words font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground min-w-0 text-sm [overflow-wrap:anywhere]">
                    {project.categories?.name}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 sm:justify-start">
                <Button
                  aria-label={`Edit ${project.title}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  aria-label={`Delete ${project.title}`}
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, project)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md border border-black/10 bg-white p-4 sm:p-6 [&>button]:hidden">
          <DialogHeader className="text-left">
            <DialogTitle className="mb-2 text-xl font-bold text-ink">
              Delete Project
            </DialogTitle>
            <DialogDescription className="break-words text-base text-ink/70">
              Are you sure you want to delete &quot;{projectToDelete?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setProjectToDelete(null);
              }}
              className="w-full rounded-full border border-brand bg-white px-5 py-2 text-brand transition-colors hover:bg-brand-light sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="w-full rounded-full bg-brand px-5 py-2 text-white transition-colors hover:bg-brand-dark sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
