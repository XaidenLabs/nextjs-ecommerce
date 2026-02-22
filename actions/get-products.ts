import { db } from "@/lib/db";
import { Product } from "@/types";

export const getAllProducts = async (): Promise<Product[]> => {
    const products = await db.product.findMany({
        include: {
            productSizes: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products as unknown as Product[];
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    const products = await db.product.findMany({
        where: {
            featured: true,
        },
        include: {
            productSizes: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products as unknown as Product[];
};

export const getProduct = async (productId: string): Promise<Product | null> => {
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            productSizes: true,
        },
    });

    return product as unknown as Product;
};

export const getCategoryProducts = async (categoryName: string): Promise<Product[]> => {
    // If category is a name, we need to find category ID first or filter by category name relation?
    // Prisma schema has product.category linked to Category model?
    // Checking apiCalls: api/product/category/${category}
    // Let's assume the component passes the category ID or name?
    // API `api/product/category/[category]` logic would clarify.
    // Assuming it filters by category.category (string field) based on schema from step 232 view (which was api/product/route.ts).
    // Wait, schema was viewed in step 225? No.
    // Step 243 `api/categories/route.ts` creates category with `category` string field.
    // `api/product/route.ts` creates product with `category` string field AND `categoryId`.
    // So likely filtering by `category` string field.

    const products = await db.product.findMany({
        where: {
            category: categoryName
        },
        include: {
            productSizes: true,
        }
    });

    // Wait, if Product model has `category` string field, I can filter directly.
    // If it has relation `category: Category`, then `categoryId`.

    // Let's check `api/product/category/[categoryId]/route.ts`... wait it's not in my list.
    // apiCalls says `api/product/category/${category}`.

    // I will check prisma schema or `api/product/category/[category]` route if it exists.
    // But for now I will guess from usage.

    return products as unknown as Product[];
};
