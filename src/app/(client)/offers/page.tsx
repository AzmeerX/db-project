'use client';

import React from 'react';
import Header from '../_components/header';
import Footer from '../_components/footer';
import NewsLetter from '../_components/newsletter';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/http/api';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Timer, Tag, Gift, Percent, ArrowRight, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OffersPage = () => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    });

    // Filter products that are marked as offers
    const offerProducts = products?.filter((p: Product) => p.isOffer) || [];
    // Fallback to some products if no offers are explicitly set (for demo purposes)
    const displayProducts = offerProducts.length > 0 ? offerProducts : products?.slice(0, 8) || [];
    const flashSaleProduct = displayProducts?.[0];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                {/* Section 1: Hero */}
                <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-gradient-to-br from-red-600 to-red-800 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-20"></div>
                    <div className="container relative mx-auto grid grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2">
                        <div className="space-y-6">
                            <Badge className="bg-yellow-400 text-brown-900 hover:bg-yellow-500">Limited Time Offer</Badge>
                            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                                Super Sale <br />
                                <span className="text-yellow-400">Up to 50% OFF</span>
                            </h1>
                            <p className="text-lg text-red-100">
                                Grab your favorite chocolates at unbeatable prices. Don&apos;t miss out on our exclusive daily deals and bundles.
                            </p>
                            <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                                Shop All Deals
                            </Button>
                        </div>
                        <div className="hidden md:block">
                            {/* Abstract shapes or hero image placeholder */}
                            <div className="relative h-96 w-96 rounded-full bg-white/10 backdrop-blur-sm">
                                <div className="absolute -left-10 top-10 h-24 w-24 animate-bounce rounded-full bg-yellow-400 text-brown-900 flex items-center justify-center font-bold shadow-lg">
                                    50% OFF
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Flash Sale */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-5">
                        <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-brown-900 p-8 text-white md:flex-row">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-red-600 p-3">
                                    <Timer className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Flash Deal of the Day</h2>
                                    <p className="text-brown-200">Ends in 05:23:12</p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-center">
                                {['05', '23', '12'].map((time, i) => (
                                    <div key={i} className="rounded-md bg-white/10 px-4 py-2 backdrop-blur-sm">
                                        <span className="block text-2xl font-bold">{time}</span>
                                        <span className="text-xs text-brown-300">{['Hrs', 'Mins', 'Secs'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <Skeleton className="h-64 w-full rounded-xl" />
                        ) : flashSaleProduct ? (
                            <div className="grid grid-cols-1 gap-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg md:grid-cols-2">
                                <div className="relative h-64 bg-gray-100 md:h-auto">
                                    <Image
                                        src={`/assets/${flashSaleProduct.image}`}
                                        alt={flashSaleProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-1 font-bold text-white">
                                        -40%
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    <h3 className="text-3xl font-bold text-brown-900">{flashSaleProduct.name}</h3>
                                    <div className="mt-4 flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-red-600">${(flashSaleProduct.price * 0.6).toFixed(2)}</span>
                                        <span className="text-xl text-gray-400 line-through">${flashSaleProduct.price}</span>
                                    </div>
                                    <p className="mt-4 text-gray-600">{flashSaleProduct.description}</p>
                                    <div className="mt-8 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">85% Sold - Hurry up!</p>
                                    <Link href={`/product/${flashSaleProduct.id}`} className="mt-8">
                                        <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                                            Grab Deal <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Section 3: All Offers Grid */}
                <section className="container mx-auto px-5 py-20">
                    <div className="mb-12 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-brown-900">Exclusive Offers</h2>
                        <Button variant="outline">View All</Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
                            ))
                        ) : (
                            displayProducts.map((product: Product) => (
                                <div key={product.id} className="group relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg">
                                    <div className="absolute right-4 top-4 z-10 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                        20% OFF
                                    </div>
                                    <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-50">
                                        <Image
                                            src={`/assets/${product.image}`}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-bold text-brown-900">{product.name}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                                            <span className="font-bold text-red-600">${product.price}</span>
                                        </div>
                                        <Link href={`/product/${product.id}`}>
                                            <Button size="icon" variant="secondary" className="rounded-full">
                                                <ShoppingBag className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Section 4: Bundle Deals */}
                <section className="bg-brown-50 py-20">
                    <div className="container mx-auto px-5">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-r from-purple-600 to-purple-800 p-10 text-white shadow-xl">
                                <Gift className="mb-4 h-12 w-12 text-purple-200" />
                                <h3 className="text-3xl font-bold">Gift Bundles</h3>
                                <p className="mt-2 text-purple-100">Perfect for birthdays and anniversaries. Get 3 premium bars + Gift Box.</p>
                                <div className="mt-8">
                                    <span className="text-4xl font-bold">$29.99</span>
                                    <span className="ml-2 text-lg text-purple-300 line-through">$45.00</span>
                                </div>
                                <Button className="mt-6 w-fit bg-white text-purple-700 hover:bg-gray-100">View Bundle</Button>
                            </div>
                            <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-10 text-white shadow-xl">
                                <Percent className="mb-4 h-12 w-12 text-orange-200" />
                                <h3 className="text-3xl font-bold">Bulk Savings</h3>
                                <p className="mt-2 text-orange-100">Buy 5 Get 2 Free on all dark chocolate varieties.</p>
                                <div className="mt-8">
                                    <span className="text-4xl font-bold">Save 40%</span>
                                </div>
                                <Button className="mt-6 w-fit bg-white text-orange-600 hover:bg-gray-100">Shop Bulk</Button>
                            </div>
                        </div>
                    </div>
                </section>

                <NewsLetter />
            </main>
            <Footer />
        </>
    );
};

export default OffersPage;
