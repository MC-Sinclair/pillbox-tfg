import { Link, usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useInitials } from '@/hooks/use-initials'
import { logout } from '@/routes'

const NAV_TABS = [
    { key: 'usuarios',     label: 'Usuarios',     href: '/admin/usuarios' },
    { key: 'residentes',   label: 'Pacientes',    href: '/admin/residentes' },
    { key: 'medicamentos', label: 'Medicamentos', href: '/admin/medicamentos' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const page = usePage()
    const { auth } = page.props as any
    const activeTab = (page.props as any).tab as string
    const getInitials = useInitials()

    return (
        <div className="min-h-screen flex flex-col">
            <header id="admin-header">
                <div id="admin-header-inner">
                    {/* Logo */}
                    <Link href="/admin/usuarios" id="admin-logo">
                        <img src="/PillBoxLogo.png" alt="PillBox" />
                        <span>PillBox</span>
                    </Link>

                    {/* Tabs centrales */}
                    <nav className="admin-tabs">
                        {NAV_TABS.map((t) => (
                            <Link
                                key={t.key}
                                href={t.href}
                                className={`admin-tab${activeTab === t.key ? ' active' : ''}`}
                            >
                                {t.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Usuario */}
                    {auth?.user && (
                        <div id="admin-user">
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name ?? '')}
                                </AvatarFallback>
                            </Avatar>
                            <span id="admin-user-name">{auth.user.name}</span>
                            <Link href={logout()} as="button" method="post">
                                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                                    <LogOut className="size-4" />
                                    <span className="hidden sm:inline">Salir</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}