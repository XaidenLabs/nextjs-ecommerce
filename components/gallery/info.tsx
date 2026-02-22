"use client";
import { ShoppingCart, Palette } from "lucide-react";

import { Category, Product } from "@/types";
import { Button } from "../ui/button";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import CanvasStudio from "@/components/canvas-studio";

interface InfoProps {
  data: Product;
  categories: Category[];
  availableSizes: Category[];
}

const Info: React.FC<InfoProps> = ({ data, categories, availableSizes }) => {
  const [size, setSize] = useState("");
  const [customDesign, setCustomDesign] = useState<string | null>(null);
  const [customDesignBack, setCustomDesignBack] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const cart = useCart();

  const isSizeAvailable = (sizeId: string) => {
    return availableSizes.some((size: any) => size.sizeId === sizeId);
  };

  const onAddToCart = () => {
    const productWithSize = {
      ...data,
      size: size,
      customDesign: customDesign ? customDesign : undefined,
      customDesignBack: customDesignBack ? customDesignBack : undefined,
    };
    cart.addItem(productWithSize);
    if (customDesign) {
      setCustomDesign(null);
      setCustomDesignBack(null);
    }
  };

  const handleSaveDesign = (design: string, designBack?: string) => {
    setCustomDesign(design);
    if (designBack) setCustomDesignBack(designBack);
    setIsCustomizing(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
      <div className="mt-3 flex items-end justify-between">
        {data.finalPrice && data.finalPrice > 0 ? (
          <div className="font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">
                ₦{Number(data?.price).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span>
              <div className=" bg-red-600 text-sm text-white  p-1 px-1 font-semibold rounded-sm">
                -{data?.discount}%
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold mt-1">
              ₦{data.finalPrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
          </div>
        ) : (
          <p className="text-2xl text-gray-900 font-semibold">
            ₦{Number(data?.price).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
      <div className="flex items-center gap-x-4 mt-3">
        <span className="text-sm font-serif text-[#4a4a4a]">
          {data?.description}
        </span>
      </div>
      <div className="flex mt-2 flex-wrap gap-2 flex-col">
        <span className="text-xl font-semibold py-2 text-gray-900">Size</span>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category: any) => {
            const isSizeAvailableInCategory = isSizeAvailable(category.id);
            return (
              <Button
                type="button"
                className={`${isSizeAvailableInCategory
                  ? ""
                  : "disabled:pointer-events-auto relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform hover:bg-transparent"
                  } flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm ${size === category.name ? "ring-2 ring-neutral-600" : ""
                  }`}
                key={category.id}
                disabled={!isSizeAvailableInCategory}
                onClick={() => setSize(category.name)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <Button onClick={() => setIsCustomizing(true)} variant="outline" className="w-full flex items-center justify-center gap-2">
          <Palette size={20} />
          Customize This Item
        </Button>
        {customDesign && (
          <div className="flex gap-2">
            <div className="relative w-20 h-20 border rounded-md overflow-hidden group">
              <img src={customDesign} alt="Front Design" className="object-cover w-full h-full" />
              <span className="absolute bottom-0 w-full text-center bg-black/50 text-white text-[10px]">Front</span>
            </div>
            {customDesignBack && (
              <div className="relative w-20 h-20 border rounded-md overflow-hidden group">
                <img src={customDesignBack} alt="Back Design" className="object-cover w-full h-full" />
                <span className="absolute bottom-0 w-full text-center bg-black/50 text-white text-[10px]">Back</span>
              </div>
            )}
            <button
              onClick={() => { setCustomDesign(null); setCustomDesignBack(null); }}
              className="text-red-500 text-sm hover:underline"
            >
              Remove Design
            </button>
          </div>
        )}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          disabled={!size}
          onClick={onAddToCart}
          className={`flex items-center gap-x-2 ${!size
            ? "disabled:pointer-events-auto relative z-10 cursor-not-allowed"
            : ""
            }`}
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>

      <Modal open={isCustomizing} onClose={() => setIsCustomizing(false)}>
        <CanvasStudio imageUrl={data.imageURLs?.[0]} onSave={handleSaveDesign} />
      </Modal>
    </div>
  );
};

export default Info;
