import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Auth state listener – keeps session in sync
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Defer to avoid deadlocks with auth
                setTimeout(() => {
                    void checkAdminStatus(session.user.id);
                }, 0);
            } else {
                setIsAdmin(false);
            }
        });

        // Initial load: get existing session and role, then mark loading=false
        const init = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await checkAdminStatus(session.user.id);
            }

            setLoading(false);
        };

        void init();

        return () => subscription.unsubscribe();
    }, []);

    const checkAdminStatus = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", userId)
                .maybeSingle();

            if (!error && data) {
                setIsAdmin(data.role === "admin");
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    return { user, session, loading, isAdmin, signOut };
};
