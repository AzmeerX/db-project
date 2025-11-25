'use client';

import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartSheet from './cart-sheet';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const session = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Best Selling', href: '/best-selling' },
        { label: 'Offers', href: '/offers' },
        { label: 'Orders', href: '/account/orders' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
            <div className="flex h-10 items-center justify-center bg-neutral-900 text-center text-white px-4">
                <span className="text-xs md:text-sm font-light tracking-wider">
                    Free delivery on orders over $50 • 30-minute express delivery
                </span>
            </div>
            <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                <Link href="/" className="text-xl md:text-2xl font-light tracking-tight text-neutral-900">
                    CHOCO<span className="font-semibold">DELIGHT</span>
                </Link>
                
                <ul className="hidden items-center gap-8 lg:flex">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link 
                                href={item.href}
                                className={cn(
                                    'text-sm font-light tracking-wide transition-all hover:text-neutral-900',
                                    pathname === item.href 
                                        ? 'text-neutral-900 font-normal border-b-2 border-neutral-900 pb-1' 
                                        : 'text-neutral-600'
                                )}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <CartSheet />
                    <div className="hidden md:block text-sm font-light text-neutral-600 transition-colors hover:text-neutral-900">
                        {session.status === 'authenticated' ? (
                            <button onClick={() => signOut()} className="tracking-wide">Logout</button>
                        ) : (
                            <Link href="/api/auth/signin" className="tracking-wide">Sign in</Link>
                        )}
                    </div>
                    <button
                        className="lg:hidden text-neutral-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </nav>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-neutral-200 bg-white">
                    <ul className="container mx-auto flex flex-col px-4 py-4">
                        {navItems.map((item) => (
                            <li key={item.href} className="border-b border-neutral-100 last:border-0">
                                <Link 
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'block py-3 text-sm font-light tracking-wide transition-colors',
                                        pathname === item.href 
                                            ? 'text-neutral-900 font-normal' 
                                            : 'text-neutral-600'
                                    )}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-4">
                            {session.status === 'authenticated' ? (
                                <button onClick={() => signOut()} className="text-sm font-light tracking-wide text-neutral-600">Logout</button>
                            ) : (
                                <Link href="/api/auth/signin" className="text-sm font-light tracking-wide text-neutral-600">Sign in</Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
