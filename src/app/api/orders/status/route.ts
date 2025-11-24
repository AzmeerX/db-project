import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { orders, deliveryPersons } from '@/lib/db/schema';
import { orderStatusSchema } from '@/lib/validators/orderStatusSchema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function PATCH(request: Request) {
    // todo: verify if user is admin

    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Not allowed' }, { status: 401 });
    }
    // todo: check user access.
    // @ts-ignore
    if (session.token.role !== 'admin') {
        return Response.json({ message: 'Not allowed' }, { status: 403 });
    }

    const requestData = await request.json();
    let validatedData;

    try {
        validatedData = orderStatusSchema.parse(requestData);
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    try {
        // Update order status in a transaction to ensure consistency
        await db.transaction(async (tx) => {
            // Update the order status
            await tx
                .update(orders)
                .set({ status: validatedData.status })
                .where(eq(orders.id, validatedData.orderId));

            // If order is completed or cancelled, free up the delivery person
            if (validatedData.status === 'delivered' || 
                validatedData.status === 'cancelled' || 
                validatedData.status === 'completed') {
                
                await tx
                    .update(deliveryPersons)
                    .set({ orderId: null })
                    .where(eq(deliveryPersons.orderId, validatedData.orderId));
            }
        });

        return Response.json({ 
            message: `Order ${validatedData.status}${
                (validatedData.status === 'delivered' || 
                 validatedData.status === 'cancelled' || 
                 validatedData.status === 'completed') 
                    ? ' - Delivery person is now available for new orders' 
                    : ''
            }` 
        }, { status: 200 });
    } catch (err) {
        console.error('Error updating order status:', err);
        return Response.json({ message: 'Failed to update the order' }, { status: 500 });
    }
}
