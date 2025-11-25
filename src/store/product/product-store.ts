import { Product } from '@/types';
import { create } from 'zustand';

type NewProductState = {
    isOpen: boolean;
    editId: number | null;
    editData: Product | null;
    onOpen: () => void;
    onClose: () => void;
    setEditProduct: (id: number, data: Product) => void;
    clearEdit: () => void;
};

export const useNewProduct = create<NewProductState>((set) => {
    return {
        isOpen: false,
        editId: null,
        editData: null,
        onOpen: () => set({ isOpen: true, editId: null, editData: null }),
        onClose: () => set({ isOpen: false, editId: null, editData: null }),
        setEditProduct: (id: number, data: Product) => set({ isOpen: true, editId: id, editData: data }),
        clearEdit: () => set({ editId: null, editData: null }),
    };
});
