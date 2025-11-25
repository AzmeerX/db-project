import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { deliveryPersons } from '@/lib/db/schema';
import { deliveryPersonSchema } from '@/lib/validators/deliveryPersonSchema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Not allowed' }, { status: 401 });
    }

    // @ts-ignore
    if (session.token.role !== 'admin') {
        return Response.json({ message: 'Not allowed' }, { status: 403 });
    }

    try {
        const deliveryPersonId = parseInt(params.id);

        await db.delete(deliveryPersons).where(eq(deliveryPersons.id, deliveryPersonId));

        return Response.json({ message: 'Delivery person deleted successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to delete delivery person' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Not allowed' }, { status: 401 });
    }

    // @ts-ignore
    if (session.token.role !== 'admin') {
        return Response.json({ message: 'Not allowed' }, { status: 403 });
    }

    const requestData = await request.json();
    const deliveryPersonId = parseInt(params.id);

    let validatedData;

    try {
        validatedData = await deliveryPersonSchema.parse(requestData);
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    try {
        await db.update(deliveryPersons)
            .set(validatedData)
            .where(eq(deliveryPersons.id, deliveryPersonId));

        return Response.json({ message: 'Delivery person updated successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to update delivery person' }, { status: 500 });
    }
}
