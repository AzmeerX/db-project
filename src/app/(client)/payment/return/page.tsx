import { CircleX } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '../../_components/header';

export default function ReturnPage() {
    return (
        <>
            <Header />
            <section className="custom-height relative bg-neutral-50">
                <div className="z-50 mx-auto flex h-full max-w-6xl items-center justify-center px-5 py-20">
                    <div className="flex flex-col items-center justify-center gap-6 border border-neutral-200 bg-white p-12 md:w-2/5 md:p-16">
                        <div className="border border-neutral-900 p-6">
                            <CircleX className="h-16 w-16 text-neutral-900" />
                        </div>
                        <h3 className="text-3xl font-light tracking-wider text-neutral-900">PAYMENT DECLINED</h3>
                        <span className="text-center text-neutral-600 font-light leading-relaxed">
                            Your payment could not be processed at this time. Please try again.
                        </span>
                        <span className="text-sm text-neutral-500 font-light tracking-wide">Contact support if the issue persists.</span>
                        <Link href="/" className="w-full mt-4">
                            <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-none h-11 font-light tracking-wider">
                                RETURN HOME
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}


