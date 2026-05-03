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
import { deleteDeliveryPerson } from '@/http/api';
import { useNewDeliveryPerson } from '@/store/deliveryPerson/delivery-person-store';
import { DeliveryPerson } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type DeliveryPersonWithWarehouse = DeliveryPerson & { warehouse: string | null };

export const columns: ColumnDef<DeliveryPersonWithWarehouse>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'warehouse',
        header: 'Warehouse',
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const deliveryPerson = row.original;
            const { setEditDeliveryPerson } = useNewDeliveryPerson();
            const { toast } = useToast();
            const queryClient = useQueryClient();

            const deleteMutation = useMutation({
                mutationFn: (id: number) => deleteDeliveryPerson(id),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['delivery-persons'] });
                    toast({
                        title: 'Delivery person deleted successfully',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Failed to delete delivery person',
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
                            onClick={() => setEditDeliveryPerson(deliveryPerson.id, deliveryPerson)}
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this delivery person?')) {
                                    deleteMutation.mutate(deliveryPerson.id);
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


