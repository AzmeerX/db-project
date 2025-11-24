import { CircleCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '../../_components/header';

export default function SuccessPage() {
    return (
        <>
            <Header />
            <section className="custom-height relative bg-[#f5f5f5]">
                <div className="z-50 mx-auto flex h-full max-w-6xl items-center justify-center gap-x-10 px-5 py-14 md:py-20">
                    <Card className="flex flex-col items-center justify-center gap-y-3 rounded-2xl border-none p-10 shadow-2xl md:w-2/5 bg-white">
                        <div className="rounded-full bg-green-100 p-4">
                            <CircleCheck className="size-20 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-brown-900">Order Placed!</h3>
                        <span className="text-center text-gray-600">
                            Your order has been placed successfully via Cash on Delivery.
                        </span>
                        <span className="text-sm text-gray-500">We will deliver your chocolates soon!</span>
                        <Link href="/">
                            <Button className="mt-6 w-full bg-brown-900 hover:bg-brown-800">Continue Shopping</Button>
                        </Link>
                    </Card>
                </div>
            </section>
        </>
    );
}
