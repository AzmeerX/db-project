'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/http/api';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Products = () => {
    const skeletons = Array.from({ length: 8 });
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
        staleTime: 10 * 1000,
    });

    return (
        <section id="products" className="bg-neutral-50 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Premium Selection</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900">
                        Our Products
                    </h2>
                    <p className="text-base text-neutral-600 font-light max-w-2xl mx-auto">
                        Discover our handpicked collection of premium chocolates, each one carefully selected for quality and taste.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {isLoading ? (
                        <>
                            {skeletons.map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[3/4] w-full bg-neutral-200" />
                                    <Skeleton className="h-4 w-3/4 bg-neutral-200" />
                                    <Skeleton className="h-4 w-1/4 bg-neutral-200" />
                                    <Skeleton className="h-10 w-full bg-neutral-200" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {products?.map((product: Product) => {
                                return (
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
                                                    {product.isOffer && (
                                                        <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 py-1 text-xs tracking-wider">
                                                            SPECIAL
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            <div className="space-y-3">
                                                <div>
                                                    <Link href={`/product/${product.id}`}>
                                                        <h3 className="text-base font-light tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-neutral-500 font-light mt-1 line-clamp-2">
                                                        {product.description}
                                                    </p>
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
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Products;
