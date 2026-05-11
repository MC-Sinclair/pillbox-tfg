import { Link, usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import AppLogoIcon from '@/components/app-logo-icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useInitials } from '@/hooks/use-initials'
import { logout } from '@/routes'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any
    const getInitials = useInitials()

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary">
                            <AppLogoIcon className="size-4 fill-current text-white dark:text-black" />
                        </div>
                        <span className="font-semibold text-sm">PillBox</span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">/ Admin</span>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        {auth?.user && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-7">
                                        <AvatarFallback className="text-xs bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground hidden sm:inline">
                                        {auth.user.name}
                                    </span>
                                </div>
                                <Link href={logout()} as="button" method="post">
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                                        <LogOut className="size-4" />
                                        <span className="hidden sm:inline">Salir</span>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}