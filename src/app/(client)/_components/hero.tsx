import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-104px)] bg-neutral-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-104px)] py-12 lg:py-0">
                    {/* Left Content */}
                    <div className="space-y-8 lg:pr-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs tracking-wider rounded-full">
                            <Zap className="h-3 w-3" />
                            EXPRESS DELIVERY
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-neutral-900">
                            Premium Chocolate
                            <span className="block font-normal mt-2">Delivered in 30 Minutes</span>
                        </h1>
                        
                        <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed max-w-xl">
                            Experience the finest selection of artisan chocolates, delivered fresh to your doorstep. 
                            Indulge in luxury, one bite at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="#products">
                                <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 text-base font-light tracking-wider rounded-none">
                                    SHOP NOW
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#about">
                                <Button variant="outline" className="w-full sm:w-auto border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-8 py-6 text-base font-light tracking-wider rounded-none">
                                    LEARN MORE
                                </Button>
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
                            <div className="space-y-2">
                                <Clock className="h-5 w-5 text-neutral-900" />
                                <p className="text-xs font-light text-neutral-600 tracking-wide">30 MIN<br />DELIVERY</p>
                            </div>
                            <div className="space-y-2">
                                <Shield className="h-5 w-5 text-neutral-900" />
                                <p className="text-xs font-light text-neutral-600 tracking-wide">100%<br />AUTHENTIC</p>
                            </div>
                            <div className="space-y-2">
                                <Zap className="h-5 w-5 text-neutral-900" />
                                <p className="text-xs font-light text-neutral-600 tracking-wide">PREMIUM<br />QUALITY</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-[400px] lg:h-[600px] xl:h-[700px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-none" />
                        <Image
                            src="/chocolate.jpg"
                            alt="Premium Chocolate"
                            fill
                            className="object-cover rounded-none"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
