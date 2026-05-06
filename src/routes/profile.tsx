import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Resu.ai" }] }),
  component: ProfilePage,
});

interface ProfileForm {
  name: string;
  email: string;
}

function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileInner />
    </DashboardLayout>
  );
}

function ProfileInner() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      // Wire to PUT /api/auth/me when backend is ready
      await new Promise((r) => setTimeout(r, 500));
      if (user) setUser({ ...user, ...data });
      toast.success("Profile updated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account information.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full gradient-primary text-2xl font-semibold text-primary-foreground">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name || "Your name"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
