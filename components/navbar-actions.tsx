"use client";

import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import CanvasStudio from "@/components/canvas-studio";
import toast from "react-hot-toast";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  const filteredShop = cart?.items?.map((item) => item.quantity);

  const shopCount = filteredShop?.reduce((a, b) => {
    return a + b;
  }, 0);

  const handleSaveDesign = (design: string, designBack?: string) => {
    // For global customization, we create a generic custom item
    const customItem = {
      id: "custom-global-" + Date.now(),
      category: "custom",
      description: "User created custom design",
      title: "Custom Design",
      price: "0.00", // Free or base price
      featured: false,
      imageURLs: ["/placeholder.png"], // Placeholder
      customDesign: design,
      customDesignBack: designBack,
      size: "One Size" // Default
    };

    cart.addItem(customItem);
    setIsCustomizing(false);
    toast.success("Design saved to cart!");
  }

  return (
    <div className="flex items-center gap-x-4">
      <Button
        onClick={() => setIsCustomizing(true)}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <Palette size={20} />
        <span className="max-md:hidden">Design Lab</span>
      </Button>

      <button
        onClick={() => router.push("/cart")}
        className="flex items-center px-[6px] py-1"
      >
        <Badge
          badgeContent={shopCount}
          color="info"
          max={9}
          sx={{
            "& .MuiBadge-anchorOriginTopRight": {
              background: "#ffffff",
              color: "#000000",
            },
          }}
        >
          <ShoppingCartIcon style={{ fontSize: "25px", color: "#ffffff" }} />
        </Badge>
      </button>

      <Modal open={isCustomizing} onClose={() => setIsCustomizing(false)}>
        <CanvasStudio onSave={handleSaveDesign} />
      </Modal>
    </div>
  );
};

export default NavbarActions;
