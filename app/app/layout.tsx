import { SiteHeader } from "@/components/site-header"
import { AuthGuard } from "@/components/auth-guard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  )
}
