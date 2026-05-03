import { z } from 'zod';

const allowedStatuses = ['received', 'reserved', 'paid', 'out_for_delivery', 'delivered', 'cancelled', 'completed'] as const;

export const orderStatusSchema = z.object({
    orderId: z.number({ message: 'Order Id should be a number' }),
    status: z.enum(allowedStatuses, { 
        message: `Status should be one of: ${allowedStatuses.join(', ')}` 
    }),
});


