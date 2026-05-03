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
import { Timer, ArrowRight, ShoppingBag, Gift, Percent, Tag, Star } from 'lucide-react';

const OffersPage = () => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    });

    const offerProducts = products?.filter((p: Product) => p.isOffer) || [];

    const displayProducts = offerProducts.length > 0 ? offerProducts : products?.slice(0, 8) || [];
    const flashSaleProduct = displayProducts?.[0];
    console.log(flashSaleProduct);
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                {}
                <section className="bg-neutral-50 py-20 md:py-32">
                    <div className="container mx-auto px-5">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm tracking-wider">
                                <Tag className="h-4 w-4" />
                                EXCLUSIVE OFFERS
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-neutral-900">
                                SPECIAL DEALS
                            </h1>
                            <p className="text-base md:text-lg text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
                                Discover curated selections at exceptional prices. Limited availability on premium selections.
                            </p>
                        </div>
                    </div>
                </section>

                {}
                <section className="bg-white py-16 border-y border-neutral-200">
                    <div className="container mx-auto px-5">
                        <div className="mb-12 flex flex-col items-center justify-between gap-6 bg-neutral-900 p-8 md:p-10 text-white md:flex-row">
                            <div className="flex items-center gap-4">
                                <div className="p-3 border border-white/20">
                                    <Timer className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-light tracking-wider">DEAL OF THE DAY</h2>
                                    <p className="text-neutral-400 font-light text-sm tracking-wide">Ends in 05:23:12</p>
                                </div>
                            </div>
                            <div className="flex gap-3 text-center">
                                {['05', '23', '12'].map((time, i) => (
                                    <div key={i} className="border border-white/20 px-4 py-3">
                                        <span className="block text-2xl font-normal">{time}</span>
                                        <span className="text-xs text-neutral-400 tracking-wider">{['HRS', 'MINS', 'SECS'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <Skeleton className="h-96 w-full bg-neutral-200" />
                        ) : flashSaleProduct ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 overflow-hidden">
                                <div className="relative h-96 md:h-auto bg-neutral-100">
                                    <Image
                                        src={`/assets/${flashSaleProduct.image}`}
                                        alt={flashSaleProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute left-6 top-6 bg-neutral-900 text-white px-4 py-2 text-xs tracking-wider">
                                        40% OFF
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center p-8 md:p-16 space-y-6">
                                    <h3 className="text-3xl md:text-4xl font-light tracking-wide text-neutral-900">{flashSaleProduct.name}</h3>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-4xl font-normal text-neutral-900">${(flashSaleProduct.price * 0.6).toFixed(2)}</span>
                                        <span className="text-xl text-neutral-400 line-through font-light">${flashSaleProduct.price}</span>
                                    </div>
                                    <p className="text-neutral-600 font-light leading-relaxed">{flashSaleProduct.description}</p>
                                    <div className="space-y-2">
                                        <div className="w-full bg-neutral-200 h-1">
                                            <div className="bg-neutral-900 h-1" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-sm text-neutral-500 font-light tracking-wide">85% CLAIMED</p>
                                    </div>
                                    <Link href={`/product/${flashSaleProduct.id}`}>
                                        <Button size="lg" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-none h-12 font-light tracking-wider group">
                                            CLAIM OFFER
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>

                {}
                <section className="container mx-auto px-5 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-light tracking-wider text-neutral-900">ALL OFFERS</h2>
                        <p className="mt-3 text-neutral-600 font-light">Limited time pricing on select items</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[3/4] w-full bg-neutral-200" />
                                    <Skeleton className="h-4 w-3/4 bg-neutral-200" />
                                    <Skeleton className="h-4 w-1/4 bg-neutral-200" />
                                </div>
                            ))
                        ) : (
                            displayProducts.map((product: Product) => (
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
                                                <div className="absolute top-4 right-4 bg-neutral-900 text-white px-3 py-1 text-xs tracking-wider">
                                                    20% OFF
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="space-y-3">
                                            <Link href={`/product/${product.id}`}>
                                                <h3 className="text-base font-light tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-neutral-400 line-through font-light">${(product.price * 1.2).toFixed(2)}</span>
                                                    <span className="text-lg font-normal text-neutral-900">${product.price}</span>
                                                </div>
                                                <Link href={`/product/${product.id}`}>
                                                    <Button size="icon" className="bg-neutral-900 hover:bg-neutral-800 rounded-none h-10 w-10">
                                                        <ShoppingBag className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {}
                <section className="bg-neutral-50 py-20 border-t border-neutral-200">
                    <div className="container mx-auto px-5">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex flex-col justify-center bg-neutral-900 p-10 md:p-12 text-white">
                                <Gift className="mb-6 h-10 w-10 text-neutral-400" />
                                <h3 className="text-3xl font-light tracking-wider">GIFT BUNDLES</h3>
                                <p className="mt-4 text-neutral-300 font-light leading-relaxed">Curated selections for special occasions. Three premium bars with presentation box.</p>
                                <div className="mt-8 flex items-baseline gap-3">
                                    <span className="text-4xl font-normal">$29.99</span>
                                    <span className="text-lg text-neutral-500 line-through font-light">$45.00</span>
                                </div>
                                <Button className="mt-8 w-fit bg-white text-neutral-900 hover:bg-neutral-100 rounded-none h-11 px-8 font-light tracking-wider">
                                    VIEW BUNDLES
                                </Button>
                            </div>
                            <div className="flex flex-col justify-center border border-neutral-300 p-10 md:p-12 bg-white">
                                <Percent className="mb-6 h-10 w-10 text-neutral-600" />
                                <h3 className="text-3xl font-light tracking-wider text-neutral-900">BULK PRICING</h3>
                                <p className="mt-4 text-neutral-600 font-light leading-relaxed">Purchase five units and receive two complimentary. Available on dark chocolate varieties.</p>
                                <div className="mt-8">
                                    <span className="text-4xl font-normal text-neutral-900">Save 40%</span>
                                </div>
                                <Button className="mt-8 w-fit bg-neutral-900 text-white hover:bg-neutral-800 rounded-none h-11 px-8 font-light tracking-wider">
                                    SHOP BULK
                                </Button>
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


