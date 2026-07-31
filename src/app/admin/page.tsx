"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const AdminPage = () => {
    const router = useRouter();
    const { user, isAdmin, loading } = useAuth();
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
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
        setRefreshTrigger(prev => prev + 1);
        toast.success(editingProject ? "Project updated!" : "Project created!");
    };

    const handleCategorySuccess = () => {
        setShowCategoryForm(false);
        setEditingCategory(undefined);
        setRefreshTrigger(prev => prev + 1);
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-20 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Gallery
                    </Button>
                    <h1 className="text-2xl font-bold">
                        <span className="text-gradient">Admin Dashboard</span>
                    </h1>
                    <div className="w-[100px]" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="projects" className="space-y-6">
                    <TabsList className="grid w-full max-w-xl grid-cols-4">
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="space-y-6">
                        {!showProjectForm ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">Manage Projects</h2>
                                    <Button onClick={() => setShowProjectForm(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Project
                                    </Button>
                                </div>
                                <ProjectsList
                                    refreshTrigger={refreshTrigger}
                                    onEdit={handleEditProject}
                                    onDelete={() => setRefreshTrigger(prev => prev + 1)}
                                />
                            </>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
                                    <CardDescription>
                                        {editingProject ? "Update project details" : "Upload a new project to your portfolio"}
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
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">Manage Categories</h2>
                                    <Button onClick={() => setShowCategoryForm(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Category
                                    </Button>
                                </div>
                                <CategoriesList
                                    refreshTrigger={refreshTrigger}
                                    onEdit={handleEditCategory}
                                    onDelete={() => setRefreshTrigger(prev => prev + 1)}
                                />
                            </>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
                                    <CardDescription>
                                        {editingCategory ? "Update category details" : "Create a new category for your projects"}
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
