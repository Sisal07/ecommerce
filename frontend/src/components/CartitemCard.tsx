import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/contexts/CartContext";
import { baseURL } from "@/lib/api";
import {
  decreaseItemQuantity,
  formatPrice,
  increaseItemQuantity,
} from "@/lib/services";
import { ICartitems } from "@/types/types";

import { DeleteCartitemDialog } from "./DeleteCartitemDialog";
import { Button } from "./ui/button";

interface Props {
  item: ICartitems;
}

const CartitemCard = ({ item }: Props) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loader, setLoader] = useState(false);

  const { increaseItemQuantityContext, decreaseItemQuantityContext } =
    useCart();

  // Increase quantity handler
  async function handleIncreaseQuantity() {
    if (item.quantity >= item.product.quantity) {
      toast.error("Product is out of stock");
      return;
    }

    setLoader(true);
    try {
      const response = await increaseItemQuantity({ item_id: item.id });
      setQuantity((curr) => curr + 1);

      toast.success("Cart item quantity increased!");
      increaseItemQuantityContext(item.id);
      console.log(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoader(false);
    }
  }

  // Decrease quantity handler
  async function handleDecreaseQuantity() {
    setLoader(true);
    try {
      const response = await decreaseItemQuantity({ item_id: item.id });
      setQuantity((curr) => curr - 1);

      toast.success("Cart item quantity decreased!");
      decreaseItemQuantityContext(item.id);
      console.log(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoader(false);
    }
  }

  return (
    <div
      key={item.id}
      className="group flex flex-col gap-4 border-b border-[#D4AF37]/15 py-5 font-['Inter','Poppins',sans-serif] transition-all duration-300 last:border-b-0 sm:flex-row sm:items-center"
    >
      <img
        src={`${baseURL}${item.product.image}`}
        alt={item.product.name}
        className="h-24 w-24 rounded-2xl border border-[#D4AF37]/20 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold tracking-tight text-[#050505] transition-colors duration-300 group-hover:text-[#D4AF37]">
          {item.product.name}
        </h3>
        <p className="mt-1 text-sm capitalize text-[#050505]/50">
          {item.product.category}
        </p>
        <p className="mt-2 text-lg font-bold text-[#D4AF37]">
          {formatPrice(item.product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#050505] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-[#D4AF37]/25 bg-transparent text-white/70 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/25"
          disabled={loader || quantity <= 1}
          onClick={handleDecreaseQuantity}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-10 text-center text-sm font-semibold text-[#D4AF37]">
          {quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-[#D4AF37]/25 bg-transparent text-white/70 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/25"
          disabled={loader}
          onClick={handleIncreaseQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 sm:min-w-[120px] sm:flex-col sm:items-end sm:text-right">
        <p className="text-lg font-bold text-[#050505]">
          {formatPrice(item.product.price * item.quantity)}
        </p>

        <DeleteCartitemDialog itemId={item.id} />
      </div>
    </div>
  );
};

export default CartitemCard;