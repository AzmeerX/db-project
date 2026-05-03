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
import { deleteWarehouse } from '@/http/api';
import { useNewWarehouse } from '@/store/warehouse/warehouse-store';
import { Warehouse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const columns: ColumnDef<Warehouse>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'pincode',
        header: 'Pincode',
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const warehouse = row.original;
            const { setEditWarehouse } = useNewWarehouse();
            const { toast } = useToast();
            const queryClient = useQueryClient();

            const deleteMutation = useMutation({
                mutationFn: (id: number) => deleteWarehouse(id),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['warehouses'] });
                    toast({
                        title: 'Warehouse deleted successfully',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Failed to delete warehouse',
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
                            onClick={() => setEditWarehouse(warehouse.id, warehouse)}
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this warehouse?')) {
                                    deleteMutation.mutate(warehouse.id);
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


