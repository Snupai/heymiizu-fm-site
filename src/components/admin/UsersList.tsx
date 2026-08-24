import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

interface UsersListProps {
  refreshTrigger: number;
}

export const UsersList = ({ refreshTrigger }: UsersListProps) => {
  const [users, setUsers] = useState<(UserRole & { email?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (roles) {
      const usersWithEmails = await Promise.all(
        roles.map(async (user) => {
          // @ts-expect-error - RPC function not in types
          const { data: email } = await supabase.rpc("get_user_email", {
            user_uuid: user.user_id,
          });
          return { ...user, email: email as unknown as string };
        }),
      );
      setUsers(usersWithEmails);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const updateRole = async (
    userId: string,
    newRole: "admin" | "pending" | "denied",
  ) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update user role");
    } else {
      toast.success("User role updated");
      void fetchUsers();
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="flex flex-col items-stretch gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1">
              <p className="break-all font-medium">
                {user.email ?? "No email found"}
              </p>
              <p className="text-muted-foreground break-all font-mono text-xs">
                ID: {user.user_id}
              </p>
              <Badge
                variant={
                  user.role === "admin"
                    ? "default"
                    : user.role === "denied"
                      ? "destructive"
                      : "secondary"
                }
              >
                {user.role}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              {user.role !== "admin" && (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  size="sm"
                  onClick={() => updateRole(user.user_id, "admin")}
                >
                  Make Admin
                </Button>
              )}
              {user.role !== "pending" && (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  size="sm"
                  onClick={() => updateRole(user.user_id, "pending")}
                >
                  Set Pending
                </Button>
              )}
              {user.role !== "denied" && (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  size="sm"
                  onClick={() => updateRole(user.user_id, "denied")}
                >
                  Deny
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
