import { Award, Leaf, ThumbsUp } from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: Award,
            title: 'Premium Quality',
            description: 'Sourced from the finest cocoa beans across the globe'
        },
        {
            icon: Leaf,
            title: 'Sustainable',
            description: 'Ethically sourced and environmentally conscious production'
        },
        {
            icon: ThumbsUp,
            title: 'Satisfaction',
            description: '100% satisfaction guarantee on every order'
        }
    ];

    return (
        <section id="about" className="bg-neutral-50 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Our Story</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900">
                                Crafted with Passion,
                                <span className="block font-normal mt-2">Delivered with Care</span>
                            </h2>
                        </div>
                        <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed">
                            For over a decade, we've been dedicated to bringing you the world's finest chocolates. 
                            Each piece is carefully selected and delivered fresh, ensuring you experience chocolate 
                            the way it was meant to be enjoyed.
                        </p>
                        <p className="text-base text-neutral-600 font-light leading-relaxed">
                            Our commitment to quality, sustainability, and customer satisfaction sets us apart. 
                            We believe that great chocolate should be accessible to everyone, which is why we offer 
                            express delivery to bring luxury right to your doorstep.
                        </p>
                    </div>

                    {}
                    <div className="space-y-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="flex gap-6 p-6 bg-white border border-neutral-200 hover:border-neutral-900 transition-colors">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-normal tracking-wide text-neutral-900">{value.title}</h3>
                                        <p className="text-sm text-neutral-600 font-light leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


