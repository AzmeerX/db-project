import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { isServer } from '@/lib/validators/productSchema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    try {
        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, Number(id)))
            .limit(1);

        if (!product.length) {
            return Response.json({ message: 'Product not found.' }, { status: 400 });
        }

        return Response.json(product[0]);
    } catch (err) {
        return Response.json({ message: 'Failed to fetch a product' }, { status: 500 });
    }
}

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
        const productId = parseInt(params.id);
        
        // Get the product first to delete the image
        const [product] = await db.select().from(products).where(eq(products.id, productId));
        
        if (!product) {
            return Response.json({ message: 'Product not found' }, { status: 404 });
        }

        // Delete the product from database
        await db.delete(products).where(eq(products.id, productId));

        // Try to delete the image file
        if (product.image) {
            try {
                await unlink(path.join(process.cwd(), 'public/assets', product.image));
            } catch (err) {
                console.error('Failed to delete image file:', err);
                // Continue even if image deletion fails
            }
        }

        return Response.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to delete product' }, { status: 500 });
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

    const data = await request.formData();
    const productId = parseInt(params.id);

    // Get existing product
    const [existingProduct] = await db.select().from(products).where(eq(products.id, productId));
    
    if (!existingProduct) {
        return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    let filename = existingProduct.image;
    const imageData = data.get('image');

    // Check if new image is provided
    if (imageData && imageData !== 'undefined' && imageData !== '') {
        const inputImage = isServer
            ? (imageData as File)
            : imageData as File;

        if (inputImage.size > 0) {
            filename = `${Date.now()}.${inputImage.name.split('.').slice(-1)}`;

            try {
                const buffer = Buffer.from(await inputImage.arrayBuffer());
                await writeFile(path.join(process.cwd(), 'public/assets', filename), buffer as any);

                // Delete old image
                if (existingProduct.image) {
                    try {
                        await unlink(path.join(process.cwd(), 'public/assets', existingProduct.image));
                    } catch (err) {
                        console.error('Failed to delete old image:', err);
                    }
                }
            } catch (err) {
                return Response.json({ message: 'Failed to save the file to fs' }, { status: 500 });
            }
        }
    }

    let validatedData;
    try {
        validatedData = {
            name: data.get('name') as string,
            description: data.get('description') as string,
            price: Number(data.get('price')),
            isOffer: data.get('isOffer') === 'true',
        };
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    try {
        await db.update(products)
            .set({ ...validatedData, image: filename })
            .where(eq(products.id, productId));

        return Response.json({ message: 'Product updated successfully' }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to update product' }, { status: 500 });
    }
}
