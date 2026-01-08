import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete project");
        } else {
            toast.success("Project deleted");
            onDelete();
        }
    };

    if (loading) return <p className="text-muted-foreground">Loading...</p>;

    if (projects.length === 0) {
        return <p className="text-muted-foreground">No projects yet. Add your first one!</p>;
    }

    return (
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
                                onClick={() => handleDelete(project.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
