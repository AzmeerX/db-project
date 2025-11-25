import { DeliveryPerson } from '@/types';
import { create } from 'zustand';

type NewDeliveryPersonState = {
    isOpen: boolean;
    editId: number | null;
    editData: DeliveryPerson | null;
    onOpen: () => void;
    onClose: () => void;
    setEditDeliveryPerson: (id: number, data: DeliveryPerson) => void;
    clearEdit: () => void;
};

export const useNewDeliveryPerson = create<NewDeliveryPersonState>((set) => {
    return {
        isOpen: false,
        editId: null,
        editData: null,
        onOpen: () => set({ isOpen: true, editId: null, editData: null }),
        onClose: () => set({ isOpen: false, editId: null, editData: null }),
        setEditDeliveryPerson: (id: number, data: DeliveryPerson) => set({ isOpen: true, editId: id, editData: data }),
        clearEdit: () => set({ editId: null, editData: null }),
    };
});
