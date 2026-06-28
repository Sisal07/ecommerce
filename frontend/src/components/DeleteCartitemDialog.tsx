import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { deleteCartitem } from "@/lib/services";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteCartitemDialog({ itemId }: { itemId: number }) {
  const [loader, setLoader] = useState(false);
  const { removeFromCart } = useCart();

  async function handleDeleteCartitem() {
    setLoader(true);
    try {
      await deleteCartitem(itemId);
      toast.success("Cartitem deleted successfully!");
      removeFromCart(itemId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoader(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full border border-[#D4AF37]/25 bg-white text-[#050505]/60 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] font-['Inter','Poppins',sans-serif]">
        <AlertDialogHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Trash2 className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <AlertDialogTitle className="text-2xl font-bold tracking-tight text-white">
            Remove item from cart?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm leading-relaxed text-white/60">
            Are you sure you want to remove this item from your cart? You can
            always add it again later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel className="rounded-full border-[#D4AF37]/35 bg-transparent text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675]">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteCartitem}
            disabled={loader}
            className="rounded-full bg-[#D4AF37] font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_12px_28px_rgba(212,175,55,0.24)] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
          >
            {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}