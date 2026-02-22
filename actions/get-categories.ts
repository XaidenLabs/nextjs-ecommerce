import { db } from "@/lib/db";
import { Category } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
    const categories = await db.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return categories as unknown as Category[];
};

export const getCategory = async (categoryId: string): Promise<Category | null> => {
    const category = await db.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    return category as unknown as Category;
};
