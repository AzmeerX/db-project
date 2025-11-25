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
import { Star, Award, ArrowRight, ShoppingBag } from 'lucide-react';

const BestSellingPage = () => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['best-selling-products'],
        queryFn: getBestSellingProducts,
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-neutral-50 py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="text-center space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs tracking-wider rounded-full">
                                <Award className="h-3 w-3" />
                                BEST SELLERS
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900">
                                Customer Favorites
                            </h1>
                            <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed">
                                Discover our most loved chocolates, carefully selected based on customer reviews and popularity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[3/4] w-full bg-neutral-200" />
                                    <Skeleton className="h-4 w-3/4 bg-neutral-200" />
                                    <Skeleton className="h-4 w-1/4 bg-neutral-200" />
                                    <Skeleton className="h-10 w-full bg-neutral-200" />
                                </div>
                            ))
                        ) : products && products.length > 0 ? (
                            products.map((product: Product & { totalSold: number }, index: number) => (
                                <div key={product.id} className="group">
                                    <div className="space-y-4">
                                        <Link href={`/product/${product.id}`}>
                                            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                                                <Image
                                                    src={`/assets/${product.image}`}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 py-1 text-xs tracking-wider">
                                                    #{index + 1} BESTSELLER
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="space-y-3">
                                            <div>
                                                <Link href={`/product/${product.id}`}>
                                                    <h3 className="text-base font-light tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-1 mt-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-3 w-3 fill-neutral-900 text-neutral-900" />
                                                    ))}
                                                    <span className="text-xs text-neutral-400 ml-1">({product.totalSold * 12})</span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-normal text-neutral-900">${product.price}</p>
                                            <Link href={`/product/${product.id}`} className="block">
                                                <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-none h-11 font-light tracking-wider group">
                                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                                    ADD TO CART
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-base text-neutral-500 font-light">No best selling products found yet.</p>
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
