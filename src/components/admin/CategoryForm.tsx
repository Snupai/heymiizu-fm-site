import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoryForm = ({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) => {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");
  const [orderIndex, setOrderIndex] = useState(
    category?.order_index?.toString() ?? "0",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name,
        description,
        icon: icon || null,
        order_index: parseInt(orderIndex) || 0,
      };

      if (category) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);
        if (error) throw error;
      }

      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save category";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderIndex">Order Index</Label>
          <Input
            id="orderIndex"
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (emoji or image path)</Label>
        <Input
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="✨ or /icons/my-icon.png"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="w-full sm:w-auto" type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </Button>
        <Button
          className="w-full sm:w-auto"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
