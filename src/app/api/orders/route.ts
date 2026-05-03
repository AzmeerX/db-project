import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { deliveryPersons, inventories, orders, products, users, warehouses } from '@/lib/db/schema';
import { orderSchema } from '@/lib/validators/orderSchema';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
    console.log('session', session);

    if (!session) {
        return Response.json({ message: 'Not allowed' }, { status: 401 });
    }

    const requestData = await request.json();
    let validatedData;

    try {
        validatedData = await orderSchema.parse(requestData);
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    console.log('validated data:', validatedData);


    const warehouseResult = await db
        .select({ id: warehouses.id })
        .from(warehouses)
        .where(eq(warehouses.pincode, validatedData.pincode));

    if (!warehouseResult.length) {
        return Response.json({ message: 'No warehouse found' }, { status: 400 });
    }

    const foundProducts = await db
        .select()
        .from(products)
        .where(eq(products.id, validatedData.productId))
        .limit(1);

    if (!foundProducts.length) {
        return Response.json({ message: 'No product found' }, { status: 400 });
    }
    let transactionError: string = '';
    let finalOrder: any = null;

    try {
        finalOrder = await db.transaction(async (tx) => {

            const order = await tx
                .insert(orders)

                .values({
                    ...validatedData,

                    userId: Number(session.token.id),
                    price: foundProducts[0].price * validatedData.qty,

                    status: 'received',
                })
                .returning({ id: orders.id, price: orders.price });


            const availableStock = await tx
                .select()
                .from(inventories)
                .where(
                    and(
                        eq(inventories.warehouseId, warehouseResult[0].id),
                        eq(inventories.productId, validatedData.productId),
                        isNull(inventories.orderId)
                    )
                )
                .limit(validatedData.qty)
                .for('update', { skipLocked: true });

            if (availableStock.length < validatedData.qty) {
                transactionError = `Stock is low, only ${availableStock.length} products available`;
                tx.rollback();
                return;
            }

            const availablePersons = await tx
                .select()
                .from(deliveryPersons)
                .where(
                    and(
                        isNull(deliveryPersons.orderId),
                        eq(deliveryPersons.warehouseId, warehouseResult[0].id)
                    )
                )
                .for('update')
                .limit(1);

            if (!availablePersons.length) {
                transactionError = `Delivery person is not available at the moment`;
                tx.rollback();
                return;
            }


            await tx
                .update(inventories)
                .set({ orderId: order[0].id })
                .where(
                    inArray(
                        inventories.id,
                        availableStock.map((stock) => stock.id)
                    )
                );

            await tx
                .update(deliveryPersons)
                .set({ orderId: order[0].id })
                .where(eq(deliveryPersons.id, availablePersons[0].id));

            await tx.update(orders).set({ status: 'reserved' }).where(eq(orders.id, order[0].id));

            return order[0];
        });
    } catch (err) {


        return Response.json(
            {
                message: transactionError ? transactionError : 'Error while db transaction',
            },
            { status: 500 }
        );
    }





    const paymentUrl = `${process.env.APP_BASE_URL}/payment/success`;

    return Response.json({ paymentUrl });
}

export async function GET() {



    const allOrders = await db
        .select({
            id: orders.id,
            product: products.name,
            productId: products.id,
            userId: users.id,
            user: users.fname,
            type: orders.type,
            price: orders.price,
            image: products.image,
            status: orders.status,
            address: orders.address,
            qty: orders.qty,
            createAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(products, eq(orders.productId, products.id))
        .leftJoin(users, eq(orders.userId, users.id))




        .orderBy(desc(orders.id));
    return Response.json(allOrders);
}


