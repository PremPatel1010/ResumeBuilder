import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Trash2, LogOut } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Resu.ai" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsInner />
    </DashboardLayout>
  );
}

function SettingsInner() {
  const { theme, toggle } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Customize Resu.ai to your taste.</p>
      </div>

      <Section title="Appearance" desc="Toggle between light and dark mode.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="text-sm capitalize">{theme} mode</span>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggle} />
        </div>
      </Section>

      <Section title="Notifications" desc="Email summaries and product news.">
        <div className="space-y-3">
          <Row label="Product updates" />
          <Row label="Weekly digest" defaultChecked />
        </div>
      </Section>

      <Section title="Danger zone" desc="Irreversible account actions." danger>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              logout();
              toast.success("Signed out");
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
          <Button variant="destructive" className="gap-2" onClick={() => toast.error("Connect your backend to enable account deletion")}>
            <Trash2 className="h-4 w-4" /> Delete account
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
  danger,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-card p-6 shadow-card ${danger ? "border-destructive/30" : "border-border"}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
