"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ProjectsList } from "@/components/admin/ProjectsList";
import { CategoriesList } from "@/components/admin/CategoriesList";
import { UsersList } from "@/components/admin/UsersList";
import { ContactSettingsForm } from "@/components/admin/ContactSettingsForm";
import type { Database } from "@/lib/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

const AdminPage = () => {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined,
  );
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  const handleProjectSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
    setRefreshTrigger((prev) => prev + 1);
    toast.success(editingProject ? "Project updated!" : "Project created!");
  };

  const handleCategorySuccess = () => {
    setShowCategoryForm(false);
    setEditingCategory(undefined);
    setRefreshTrigger((prev) => prev + 1);
    toast.success(editingCategory ? "Category updated!" : "Category created!");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditProject = (project: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditCategory = (category: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen pt-[var(--shared-nav-height)]">
      <header className="border-border bg-card/50 sticky top-[var(--shared-nav-height)] z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto grid grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_1fr]">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-center text-xl font-bold sm:text-2xl">
            <span className="text-gradient">Admin Dashboard</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto min-w-0 px-4 py-6 sm:py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid h-auto w-full max-w-xl grid-cols-2 gap-1 md:grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {!showProjectForm ? (
              <>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold">Manage Projects</h2>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setShowProjectForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </div>
                <ProjectsList
                  refreshTrigger={refreshTrigger}
                  onEdit={handleEditProject}
                  onDelete={() => setRefreshTrigger((prev) => prev + 1)}
                />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </CardTitle>
                  <CardDescription>
                    {editingProject
                      ? "Update project details"
                      : "Upload a new project to your portfolio"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectForm
                    project={editingProject}
                    onSuccess={handleProjectSuccess}
                    onCancel={() => {
                      setShowProjectForm(false);
                      setEditingProject(undefined);
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {!showCategoryForm ? (
              <>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold">Manage Categories</h2>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setShowCategoryForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
                <CategoriesList
                  refreshTrigger={refreshTrigger}
                  onEdit={handleEditCategory}
                  onDelete={() => setRefreshTrigger((prev) => prev + 1)}
                />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </CardTitle>
                  <CardDescription>
                    {editingCategory
                      ? "Update category details"
                      : "Create a new category for your projects"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryForm
                    category={editingCategory}
                    onSuccess={handleCategorySuccess}
                    onCancel={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(undefined);
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Users</h2>
            <UsersList refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Contact Form</h2>
            <ContactSettingsForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
