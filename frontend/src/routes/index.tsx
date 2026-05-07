import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Wand2,
  LayoutTemplate,
  FileText,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resu.ai — Build a stunning resume with AI" },
      {
        name: "description",
        content:
          "AI-powered resume builder with beautiful templates, real-time preview, and one-click PDF export.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Wand2, title: "AI writing assistant", desc: "Generate summaries, improve descriptions, and suggest skills tailored to your role." },
  { icon: LayoutTemplate, title: "Premium templates", desc: "Hand-crafted, ATS-friendly templates that look incredible in light or dark mode." },
  { icon: Zap, title: "Live preview", desc: "Edit on the left, watch your resume update on the right — instantly." },
  { icon: ShieldCheck, title: "Privacy-first", desc: "Your data lives on your own backend. No tracking, no surprises." },
];

function Landing() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-bg absolute inset-0 -z-10" />
        <div className="grid-pattern absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 lg:px-8 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Now with GPT-powered suggestions
            </div>
            <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight md:text-7xl">
              Your next role starts with a <span className="gradient-text">stunning resume</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Resu.ai is the modern resume builder for ambitious people. Beautiful templates,
              AI-generated content, and a delightful editor — all in one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="gap-2 shadow-elegant">
                  Start building free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button size="lg" variant="outline">
                  Browse templates
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              Loved by 12,000+ job seekers
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="glass rounded-2xl p-2 shadow-glow">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  <span className="ml-3 text-xs text-muted-foreground">resu.ai/builder</span>
                </div>
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-24 rounded bg-primary/30" />
                    <div className="h-9 rounded-lg border border-border bg-background" />
                    <div className="h-9 rounded-lg border border-border bg-background" />
                    <div className="h-24 rounded-lg border border-border bg-background" />
                    <div className="flex gap-2">
                      <div className="h-8 w-28 rounded-md gradient-primary" />
                      <div className="h-8 w-28 rounded-md border border-border" />
                    </div>
                  </div>
                  <div className="border-l border-border bg-muted/30 p-6">
                    <div className="rounded-lg bg-card p-5 shadow-card">
                      <div className="h-4 w-40 rounded bg-foreground/80" />
                      <div className="mt-1 h-3 w-28 rounded bg-muted-foreground/50" />
                      <div className="mt-4 space-y-1.5">
                        <div className="h-2 rounded bg-muted-foreground/30" />
                        <div className="h-2 w-5/6 rounded bg-muted-foreground/30" />
                        <div className="h-2 w-4/6 rounded bg-muted-foreground/30" />
                      </div>
                      <div className="mt-5 h-3 w-20 rounded bg-foreground/70" />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-2 rounded bg-muted-foreground/30" />
                        <div className="h-2 w-3/4 rounded bg-muted-foreground/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need, nothing you don't.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A polished writing experience that gets out of your way.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-card md:p-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <FileText className="h-3.5 w-3.5" /> 12+ templates
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                Designed by recruiters. Loved by hiring managers.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every template is ATS-tested and reviewed by industry pros to maximize your callback rate.
              </p>
              <Link to="/templates" className="mt-6 inline-block">
                <Button className="gap-2">
                  Explore templates <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  className="aspect-[3/4] rounded-xl border border-border bg-background p-3 shadow-card"
                >
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-muted to-accent/40 p-3">
                    <div className="h-2 w-12 rounded bg-foreground/70" />
                    <div className="mt-1 h-1.5 w-20 rounded bg-muted-foreground/40" />
                    <div className="mt-3 space-y-1">
                      <div className="h-1 rounded bg-muted-foreground/30" />
                      <div className="h-1 w-5/6 rounded bg-muted-foreground/30" />
                      <div className="h-1 w-4/6 rounded bg-muted-foreground/30" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto max-w-4xl px-4 pb-24 text-center lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Land your dream job. Faster.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Free to start. Upgrade when you're ready.
        </p>
        <Link to="/signup" className="mt-8 inline-block">
          <Button size="lg" className="gap-2 shadow-elegant">
            Create your resume <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </MarketingLayout>
  );
}
