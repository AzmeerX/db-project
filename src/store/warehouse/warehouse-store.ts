import { Warehouse } from '@/types';
import { create } from 'zustand';

type NewWarehouseState = {
    isOpen: boolean;
    editId: number | null;
    editData: Warehouse | null;
    onOpen: () => void;
    onClose: () => void;
    setEditWarehouse: (id: number, data: Warehouse) => void;
    clearEdit: () => void;
};

export const useNewWarehouse = create<NewWarehouseState>((set) => {
    return {
        isOpen: false,
        editId: null,
        editData: null,
        onOpen: () => set({ isOpen: true, editId: null, editData: null }),
        onClose: () => set({ isOpen: false, editId: null, editData: null }),
        setEditWarehouse: (id: number, data: Warehouse) => set({ isOpen: true, editId: id, editData: data }),
        clearEdit: () => set({ editId: null, editData: null }),
    };
});


