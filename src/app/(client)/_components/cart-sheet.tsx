'use client';

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart/cart-store';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CartSheet = () => {
    const { items, removeFromCart, updateQty, getCartTotal, getItemCount } = useCartStore();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const itemCount = getItemCount();
    const total = getCartTotal();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-brown-300 hover:text-brown-900">
                    <ShoppingBag className="h-6 w-6" />
                    {isMounted && itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-6 text-left">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-brown-900">
                        <ShoppingBag className="h-6 w-6" />
                        Your Cart ({itemCount})
                    </SheetTitle>
                </SheetHeader>
                
                {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
                        <div className="relative h-40 w-40 opacity-20">
                            <Image
                                src="/assets/empty-cart.png" // You might not have this, so I'll use a fallback or just icon
                                alt="Empty Cart"
                                fill
                                className="object-contain"
                                onError={(e) => {
                                    // Fallback if image missing
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <ShoppingBag className="h-full w-full text-brown-900" />
                        </div>
                        <h3 className="text-xl font-bold text-brown-900">Your cart is empty</h3>
                        <p className="text-brown-500">Looks like you haven&apos;t added any chocolates yet.</p>
                        <SheetTrigger asChild>
                            <Button className="mt-4 bg-brown-900 text-white hover:bg-brown-800">
                                Start Shopping
                            </Button>
                        </SheetTrigger>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                            <Image
                                                src={`/assets/${item.image}`}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-brown-900 line-clamp-1">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-1">
                                                    <button
                                                        onClick={() => updateQty(item.id, 'decrement')}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                                                        disabled={item.qty <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, 'increment')}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-brown-900">
                                                    ${(item.price * item.qty).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="mb-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold text-brown-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <SheetTrigger asChild>
                                <Link href="/checkout">
                                    <Button className="w-full h-12 bg-brown-900 text-lg hover:bg-brown-800" disabled>
                                        Checkout (Coming Soon) <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </SheetTrigger>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSheet;
