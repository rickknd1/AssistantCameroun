// Force le rendu dynamique de /admin/login (page client utilisant Supabase),
// ce qui évite un conflit de routage avec /admin lors du packaging Vercel.
export const dynamic = 'force-dynamic'

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
