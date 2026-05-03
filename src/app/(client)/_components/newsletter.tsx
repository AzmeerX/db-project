import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function NewsLetter() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-neutral-900 p-8 md:p-12 lg:p-16">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase">Newsletter</p>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white">
                                    Get Exclusive Offers
                                </h2>
                                <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                                    Subscribe to receive special offers, new arrivals, and curated collections.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 bg-white border-0 rounded-none h-12 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0"
                                    />
                                    <Button className="bg-white hover:bg-neutral-100 text-neutral-900 rounded-none h-12 px-8 font-light tracking-wider">
                                        SUBSCRIBE
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-neutral-400 font-light">
                                    By subscribing, you agree to our Privacy Policy and consent to receive updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


