"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AudioWaveform, LogOut } from "lucide-react"
import { useAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { isLoaded, isSignedIn, user, signIn, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/app", label: "Studio" },
    { href: "/app/history", label: "History" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <AudioWaveform className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Stem<span className="text-primary">Split</span>
          </span>
        </Link>

        {isSignedIn && (
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isLoaded ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : isSignedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-transparent transition-all hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-primary/60"
                aria-label="Account menu"
              >
                {user.initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/app")}>
                  Studio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/app/history")}>
                  History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                    router.push("/")
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => signIn()}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
              <Button
                onClick={() => {
                  signIn()
                  router.push("/app")
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
