"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Container from "./ui/container";
import { Product } from "@/types";

interface ProductScrollRowProps {
    title: string;
    sectionTitle?: string;
    products: Product[];
}

const ProductScrollRow = ({ title, sectionTitle, products }: ProductScrollRowProps) => {
    const router = useRouter();

    return (
        <div className="bg-white border-b border-gray-50 py-24 px-6 md:px-12">
            <Container>
                {sectionTitle && (
                    <h2 className="font-serif text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-4">
                        {sectionTitle}
                    </h2>
                )}
                <div className="flex items-end justify-between border-b border-black pb-4 mb-12">
                    <h3 className="font-serif text-3xl md:text-4xl italic tracking-tight">{title}</h3>
                    <Link href="/shop" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-50 transition-opacity">
                        View All
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-8 no-scrollbar pb-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => router.push(`/product/${product.id}`)}
                            className="min-w-[280px] md:min-w-[340px] group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                <Image
                                    src={product.imageURLs[0] || "/placeholder.jpg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 280px, 340px"
                                />
                                {/* Elegant Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <span className="text-white text-[11px] uppercase tracking-[0.2em] font-bold bg-black px-6 py-3">
                                        Quick View
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-[13px] font-bold uppercase tracking-widest truncate max-w-[70%]">
                                        {product.title}
                                    </h4>
                                    <p className="text-[13px] font-medium">
                                        ₦{Number(product.price).toLocaleString("en-NG")}
                                    </p>
                                </div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                                    {product.category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default ProductScrollRow;
