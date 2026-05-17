import { Link, usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { logout } from '@/routes'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any
    const getInitials = useInitials()

    return (
        <div className="panel-root min-h-screen flex flex-col">
            <header id="panel-header">
                <div id="panel-header-inner">
                    <Link href="/panel" id="panel-logo">
                        <img src="/PillBoxLogo.png" alt="PillBox" />
                        <span>PillBox</span>
                    </Link>

                    {auth?.user && (
                        <div id="panel-user">
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs bg-neutral-200 text-black">
                                    {getInitials(auth.user.name ?? '')}
                                </AvatarFallback>
                            </Avatar>
                            <span id="panel-user-name">{auth.user.name}</span>
                            <Link
                                href={logout()}
                                as="button"
                                method="post"
                                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded"
                            >
                                <LogOut className="size-4" />
                                <span className="hidden sm:inline">Salir</span>
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