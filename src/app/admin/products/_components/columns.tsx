'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteProduct } from '@/http/api';
import { useNewProduct } from '@/store/product/product-store';
import { Product } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            return `$${row.original.price}`;
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const product = row.original;
            const { setEditProduct } = useNewProduct();
            const { toast } = useToast();
            const queryClient = useQueryClient();

            const deleteMutation = useMutation({
                mutationFn: (id: number) => deleteProduct(id),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['products'] });
                    toast({
                        title: 'Product deleted successfully',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Failed to delete product',
                        variant: 'destructive',
                    });
                },
            });

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => setEditProduct(product.id, product)}
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                    deleteMutation.mutate(product.id);
                                }
                            }}
                            className="cursor-pointer text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
