"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

interface ProductScrollRowProps {
    title: string;
    sectionTitle?: string;
    products: Product[];
}

const ProductScrollRow = ({ title, sectionTitle, products }: ProductScrollRowProps) => {
    const router = useRouter();

    return (
        <div className="bg-[#F8F8F8] min-h-max w-full max-w-screen mx-auto border pb-16 lg:pb-0 p-5 lg:p-20">
            {sectionTitle && (
                <h1 className="font-semibold text-2xl pt-10">{sectionTitle}</h1>
            )}
            <h2 className="underline text-xl pt-5">{title}</h2>
            <div className="flex overflow-x-auto space-x-4 no-scrollbar pt-5 lg:pt-10 pb-10">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="lg:min-w-[300px] rounded-lg p-2 cursor-pointer group text-sm lg:text-lg flex-shrink-0"
                    >
                        <div className="relative w-36 lg:w-64 h-48 lg:h-80 overflow-hidden rounded-lg bg-[#EFEFF0]">
                            <Image
                                src={product.imageURLs[0] || "/placeholder.jpg"}
                                alt={product.title}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 144px, 256px"
                            />
                            {/* Dark overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Shop Now text on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="text-white text-lg font-semibold bg-black/60 px-3 py-1 rounded-lg">
                                    Shop Now
                                </span>
                            </div>
                        </div>
                        <h1 className="font-semibold pt-5">{product.title}</h1>
                        <h1 className="text-gray-600">{product.category}</h1>
                        <b>₦{Number(product.price).toLocaleString("en-NG")}</b>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductScrollRow;
