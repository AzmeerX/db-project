import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeliveryPerson, updateDeliveryPerson } from '@/http/api';
import { useToast } from '@/components/ui/use-toast';
import { DeliveryPerson } from '@/types';
import { useNewDeliveryPerson } from '@/store/deliveryPerson/delivery-person-store';
import CreateDeliveryPersonForm, { FormValues } from './create-delivery-person-form';

const DeliveryPersonSheet = () => {
    const { toast } = useToast();

    const { isOpen, onClose, editId, editData } = useNewDeliveryPerson();
    const queryClient = useQueryClient();
    const isEdit = !!editId;

    const createMutation = useMutation({
        mutationKey: ['create-delivery-person'],
        mutationFn: (data: DeliveryPerson) => createDeliveryPerson(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delivery-persons'] });
            toast({
                title: 'Delivery person created successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to create delivery person',
                variant: 'destructive',
            });
        },
    });

    const updateMutation = useMutation({
        mutationKey: ['update-delivery-person'],
        mutationFn: ({ id, data }: { id: number; data: DeliveryPerson }) => updateDeliveryPerson(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delivery-persons'] });
            toast({
                title: 'Delivery person updated successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to update delivery person',
                variant: 'destructive',
            });
        },
    });

    const onSubmit = (values: FormValues) => {
        if (isEdit && editId) {
            updateMutation.mutate({ id: editId, data: values as DeliveryPerson });
        } else {
            createMutation.mutate(values as DeliveryPerson);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Delivery Person' : 'Create Delivery Person'}</SheetTitle>
                    <SheetDescription>
                        {isEdit ? 'Update the delivery person details' : 'Create a new delivery person'}
                    </SheetDescription>
                </SheetHeader>
                <CreateDeliveryPersonForm 
                    onSubmit={onSubmit} 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    defaultValues={editData}
                    isEdit={isEdit}
                />
            </SheetContent>
        </Sheet>
    );
};

export default DeliveryPersonSheet;
