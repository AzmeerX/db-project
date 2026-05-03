import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
    const links = {
        shop: [
            { label: 'All Products', href: '/' },
            { label: 'Best Sellers', href: '/best-selling' },
            { label: 'Special Offers', href: '/offers' },
        ],
        support: [
            { label: 'Contact Us', href: '#' },
            { label: 'Shipping Info', href: '#' },
            { label: 'Returns', href: '#' },
        ],
        company: [
            { label: 'About Us', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
        ],
    };

    return (
        <footer className="bg-neutral-900 text-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {}
                    <div className="space-y-4">
                        <h3 className="text-xl font-light tracking-tight">
                            CHOCO<span className="font-semibold">DELIGHT</span>
                        </h3>
                        <p className="text-sm text-neutral-400 font-light leading-relaxed">
                            Premium chocolates delivered to your doorstep in 30 minutes. Experience luxury, one bite at a time.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="hover:text-neutral-300 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-neutral-300 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-neutral-300 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {}
                    <div className="space-y-4">
                        <h4 className="text-sm font-normal tracking-wider uppercase">Shop</h4>
                        <ul className="space-y-3">
                            {links.shop.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors font-light">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {}
                    <div className="space-y-4">
                        <h4 className="text-sm font-normal tracking-wider uppercase">Support</h4>
                        <ul className="space-y-3">
                            {links.support.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors font-light">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {}
                    <div className="space-y-4">
                        <h4 className="text-sm font-normal tracking-wider uppercase">Company</h4>
                        <ul className="space-y-3">
                            {links.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors font-light">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-neutral-500 font-light tracking-wide">
                        © 2025 ChocoDelight. All rights reserved.
                    </p>
                    <p className="text-xs text-neutral-500 font-light tracking-wide">
                        Crafted with passion for chocolate lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}


