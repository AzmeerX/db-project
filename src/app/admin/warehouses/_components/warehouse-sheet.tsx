import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWarehouse, updateWarehouse } from '@/http/api';
import { useToast } from '@/components/ui/use-toast';
import { Warehouse } from '@/types';
import { useNewWarehouse } from '@/store/warehouse/warehouse-store';
import CreateWarehouseForm, { FormValues } from './create-warehouse-form';

const WarehouseSheet = () => {
    const { toast } = useToast();

    const { isOpen, onClose, editId, editData } = useNewWarehouse();
    const queryClient = useQueryClient();
    const isEdit = !!editId;

    const createMutation = useMutation({
        mutationKey: ['create-warehouse'],
        mutationFn: (data: Warehouse) => createWarehouse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
            toast({
                title: 'Warehouse created successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to create warehouse',
                variant: 'destructive',
            });
        },
    });

    const updateMutation = useMutation({
        mutationKey: ['update-warehouse'],
        mutationFn: ({ id, data }: { id: number; data: Warehouse }) => updateWarehouse(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
            toast({
                title: 'Warehouse updated successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to update warehouse',
                variant: 'destructive',
            });
        },
    });

    const onSubmit = (values: FormValues) => {
        if (isEdit && editId) {
            updateMutation.mutate({ id: editId, data: values as Warehouse });
        } else {
            createMutation.mutate(values as Warehouse);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Warehouse' : 'Create Warehouse'}</SheetTitle>
                    <SheetDescription>
                        {isEdit ? 'Update the warehouse details' : 'Create a new warehouse'}
                    </SheetDescription>
                </SheetHeader>
                <CreateWarehouseForm 
                    onSubmit={onSubmit} 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    defaultValues={editData}
                    isEdit={isEdit}
                />
            </SheetContent>
        </Sheet>
    );
};

export default WarehouseSheet;
