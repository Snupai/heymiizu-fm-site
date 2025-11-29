import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoriesListProps {
    refreshTrigger: number;
    onEdit: (category: Category) => void;
    onDelete: () => void;
}

export const CategoriesList = ({ refreshTrigger, onEdit, onDelete }: CategoriesListProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void fetchCategories();
    }, [refreshTrigger]);

    const fetchCategories = async () => {
        const { data } = await supabase
            .from("categories")
            .select("*")
            .order("order_index");
        if (data) setCategories(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete all projects in this category.")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete category");
        } else {
            toast.success("Category deleted");
            onDelete();
        }
    };

    if (loading) return <p className="text-muted-foreground">Loading...</p>;

    if (categories.length === 0) {
        return <p className="text-muted-foreground">No categories yet. Add your first one!</p>;
    }

    return (
        <div className="grid gap-4">
            {categories.map((category) => (
                <Card key={category.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2">
                                {category.icon && <span>{category.icon}</span>}
                                {category.name}
                            </h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(category)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
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
