"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/container";
import { Category, type Product } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { ChevronDown, ChevronRight, Share2, Palette } from "lucide-react";
import Modal from "@/components/ui/modal";
import CanvasStudio from "@/components/canvas-studio";

const ProductItem = () => {
  const { productId } = useParams();
  const router = useRouter();
  const cart = useCart();

  const [display, setDisplay] = useState<string>("");
  const [count, setCount] = useState(1);
  const [size, setSize] = useState("");
  const [categories, setCategories] = useState([]);
  const [openDesc, setOpenDesc] = useState(false);
  const [openSpec, setOpenSpec] = useState(false);
  const [openShip, setOpenShip] = useState(false);
  const [customDesign, setCustomDesign] = useState<string | null>(null);
  const [customDesignBack, setCustomDesignBack] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const [productQuery, relatedQuery] = useQueries({
    queries: [
      {
        queryKey: ["single product", productId],
        queryFn: async () => {
          const res = await axios.get(`/api/product/${productId}`);
          if (res.data?.imageURLs?.[0] && !display) {
            setDisplay(res.data.imageURLs[0]);
          }
          return res.data;
        },
      },
      {
        queryKey: ["related products"],
        queryFn: async () => {
          const response = await axios.get("/api/product/");
          return response.data;
        },
      },
    ],
  });

  const { isLoading } = useQuery({
    queryKey: ["product categories", productQuery.data?.categoryId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/sizes/${productQuery.data.categoryId}`
      );
      const sortedData = data.sort((a: any, b: any) => a.name - b.name);
      setCategories(sortedData);
      return data;
    },
    enabled: !!productQuery.data?.categoryId,
  });

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(prev - 1, 1));

  const isSizeAvailable = (sizeId: string) => {
    return productQuery.data?.productSizes?.some(
      (s: any) => s.sizeId === sizeId
    );
  };

  const onAddToCart = () => {
    const productWithSize = {
      ...productQuery.data,
      size: size,
      customDesign: customDesign || undefined,
      customDesignBack: customDesignBack || undefined,
    };
    // Add multiple based on count
    for (let i = 0; i < count; i++) {
      cart.addItem(productWithSize);
    }
    setCustomDesign(null);
    setCustomDesignBack(null);
  };

  const handleSaveDesign = (design: string, designBack?: string) => {
    setCustomDesign(design);
    if (designBack) setCustomDesignBack(designBack);
    setIsCustomizing(false);
  };

  if (productQuery.isLoading || relatedQuery.isLoading) {
    return (
      <Container>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (!productQuery.data || !relatedQuery.data) {
    return <Container>Something went wrong!</Container>;
  }

  const product = productQuery.data;
  const filteredData: Product[] = relatedQuery?.data?.filter(
    (item: Product) =>
      item.category === product?.category && product.id !== item.id
  );

  return (
    <div className="bg-[#F8F8F8]">
      {/* Breadcrumb */}
      <div className="flex pt-14 pb-5 pl-5 lg:pl-10 items-center gap-3 text-sm">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/shop/${product.category}`} className="hover:underline">{product.category}</Link>
        <ChevronRight size={14} />
        <p className="text-gray-500 truncate max-w-[200px]">{product.title}</p>
      </div>

      {/* Product Display */}
      <div className="w-full lg:flex grid lg:flex-row justify-center items-center lg:items-start">
        {/* Left Image Section */}
        <div className="w-full lg:w-[40%] h-auto flex flex-col lg:flex-row justify-center items-center gap-5 px-5">
          {/* Thumbnails */}
          <div className="flex lg:grid lg:h-[90%] lg:w-[25%] gap-3">
            {product.imageURLs?.map((img: string, i: number) => (
              <div
                key={i}
                onClick={() => setDisplay(img)}
                className={`relative w-[80px] h-[100px] lg:w-[100px] lg:h-[130px] border rounded-lg cursor-pointer overflow-hidden ${display === img ? "border-black border-2" : "border-gray-300"
                  }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="h-[90%] w-full lg:w-[75%]">
            <div className="relative w-full max-w-[400px] aspect-[3/4] border border-black rounded-2xl bg-[#DDDDDD] overflow-hidden mx-auto">
              {display && (
                <Image
                  src={display}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="w-full lg:w-[50%] pt-5 px-5 lg:pr-10 pb-10">
          <p className="text-black opacity-75">Bluepetals</p>
          <h1 className="text-3xl lg:text-4xl pb-3">{product.title}</h1>
          {product.finalPrice && product.finalPrice > 0 ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-lg">
                  ₦{Number(product.price).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>
                <div className="bg-red-600 text-sm text-white p-1 px-2 font-semibold rounded-sm">
                  -{product.discount}%
                </div>
              </div>
              <b className="text-2xl opacity-70">₦{product.finalPrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</b>
            </div>
          ) : (
            <b className="text-2xl opacity-70">₦{Number(product.price).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</b>
          )}

          {/* Size */}
          <p className="opacity-40 pt-6">Size</p>
          <div className="pt-3 flex flex-wrap gap-2">
            {categories?.map((category: any) => {
              const available = isSizeAvailable(category.id);
              return (
                <button
                  key={category.id}
                  disabled={!available}
                  onClick={() => setSize(category.name)}
                  className={`min-w-[40px] h-10 rounded-md border text-sm transition-all ${size === category.name
                    ? "bg-black text-white border-black"
                    : available
                      ? "bg-[#F8F8F8] border-gray-400 hover:bg-gray-200 opacity-80"
                      : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed line-through"
                    } px-3`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <p className="underline text-sm pt-5 cursor-pointer hover:no-underline">
            Size Chart
          </p>

          {/* Customize */}
          <div className="pt-5">
            <button
              onClick={() => setIsCustomizing(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-[3rem] px-6 rounded-lg border text-black border-gray-400 bg-white hover:bg-gray-50 transition"
            >
              <Palette size={18} />
              Customize This Item
            </button>
            {customDesign && (
              <div className="flex gap-2 mt-3">
                <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                  <img src={customDesign} alt="Front Design" className="object-cover w-full h-full" />
                  <span className="absolute bottom-0 w-full text-center bg-black/50 text-white text-[10px]">Front</span>
                </div>
                {customDesignBack && (
                  <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                    <img src={customDesignBack} alt="Back Design" className="object-cover w-full h-full" />
                    <span className="absolute bottom-0 w-full text-center bg-black/50 text-white text-[10px]">Back</span>
                  </div>
                )}
                <button
                  onClick={() => { setCustomDesign(null); setCustomDesignBack(null); }}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-7 flex flex-col sm:flex-row gap-5 w-full">
            <div className="relative">
              <input
                type="text"
                value={count}
                readOnly
                className="w-full sm:w-[15rem] h-[3rem] rounded-lg bg-white border border-black text-center"
              />
              <button
                onClick={increment}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-xl hover:text-gray-500"
              >
                +
              </button>
              <button
                onClick={decrement}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-xl hover:text-gray-500"
              >
                −
              </button>
            </div>
            <button
              onClick={onAddToCart}
              disabled={!size}
              className={`w-full sm:w-[20rem] h-[3rem] rounded-lg border text-white border-black transition ${size
                ? "bg-black hover:bg-gray-800 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed border-gray-400"
                }`}
            >
              Add to cart
            </button>
          </div>

          {/* Wishlist & Share */}
          <div className="flex flex-col sm:flex-row pt-5 gap-5 w-full">
            <button className="w-full sm:w-[25rem] h-[3rem] rounded-lg border text-black border-black bg-white hover:bg-black hover:text-white transition">
              Add to wishlist
            </button>
            <button className="relative w-[6rem] h-[3rem] rounded-lg border text-black border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center gap-2">
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="px-5 sm:px-10 lg:px-16 pt-10 w-full mx-auto space-y-4">
        {/* Product Description */}
        <button
          onClick={() => setOpenDesc(!openDesc)}
          className="flex items-center justify-between w-full px-4 py-4 bg-white text-black rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span className="font-medium">Product Description</span>
          <ChevronDown
            className={`transition-transform duration-300 ${openDesc ? "rotate-180" : "rotate-0"
              }`}
            size={20}
          />
        </button>
        {openDesc && (
          <div className="px-4 pb-4">
            <p className="mt-4 text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Product Specification */}
        <button
          onClick={() => setOpenSpec(!openSpec)}
          className="flex items-center justify-between w-full px-4 py-4 bg-white text-black rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span className="font-medium">Product Specification</span>
          <ChevronDown
            className={`transition-transform duration-300 ${openSpec ? "rotate-180" : "rotate-0"
              }`}
            size={20}
          />
        </button>
        {openSpec && (
          <div className="px-4 pb-4">
            <p className="mt-4 text-gray-700">Made in Portugal</p>
            <p className="text-gray-700">100% Polyester</p>
          </div>
        )}

        {/* Shipping & Returns */}
        <button
          onClick={() => setOpenShip(!openShip)}
          className="flex items-center justify-between w-full px-4 py-4 bg-white text-black rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span className="font-medium">Shipping & Returns</span>
          <ChevronDown
            className={`transition-transform duration-300 ${openShip ? "rotate-180" : "rotate-0"
              }`}
            size={20}
          />
        </button>
        {openShip && (
          <div className="px-4 pb-4">
            <p className="mt-4 text-gray-600">Ships in 3–5 business days</p>
            <p className="text-gray-600">Free returns within 30 days</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {filteredData.length > 0 && (
        <div className="min-h-max w-full max-w-screen mx-auto border p-5 lg:p-20 pt-10">
          <h1 className="text-xl font-medium">Customers also viewed</h1>
          <div className="flex overflow-x-auto space-x-4 no-scrollbar pt-10 pb-10">
            {filteredData.slice(0, 8).map((item: Product) => (
              <div
                key={item.id}
                onClick={() => router.push(`/product/${item.id}`)}
                className="lg:min-w-[300px] rounded-lg p-2 cursor-pointer text-sm lg:text-lg group flex-shrink-0"
              >
                <div className="relative w-36 lg:w-64 h-48 lg:h-80 overflow-hidden rounded-lg bg-[#EFEFF0]">
                  <Image
                    src={item.imageURLs?.[0] || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 144px, 256px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-white text-lg font-semibold bg-black/60 px-3 py-1 rounded-lg">
                      Shop Now
                    </span>
                  </div>
                </div>
                <h1 className="font-semibold pt-5">{item.title}</h1>
                <h1 className="text-gray-600">{item.category}</h1>
                <b>₦{Number(item.price).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Studio Modal */}
      <Modal open={isCustomizing} onClose={() => setIsCustomizing(false)}>
        <CanvasStudio imageUrl={product.imageURLs?.[0]} onSave={handleSaveDesign} />
      </Modal>
    </div>
  );
};

export default ProductItem;
