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
import { deleteOrder } from "@/lib/services";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  orderId: number;
  frontendEndDeleteOrder: (id: number) => void;
}

export function DeleteOrderDialog({ orderId, frontendEndDeleteOrder }: Props) {
  const [loader, setLoader] = useState(false);

  async function handleDeleteOrder() {
    setLoader(true);
    try {
      await deleteOrder(orderId);
      toast.success("Cartitem deleted successfully!");
      frontendEndDeleteOrder(orderId);
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
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full border border-[#2A2A2A] bg-transparent text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0] hover:bg-[#2A2A2A] hover:text-white"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl border border-[#2A2A2A] bg-[#171717] text-[#F5F5F5] shadow-2xl shadow-[#0B0B0B]/80 backdrop-blur-sm">
        <AlertDialogHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#0B0B0B]">
            <Trash2 className="h-5 w-5 text-[#C0C0C0]" />
          </div>

          <AlertDialogTitle className="text-2xl font-light tracking-wide text-[#F5F5F5]">
            Delete this order?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm font-light leading-relaxed text-[#A0A0A0]">
            Are you sure you want to permanently delete this order? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel className="rounded-full border-[#2A2A2A] bg-transparent text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0] hover:bg-[#2A2A2A] hover:text-white">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteOrder}
            disabled={loader}
            className="rounded-full bg-[#C0C0C0] font-medium text-[#0B0B0B] transition-all duration-300 hover:bg-[#D8D8D8] hover:shadow-lg hover:shadow-[#C0C0C0]/30 disabled:cursor-not-allowed disabled:bg-[#2A2A2A] disabled:text-[#555555]"
          >
            {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}