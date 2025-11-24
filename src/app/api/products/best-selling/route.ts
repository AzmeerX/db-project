import { db } from '@/lib/db/db';
import { orders, products } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const bestSelling = await db
            .select({
                id: products.id,
                name: products.name,
                image: products.image,
                price: products.price,
                description: products.description,
                totalSold: sql<number>`sum(${orders.qty})`.mapWith(Number),
            })
            .from(orders)
            .leftJoin(products, eq(orders.productId, products.id))
            .groupBy(products.id)
            .orderBy(desc(sql`sum(${orders.qty})`))
            .limit(8);

        return Response.json(bestSelling);
    } catch (err) {
        console.error(err);
        return Response.json({ message: 'Failed to fetch best selling products' }, { status: 500 });
    }
}
