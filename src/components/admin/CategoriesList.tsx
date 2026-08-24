import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriesListProps {
  refreshTrigger: number;
  onEdit: (category: Category) => void;
  onDelete: () => void;
}

export const CategoriesList = ({
  refreshTrigger,
  onEdit,
  onDelete,
}: CategoriesListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("order_index");
      if (data) setCategories(data);
      setLoading(false);
    }

    void fetchCategories();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (
      !confirm("Are you sure? This will delete all projects in this category.")
    )
      return;

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
    return (
      <p className="text-muted-foreground">
        No categories yet. Add your first one!
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent className="flex flex-col items-stretch gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="flex min-w-0 items-center gap-2 break-words font-semibold">
                {category.icon && <span>{category.icon}</span>}
                {category.name}
              </h3>
              {category.description && (
                <p className="text-muted-foreground break-words text-sm">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 sm:justify-start">
              <Button
                aria-label={`Edit ${category.name}`}
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                aria-label={`Delete ${category.name}`}
                variant="outline"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
