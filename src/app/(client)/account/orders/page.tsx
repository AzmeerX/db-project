'use client';
import Image from 'next/image';
import { getMyOrders } from '@/http/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Header from '../../_components/header';
import { CircleCheck, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MyOrder } from '@/types';
import { capitalizeFirstLetter } from '@/lib/utils';

const MyOrdersPage = () => {
    const {
        data: myOrders,
        isLoading,
        isError,
    } = useQuery<MyOrder[]>({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
    });

    console.log('data', myOrders);

    return (
        <div>
            <Header />
            <section className="relative bg-neutral-50 min-h-screen border-t border-neutral-200">
                <div className="mx-auto h-full max-w-5xl px-5 py-20">
                    <div className="mb-12 space-y-2">
                        <h1 className="text-3xl md:text-4xl font-light tracking-wider text-neutral-900">ORDER HISTORY</h1>
                        <p className="text-neutral-600 font-light">View your recent purchases and order status</p>
                    </div>
                    <div className="space-y-6">
                        {isLoading && (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
                            </div>
                        )}
                        {isError && (
                            <div className="py-20 text-center">
                                <span className="text-neutral-500 font-light">Unable to load orders</span>
                            </div>
                        )}
                        {myOrders?.slice(0, 7).map((item) => (
                            <div key={item.id} className="border border-neutral-200 bg-white">
                                <div className="flex flex-col sm:flex-row gap-6 p-6 border-b border-neutral-200">
                                    <div className="flex flex-col text-sm space-y-1">
                                        <span className="font-normal tracking-wide text-neutral-900">DATE PLACED</span>
                                        <span className="font-light text-neutral-600">{formatDate(item.createdAt)}</span>
                                    </div>
                                    <div className="flex flex-col text-sm space-y-1">
                                        <span className="font-normal tracking-wide text-neutral-900">TOTAL AMOUNT</span>
                                        <span className="font-light text-neutral-600">${item.price}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 p-6">
                                    <Image
                                        src={`/assets/${item.image}`}
                                        alt="img"
                                        width={120}
                                        height={120}
                                        className="aspect-square object-cover bg-neutral-100"
                                    />
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <h3 className="text-xl font-light tracking-wide text-neutral-900">
                                                {item.product}
                                            </h3>
                                            <span className="text-xl font-normal text-neutral-900">
                                                ${item.price}
                                            </span>
                                        </div>
                                        <p className="text-neutral-600 font-light text-sm leading-relaxed">{item.productDescription}</p>
                                        <div className="flex justify-end pt-2">
                                            <div className="flex items-center gap-2">
                                                <CircleCheck
                                                    className="h-4 w-4 text-neutral-900"
                                                />
                                                <span className="text-sm font-light tracking-wide text-neutral-900">
                                                    {capitalizeFirstLetter(item.status).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MyOrdersPage;

function formatDate(isoString: string): string {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}


