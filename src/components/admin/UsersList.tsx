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
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="font-medium">{user.email ?? "No email found"}</p>
              <p className="text-muted-foreground font-mono text-xs">
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
            <div className="flex gap-2">
              {user.role !== "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRole(user.user_id, "admin")}
                >
                  Make Admin
                </Button>
              )}
              {user.role !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateRole(user.user_id, "pending")}
                >
                  Set Pending
                </Button>
              )}
              {user.role !== "denied" && (
                <Button
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
