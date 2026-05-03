import { db } from '@/lib/db/db';
import { orderItems, products } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const bestSelling = await db
            .select({
                id: products.id,
                name: products.name,
                price: products.price,
                description: products.description,
                totalSold: sql<number>`sum(${orderItems.quantity})`.mapWith(Number),
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .groupBy(products.id)
            .orderBy(desc(sql`sum(${orderItems.quantity})`))
            .limit(8);

        return Response.json(bestSelling);
    } catch (err) {
        console.error(err);
        return Response.json({ message: 'Failed to fetch best selling products' }, { status: 500 });
    }
}


