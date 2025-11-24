import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
    qty: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: Product, qty: number) => void;
    removeFromCart: (productId: number) => void;
    updateQty: (productId: number, action: 'increment' | 'decrement') => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product, qty) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.id === product.id
                            ? { ...item, qty: item.qty + qty }
                            : item
                    );
                    set({ items: updatedItems });
                } else {
                    set({ items: [...items, { ...product, qty }] });
                }
            },
            removeFromCart: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQty: (productId, action) => {
                const items = get().items;
                const updatedItems = items.map((item) => {
                    if (item.id === productId) {
                        const newQty = action === 'increment' ? item.qty + 1 : item.qty - 1;
                        return { ...item, qty: Math.max(1, newQty) };
                    }
                    return item;
                });
                set({ items: updatedItems });
            },
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.qty, 0);
            },
            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.qty, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
