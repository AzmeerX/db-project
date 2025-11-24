'use client';
import { getSingleProduct, placeOrder } from '@/http/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import Header from '../../_components/header';
import { Loader2, Star, Minus, Plus, Truck, ShieldCheck, Leaf, Clock } from 'lucide-react';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { orderSchema } from '@/lib/validators/orderSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart/cart-store';
import { ShoppingCart } from 'lucide-react';

type CustomError = {
    message: string;
};

const SingleProduct = () => {
    const { toast } = useToast();
    const addToCart = useCartStore((state) => state.addToCart);
    const params = useParams();
    const pathname = usePathname();
    const id = params.id;

    const { data: session } = useSession();

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            address: '',
            pincode: '',
            qty: 1,
            productId: Number(id),
        },
    });

    const { data: product, isLoading } = useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => getSingleProduct(id as string),
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ['order'],
        mutationFn: (data: FormValues) => placeOrder({ ...data, productId: Number(id) }),
        onSuccess: (data) => {
            window.location.href = data.paymentUrl;
        },
        onError: (err: AxiosError) => {
            if (err.response?.data) {
                const customErr = err.response.data as CustomError;
                console.error(customErr.message);
                toast({
                    title: customErr.message,
                    color: 'red',
                });
            } else {
                console.error(err);
                toast({ title: 'Unknown error' });
            }
        },
    });

    type FormValues = z.infer<typeof orderSchema>;
    const onSubmit = (values: FormValues) => {
        mutate(values);
    };

    const qty = form.watch('qty');

    const price = React.useMemo(() => {
        if (product?.price) {
            return product.price * qty;
        }
        return 0;
    }, [qty, product]);

    const handleQtyChange = (action: 'increment' | 'decrement') => {
        const currentQty = form.getValues('qty');
        if (action === 'increment') {
            form.setValue('qty', currentQty + 1);
        } else if (action === 'decrement' && currentQty > 1) {
            form.setValue('qty', currentQty - 1);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, qty);
            toast({
                title: 'Added to Cart',
                description: `${product.name} (x${qty}) has been added to your cart.`,
            });
        }
    };

    return (
        <>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-brown-50 to-white py-12">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                            <Skeleton className="aspect-[4/5] w-full rounded-3xl bg-brown-100/50" />
                            <div className="flex flex-col gap-8 py-8">
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-32 bg-brown-100/50" />
                                    <Skeleton className="h-16 w-3/4 bg-brown-100/50" />
                                </div>
                                <Skeleton className="h-32 w-full bg-brown-100/50" />
                                <Skeleton className="h-64 w-full rounded-2xl bg-brown-100/50" />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                            {/* Left Column: Image & Features */}
                            <div className="flex flex-col gap-8">
                                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(83,37,0,0.15)]">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-brown-900/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <Image
                                        src={`/assets/${product?.image}` ?? '/product1.jpg'}
                                        alt={product?.name ?? 'Product Image'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="rounded-xl bg-white/90 p-4 backdrop-blur-md shadow-lg border border-white/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                                    <span className="text-sm font-medium text-brown-900">Quality Assured</span>
                                                </div>
                                                <div className="h-4 w-px bg-brown-200" />
                                                <div className="flex items-center gap-2">
                                                    <Leaf className="h-5 w-5 text-green-600" />
                                                    <span className="text-sm font-medium text-brown-900">100% Natural</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Feature Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: Clock, label: 'Fast Delivery', desc: 'Within 30 mins' },
                                        { icon: ShieldCheck, label: 'Secure Payment', desc: '100% Protected' },
                                        { icon: Star, label: 'Top Rated', desc: '4.9/5 Stars' },
                                    ].map((feature, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm border border-brown-100 transition-colors hover:border-brown-200 hover:bg-brown-50/50">
                                            <feature.icon className="mb-2 h-6 w-6 text-brown-600" />
                                            <span className="text-sm font-semibold text-brown-900">{feature.label}</span>
                                            <span className="text-xs text-brown-500">{feature.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Details & Form */}
                            <div className="flex flex-col py-4">
                                <div className="mb-8">
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-brown-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brown-800">
                                            Premium Collection
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-bold text-brown-900">4.9</span>
                                            <span className="text-sm text-brown-400">(144)</span>
                                        </div>
                                    </div>
                                    
                                    <h1 className="mb-4 text-4xl font-bold leading-tight text-brown-900 md:text-5xl lg:text-6xl font-serif">
                                        {product?.name}
                                    </h1>
                                    
                                    <div className="mb-6 flex items-baseline gap-4">
                                        <span className="text-4xl font-bold text-brown-600">${product?.price}</span>
                                        <span className="text-lg text-brown-300 line-through">${(product?.price || 0) * 1.2}</span>
                                        <span className="text-sm font-bold text-green-600">20% OFF</span>
                                    </div>

                                    <p className="text-lg leading-relaxed text-brown-600/90">
                                        {product?.description}
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-brown-100 bg-white p-6 shadow-xl shadow-brown-900/5 md:p-8">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                            
                                            {/* Quantity Selector */}
                                            <div className="space-y-3">
                                                <span className="text-sm font-semibold uppercase tracking-wide text-brown-400">Quantity</span>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center rounded-full border border-brown-200 bg-brown-50 p-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleQtyChange('decrement')}
                                                            className="h-10 w-10 rounded-full hover:bg-white hover:text-brown-700 hover:shadow-sm"
                                                            disabled={qty <= 1}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <div className="flex h-10 w-16 items-center justify-center text-lg font-bold text-brown-900">
                                                            {qty}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleQtyChange('increment')}
                                                            className="h-10 w-10 rounded-full hover:bg-white hover:text-brown-700 hover:shadow-sm"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-brown-400">Total Price</span>
                                                        <span className="text-2xl font-bold text-brown-900">${price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="bg-brown-100" />

                                            {/* Delivery Details */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-brown-900">
                                                    <Truck className="h-5 w-5" />
                                                    <h3 className="font-semibold">Delivery Details</h3>
                                                </div>
                                                <div className="grid gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-brown-600">Street Address</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        className="min-h-[80px] resize-none rounded-xl border-brown-200 bg-brown-50/30 focus:border-brown-400 focus:bg-white focus:ring-brown-400/20"
                                                                        placeholder="Enter your full delivery address..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="pincode"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-brown-600">Pincode</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-12 rounded-xl border-brown-200 bg-brown-50/30 focus:border-brown-400 focus:bg-white focus:ring-brown-400/20"
                                                                        placeholder="e.g. 560001"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-2 space-y-3">
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddToCart}
                                                        className="h-14 w-full rounded-xl border-2 border-brown-900 bg-transparent text-lg font-bold text-brown-900 hover:bg-brown-50"
                                                    >
                                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                                        Add to Cart
                                                    </Button>
                                                    
                                                    {session ? (
                                                        <Button 
                                                            type="submit" 
                                                            disabled={isPending} 
                                                            className="group relative h-14 w-full overflow-hidden rounded-xl bg-brown-900 text-lg font-semibold text-white shadow-lg shadow-brown-900/20 transition-all hover:bg-brown-800 hover:shadow-xl hover:shadow-brown-900/30"
                                                        >
                                                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                                            <span className="relative flex items-center justify-center gap-2">
                                                                {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                                                                Buy Now
                                                            </span>
                                                        </Button>
                                                    ) : (
                                                        <Link href={`/api/auth/signin?callbackUrl=${pathname}`} className="block w-full">
                                                            <Button className="group relative h-14 w-full overflow-hidden rounded-xl bg-brown-900 text-lg font-semibold text-white shadow-lg shadow-brown-900/20 transition-all hover:bg-brown-800 hover:shadow-xl hover:shadow-brown-900/30">
                                                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                                                <span className="relative">Login to Buy</span>
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                                <p className="text-center text-xs text-brown-400">
                                                    Free delivery on orders above $50 • Secure payment
                                                </p>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SingleProduct;
