import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function SpecialProducts() {
    const products = [
        { src: '/product1.jpg', alt: 'product1', name: 'Cadbury Dairy Milk', price: '$12.99' },
        { src: '/product2.jpg', alt: 'product2', name: 'Mars Bars', price: '$8.99' },
        { src: '/product3.jpg', alt: 'product3', name: 'Lindt Excellence', price: '$15.99' },
        { src: '/product2.jpg', alt: 'product4', name: 'Belgian Dark', price: '$18.99' },
    ];

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Curated Selection</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900">
                        Featured Collections
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <Link href="#products" key={index} className="group">
                            <div className="space-y-4">
                                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                    <Image
                                        src={product.src}
                                        alt={product.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-sm font-light tracking-wide text-neutral-900">{product.name}</h3>
                                    <div className="flex items-center justify-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-neutral-900 text-neutral-900" />
                                        ))}
                                    </div>
                                    <p className="text-sm font-normal text-neutral-900">{product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
