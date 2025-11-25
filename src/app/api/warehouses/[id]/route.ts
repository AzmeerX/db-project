import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { warehouses } from '@/lib/db/schema';
import { warehouseSchema } from '@/lib/validators/warehouseSchema';
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
        const warehouseId = parseInt(params.id);

        await db.delete(warehouses).where(eq(warehouses.id, warehouseId));

        return Response.json({ message: 'Warehouse deleted successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to delete warehouse' }, { status: 500 });
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
    const warehouseId = parseInt(params.id);

    let validatedData;

    try {
        validatedData = await warehouseSchema.parse(requestData);
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    try {
        await db.update(warehouses)
            .set(validatedData)
            .where(eq(warehouses.id, warehouseId));

        return Response.json({ message: 'Warehouse updated successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to update warehouse' }, { status: 500 });
    }
}
