import { Link, usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useInitials } from '@/hooks/use-initials'
import { logout } from '@/routes'

const NAV_TABS = [
    { key: 'pautas',       label: 'Pautas',       href: '/medico/pautas' },
    { key: 'historial',    label: 'Historial',    href: '/medico/historial' },
    { key: 'medicamentos', label: 'Medicamentos', href: '/medico/medicamentos' },
]

export default function MedicoLayout({ children }: { children: React.ReactNode }) {
    const page = usePage()
    const { auth } = page.props as any
    const activeTab = (page.props as any).tab as string
    const getInitials = useInitials()

    return (
        <div className="medico-root min-h-screen flex flex-col">
            <header id="medico-header">
                <div id="medico-header-inner">
                    <Link href="/medico/pautas" id="medico-logo">
                        <img src="/PillBoxLogo.png" alt="PillBox" />
                        <span>PillBox</span>
                    </Link>

                    <nav className="medico-tabs">
                        {NAV_TABS.map((t) => (
                            <Link
                                key={t.key}
                                href={t.href}
                                className={`medico-tab${activeTab === t.key ? ' active' : ''}`}
                            >
                                {t.label}
                            </Link>
                        ))}
                    </nav>

                    {auth?.user && (
                        <div id="medico-user">
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs bg-neutral-200 text-black">
                                    {getInitials(auth.user.name ?? '')}
                                </AvatarFallback>
                            </Avatar>
                            <span id="medico-user-name">{auth.user.name}</span>
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