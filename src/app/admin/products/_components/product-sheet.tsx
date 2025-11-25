import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import React from 'react';
import CreateProductForm, { FormValues } from './create-product-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct } from '@/http/api';
import { useNewProduct } from '@/store/product/product-store';
import { useToast } from '@/components/ui/use-toast';

const ProductSheet = () => {
    const { toast } = useToast();

    const { isOpen, onClose, editId, editData } = useNewProduct();
    const queryClient = useQueryClient();
    const isEdit = !!editId;

    const createMutation = useMutation({
        mutationKey: ['create-product'],
        mutationFn: (data: FormData) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: 'Product created successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to create product',
                variant: 'destructive',
            });
        },
    });

    const updateMutation = useMutation({
        mutationKey: ['update-product'],
        mutationFn: ({ id, data }: { id: number; data: FormData }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: 'Product updated successfully',
            });
            onClose();
        },
        onError: () => {
            toast({
                title: 'Failed to update product',
                variant: 'destructive',
            });
        },
    });

    const onSubmit = (values: FormValues) => {
        const formdata = new FormData();
        formdata.append('name', values.name);
        formdata.append('description', values.description);
        formdata.append('price', String(values.price));
        
        // Only append image if it's a FileList with files
        if (values.image && values.image instanceof FileList && values.image.length > 0) {
            formdata.append('image', values.image[0]);
        }
        
        if (values.isOffer) {
            formdata.append('isOffer', 'true');
        }

        if (isEdit && editId) {
            updateMutation.mutate({ id: editId, data: formdata });
        } else {
            createMutation.mutate(formdata);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Product' : 'Create Product'}</SheetTitle>
                    <SheetDescription>
                        {isEdit ? 'Update the product details' : 'Create a new product'}
                    </SheetDescription>
                </SheetHeader>
                <CreateProductForm 
                    onSubmit={onSubmit} 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    defaultValues={editData}
                    isEdit={isEdit}
                />
            </SheetContent>
        </Sheet>
    );
};

export default ProductSheet;
