import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { baseURL } from "@/lib/api";
import {
  addProduct,
  generateAIDescription,
  getProduct,
  toSnakeCase,
  updateProduct,
} from "@/lib/services";
import { IProduct } from "@/types/types";
import { Edit, Loader2, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Health and Beauty",
  "Food",
  "Toys and Games",
];

interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image: FileList;
  featured: boolean;
}

interface Props {
  frontendPopulateProduct?: (newProduct: IProduct) => void;
  editProduct?: boolean;
  productId?: number;
  frontendUpdateProduct?: (id: number, obj: IProduct) => void;
}

export const AddProductDialog = ({
  frontendPopulateProduct,
  editProduct,
  productId,
  frontendUpdateProduct,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generateDescriptionLoader, setGenerateDescriptionLoader] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      quantity: 0,
      description: "",
      featured: false,
    },
    mode: "onChange",
  });

  const formValues = watch();

  // 🚀 Generate AI Description
  const generateDescription = async () => {
    if (!formValues.name) {
      toast.error("Please enter product name first.");
      return;
    }

    setGenerateDescriptionLoader(true);

    try {
      const response = await generateAIDescription({ name: formValues.name });
      setValue("description", response.description);
      toast.message("Description Generated!", {
        description: "AI-powered product description has been created.",
      });
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setGenerateDescriptionLoader(false);
    }
  };

  // 🟢 Add Product
  const handleAddProduct = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await addProduct(data);
      frontendPopulateProduct?.(response);
      toast.success(`✅ Product "${response.name}" created successfully!`);
      setOpen(false);
      reset();
      setPreview("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "❌ Failed to add product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟡 Update Product
  const handleUpdateProduct = async (data: FormData) => {
    if (!productId) return;

    setIsSubmitting(true);
    try {
      const response = await updateProduct(productId, data);
      frontendUpdateProduct?.(productId, response);
      toast.success(`✅ Product "${response.name}" updated successfully!`);
      setOpen(false);
      reset();
      setPreview("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "❌ Failed to update product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Submit Handler
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price.toString());
    formData.append("quantity", data.quantity.toString());
    formData.append("minimumStock", "1");
    formData.append("description", data.description);
    formData.append("featured", data.featured.toString());

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    if (editProduct) {
      handleUpdateProduct(formData);
    } else {
      handleAddProduct(formData);
    }
  };

  // 📌 Fetch Existing Product in Edit mode
  const handleGetProduct = async () => {
    if (!productId) return;

    try {
      const response = await getProduct(productId);
      reset(response);
      setPreview(response.image ? `${baseURL}${response.image}` : "");
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (editProduct && productId) handleGetProduct();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editProduct ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#C0C0C0] hover:text-white hover:bg-[#2A2A2A] transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="bg-[#C0C0C0] text-[#0B0B0B] hover:bg-[#D8D8D8] shadow-lg shadow-[#C0C0C0]/20 transition-all duration-300 hover:shadow-[#C0C0C0]/40">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl p-0 bg-[#171717] border border-[#2A2A2A] shadow-2xl shadow-[#0B0B0B]/80">
        {/* Header with glassmorphism */}
        <DialogHeader className="p-6 border-b border-[#2A2A2A] bg-[#171717]/80 backdrop-blur-sm sticky top-0 z-10 rounded-t-2xl">
          <DialogTitle className="flex items-center gap-3 text-xl font-light tracking-wide text-[#F5F5F5]">
            <div className="w-9 h-9 bg-gradient-to-br from-[#C0C0C0] to-[#E8E8E8] rounded-lg flex items-center justify-center shadow-sm shadow-[#C0C0C0]/20">
              {editProduct ? (
                <Edit className="w-5 h-5 text-[#0B0B0B]" />
              ) : (
                <Plus className="w-5 h-5 text-[#0B0B0B]" />
              )}
            </div>
            {editProduct ? "Update Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-[#A0A0A0] text-sm font-light">
            {editProduct
              ? "Modify the details of this product and save your changes."
              : "Create a new product listing for your store."}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#171717]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="product-form"
            className="space-y-6"
          >
            {/* Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#555555] focus:border-[#C0C0C0] focus:ring-[#C0C0C0]/30 transition-all duration-200"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                  Category *
                </Label>
                <Select
                  value={formValues.category}
                  onValueChange={(value) =>
                    setValue("category", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] focus:border-[#C0C0C0] focus:ring-[#C0C0C0]/30 transition-all duration-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171717] border-[#2A2A2A] text-[#F5F5F5]">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={toSnakeCase(cat)} className="focus:bg-[#2A2A2A] focus:text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-rose-400 text-xs mt-1">Category is required</p>
                )}
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#555555] focus:border-[#C0C0C0] focus:ring-[#C0C0C0]/30 transition-all duration-200"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
                {errors.price && (
                  <p className="text-rose-400 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#555555] focus:border-[#C0C0C0] focus:ring-[#C0C0C0]/30 transition-all duration-200"
                  {...register("quantity", {
                    required: "Stock quantity is required",
                    min: { value: 1, message: "Stock must be at least 1" },
                  })}
                />
                {errors.quantity && (
                  <p className="text-rose-400 text-xs mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                Product Image *
              </Label>
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#2A2A2A] file:text-[#C0C0C0] hover:file:bg-[#3A3A3A] transition-colors duration-200 cursor-pointer"
                  {...register("image", {
                    required: !editProduct ? "Product image is required" : false,
                  })}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              {errors.image && (
                <p className="text-rose-400 text-xs mt-1">{errors.image.message}</p>
              )}

              {preview && (
                <div className="mt-3 relative group w-32 h-32 rounded-lg overflow-hidden border border-[#2A2A2A] shadow-md shadow-[#0B0B0B]/50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0B0B0B]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-[#F5F5F5] text-xs bg-[#0B0B0B]/80 px-2 py-1 rounded-full">Preview</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-[#C0C0C0] text-sm font-medium tracking-wide">
                  Product Description
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={generateDescriptionLoader}
                  className="border-[#2A2A2A] text-[#C0C0C0] hover:bg-[#2A2A2A] hover:text-white transition-all duration-200"
                >
                  {generateDescriptionLoader ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Generate with AI
                </Button>
              </div>

              <Textarea
                id="description"
                rows={4}
                placeholder="Enter product description..."
                className="bg-[#0B0B0B] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#555555] focus:border-[#C0C0C0] focus:ring-[#C0C0C0]/30 transition-all duration-200 resize-none"
                {...register("description")}
              />
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="featured"
                checked={formValues.featured}
                onCheckedChange={(checked) => setValue("featured", !!checked)}
                className="border-[#2A2A2A] data-[state=checked]:bg-[#C0C0C0] data-[state=checked]:border-[#C0C0C0] data-[state=checked]:text-[#0B0B0B] transition-all duration-200"
              />
              <Label htmlFor="featured" className="text-[#C0C0C0] text-sm font-medium tracking-wide cursor-pointer">
                Mark as featured
              </Label>
            </div>
          </form>
        </div>

        {/* Footer with glassmorphism */}
        <DialogFooter className="p-4 border-t border-[#2A2A2A] bg-[#171717]/80 backdrop-blur-sm sticky bottom-0 z-10 rounded-b-2xl flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#2A2A2A] text-[#C0C0C0] hover:bg-[#2A2A2A] hover:text-white transition-all duration-200"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="min-w-[120px] bg-[#C0C0C0] text-[#0B0B0B] hover:bg-[#D8D8D8] shadow-lg shadow-[#C0C0C0]/20 transition-all duration-300 hover:shadow-[#C0C0C0]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            {editProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};