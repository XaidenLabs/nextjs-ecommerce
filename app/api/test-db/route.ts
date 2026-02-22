import { NextResponse } from "next/server";
import { getAllProducts } from "@/actions/get-products";

export async function GET() {
    try {
        const products = await getAllProducts();
        return NextResponse.json({ count: products.length, products });
    } catch (error) {
        console.error("Test DB Error:", error);
        return NextResponse.json({ error: "Failed", details: String(error) }, { status: 500 });
    }
}
