'use client';

import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartSheet from './cart-sheet';

export default function Header() {
    const pathname = usePathname();
    const session = useSession();
    console.log('session', session);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Best Selling', href: '/best-selling' },
        { label: 'Offers', href: '/offers' },
        { label: 'Orders', href: '/account/orders' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-10 items-center justify-center bg-brown-900 text-center text-white">
                <span className="text-sm font-medium tracking-wide">
                    Order 2 Delight Dairy Choco bars today and save ₹100 instantly!
                </span>
            </div>
            <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="text-2xl font-bold text-brown-900 font-serif">
                    Choco<span className="text-yellow-500">Delight</span>
                </Link>
                
                <ul className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <li
                            key={item.href}
                            className={cn(
                                'text-sm font-medium text-brown-600 transition-colors hover:text-brown-900',
                                pathname === item.href && 'text-brown-900 font-bold'
                            )}>
                            <Link href={item.href}>{item.label}</Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <CartSheet />
                    <div className="text-sm font-medium text-brown-600 transition-colors hover:text-brown-900">
                        {session.status === 'authenticated' ? (
                            <button onClick={() => signOut()}>Logout</button>
                        ) : (
                            <Link href="/api/auth/signin">Sign in</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
