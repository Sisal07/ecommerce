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
import { deleteProduct } from "@/lib/services";
import { IProduct } from "@/types/types";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  product?: IProduct;
  frontendDeleteProduct?: (id: number) => void;
}

const DeleteDialog = ({ product, frontendDeleteProduct }: Props) => {
  const [loading, setLoading] = useState(false);

  async function handleDeleteProduct() {
    if (!product) return;
    setLoading(true);
    try {
      const response = await deleteProduct(product.id);
      console.log("del res", response);
      frontendDeleteProduct?.(product.id);
      toast.success(`${product.name} deleted successfully!`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        return;
      } else {
        toast.error("An unknown error occured!");
      }
    } finally {
      setLoading(false);
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
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border border-[#2A2A2A] bg-[#171717] text-[#F5F5F5] shadow-2xl shadow-[#0B0B0B]/80 backdrop-blur-sm">
        <AlertDialogHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#0B0B0B]">
            <Trash2 className="h-5 w-5 text-[#C0C0C0]" />
          </div>
          <AlertDialogTitle className="text-2xl font-light tracking-wide text-[#F5F5F5]">
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-light leading-relaxed text-[#A0A0A0]">
            Are you sure you want to delete{" "}
            <span className="font-medium text-[#C0C0C0]">
              {product ? product.name : ""}
            </span>
            ?
            <br />
            This action is permanent and cannot be undone. Once deleted, this
            product and its details will be removed from your store.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel className="rounded-full border-[#2A2A2A] bg-transparent text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0] hover:bg-[#2A2A2A] hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-[#C0C0C0] font-medium text-[#0B0B0B] transition-all duration-300 hover:bg-[#D8D8D8] hover:shadow-lg hover:shadow-[#C0C0C0]/30 disabled:cursor-not-allowed disabled:bg-[#2A2A2A] disabled:text-[#555555]"
            onClick={handleDeleteProduct}
            disabled={loading}
          >
            {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;