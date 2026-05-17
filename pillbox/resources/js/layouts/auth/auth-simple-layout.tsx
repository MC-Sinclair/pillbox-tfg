import '@/../css/login.css';
import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="login-root">
            <img
                src="/pastillero.png"
                alt=""
                aria-hidden="true"
                className="login-bg-img"
            />
            <div className="login-overlay" />
            <div
                className="login-card"
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
                <Link href={home()} className="login-brand">
                    <img src="/PillBoxLogo.png" alt="PillBox" className="login-logo" />
                    <span className="login-brand-name">PillBox</span>
                </Link>
                <div className="login-header">
                    <h1 className="login-title">{title}</h1>
                    {description && <p className="login-desc">{description}</p>}
                </div>
                {children}
            </div>
        </div>
    );
}
