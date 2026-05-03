import { z } from 'zod';

export const isServer = typeof window === 'undefined';

export const productSchema = z.object({
    name: z.string({ message: 'Product name should be a string' }).min(4),
    image: z.custom<FileList | File>((val) => {
        if (typeof window === 'undefined') {
            return val instanceof File;
        }
        return val instanceof FileList;
    }, { message: 'Product image should be a file' }),
    description: z.string({ message: 'Product description should be a string' }).min(8),
    price: z.number({ message: 'Product price should be a number' }),
    isOffer: z.boolean().optional(),
});


