'use client';

import React from 'react';
import Header from '../_components/header';
import Footer from '../_components/footer';
import NewsLetter from '../_components/newsletter';
import { useQuery } from '@tanstack/react-query';
import { getBestSellingProducts } from '@/http/api';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Trophy, Users, Heart, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const BestSellingPage = () => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['best-selling-products'],
        queryFn: getBestSellingProducts,
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                {/* Section 1: Hero */}
                <section className="relative h-[40vh] w-full overflow-hidden bg-brown-900 text-white">
                    <div className="absolute inset-0 bg-[url('/assets/hero-pattern.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-brown-900 to-transparent"></div>
                    <div className="container relative mx-auto flex h-full flex-col justify-center px-5">
                        <div className="flex items-center gap-2 text-yellow-400">
                            <Trophy className="h-6 w-6" />
                            <span className="font-bold uppercase tracking-widest">Customer Favorites</span>
                        </div>
                        <h1 className="mt-4 text-5xl font-bold md:text-7xl">Best Selling</h1>
                        <p className="mt-4 max-w-xl text-lg text-brown-100">
                            Discover the chocolates that everyone is talking about. Our most popular, 
                            highest-rated treats selected just for you.
                        </p>
                    </div>
                </section>

                {/* Section 2: Stats */}
                <section className="bg-white py-10 shadow-sm">
                    <div className="container mx-auto grid grid-cols-2 gap-8 px-5 md:grid-cols-4">
                        {[
                            { icon: Users, label: 'Happy Customers', value: '10k+' },
                            { icon: Star, label: '5-Star Reviews', value: '5000+' },
                            { icon: Heart, label: 'Repeat Buyers', value: '95%' },
                            { icon: CheckCircle, label: 'Quality Assured', value: '100%' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center text-center">
                                <stat.icon className="mb-2 h-8 w-8 text-brown-500" />
                                <span className="text-3xl font-bold text-brown-900">{stat.value}</span>
                                <span className="text-sm text-gray-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Product Grid */}
                <section className="container mx-auto px-5 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-brown-900 md:text-4xl">Top Rated Collections</h2>
                        <Separator className="mx-auto mt-4 h-1 w-20 bg-brown-500" />
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <Skeleton className="aspect-square w-full rounded-xl bg-gray-200" />
                                    <Skeleton className="h-6 w-3/4 bg-gray-200" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                                </div>
                            ))
                        ) : products && products.length > 0 ? (
                            products.map((product: Product & { totalSold: number }) => (
                                <div
                                    key={product.id}
                                    className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="absolute left-3 top-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-brown-900 shadow-sm">
                                        #{products.indexOf(product) + 1} Best Seller
                                    </div>
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={`/assets/${product.image}`}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="mb-2 flex items-center gap-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-current" />
                                            ))}
                                            <span className="ml-1 text-xs text-gray-400">({product.totalSold * 12} reviews)</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-brown-900">{product.name}</h3>
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xl font-bold text-brown-900">${product.price}</span>
                                            <Link href={`/product/${product.id}`}>
                                                <Button size="sm" className="bg-brown-900 hover:bg-brown-800">
                                                    Buy Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-lg text-gray-500">No best selling products found yet. Start ordering!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section 4: Testimonials */}
                <section className="bg-brown-50 py-20">
                    <div className="container mx-auto px-5">
                        <h2 className="mb-12 text-center text-3xl font-bold text-brown-900">Why People Love Us</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    name: 'Sarah Johnson',
                                    role: 'Choco Lover',
                                    text: "The best chocolate I've ever tasted! The delivery was super fast and the packaging was premium.",
                                },
                                {
                                    name: 'Michael Chen',
                                    role: 'Verified Buyer',
                                    text: "I order these for all my corporate gifts. They never disappoint. The 'Best Selling' list is spot on.",
                                },
                                {
                                    name: 'Emma Wilson',
                                    role: 'Food Blogger',
                                    text: "Absolutely divine. The texture, the flavor, everything is perfect. Highly recommended!",
                                },
                            ].map((testimonial, i) => (
                                <div key={i} className="rounded-2xl bg-white p-8 shadow-sm">
                                    <div className="mb-4 flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-brown-200"></div>
                                        <div>
                                            <h4 className="font-bold text-brown-900">{testimonial.name}</h4>
                                            <span className="text-xs text-gray-500">{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <NewsLetter />
            </main>
            <Footer />
        </>
    );
};

export default BestSellingPage;
