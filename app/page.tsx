"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  AudioWaveform,
  Download,
  Sparkles,
  Zap,
} from "lucide-react"
import { useAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Waveform } from "@/components/waveform"
import { STEM_META, STEM_ORDER } from "@/lib/stems"

const features = [
  {
    icon: Sparkles,
    title: "Studio Quality",
    body: "State-of-the-art source separation delivers clean, artifact-free stems ready for remixing and sampling.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    body: "No queues, no waiting rooms. Upload a track and hear isolated stems in seconds, not hours.",
  },
  {
    icon: Download,
    title: "Download Stems",
    body: "Grab individual tracks or the full set as a ZIP in high-resolution WAV, ready for your DAW.",
  },
]

export default function LandingPage() {
  const { isSignedIn, signIn } = useAuth()
  const router = useRouter()

  const handleStart = () => {
    if (!isSignedIn) signIn()
    router.push("/app")
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(0,220,130,0.14) 0%, rgba(0,220,130,0) 70%)",
            }}
          />
          <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-primary" />
                AI-powered source separation
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
              >
                Split Any Song Into{" "}
                <span className="text-primary">Stems with AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
              >
                Upload a track. Get vocals, drums, bass, and instruments
                separated in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="group h-12 px-6 text-base"
                >
                  Start Splitting
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="#features" />}
                  className="h-12 border-border bg-transparent px-6 text-base hover:bg-card"
                >
                  See how it works
                </Button>
              </motion.div>
            </div>

            {/* Hero visual: stem stack */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <AudioWaveform className="size-4 text-primary" />
                midnight-drive.mp3 — separated
              </div>
              <div className="flex flex-col gap-3">
                {STEM_ORDER.map((type, i) => (
                  <div
                    key={type}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <span className="w-16 shrink-0 text-sm font-medium">
                      {STEM_META[type].label}
                    </span>
                    <div className="h-8 flex-1">
                      <Waveform
                        seed={i + 2}
                        bars={40}
                        color={STEM_META[type].color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to isolate sound
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Built for producers, remixers, and anyone who wants control over
              the mix.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center">
            <h3 className="text-2xl font-semibold">Ready to hear the parts?</h3>
            <p className="max-w-md text-muted-foreground">
              Your first five separations are on us, every single day.
            </p>
            <Button
              size="lg"
              onClick={handleStart}
              className="group mt-2 h-12 px-6 text-base"
            >
              Start Splitting
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <AudioWaveform className="size-4" />
            </span>
            <span className="text-sm font-medium">
              Stem<span className="text-primary">Split</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="/app" className="hover:text-foreground">
              Studio
            </Link>
            <Link href="/app/history" className="hover:text-foreground">
              History
            </Link>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">
            © 2026 StemSplit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
