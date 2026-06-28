import { Link } from "react-router-dom";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { IProduct } from "@/types/types";
import { baseURL } from "@/lib/api";
import { useProductCart } from "@/hooks/useProductCart";
import { useEffect } from "react";

interface Props {
  product: IProduct;
}

export const ProductCard = ({ product }: Props) => {
  const { cartCode } = useCart();
  const productId = product?.id;
  const productName = product?.name;

  const {
    addedToCart,
    addToCartLoader,
    handleAddToCart,
    handleProductInCart,
  } = useProductCart();

  useEffect(() => {
    handleProductInCart(productId, cartCode);
  }, [productId, cartCode, handleProductInCart]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#050505] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/55 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)] font-['Inter','Poppins',sans-serif]">
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden bg-white/[0.04]">
          <img
            src={`${baseURL}${product.image}`}
            alt={product.name}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/45 via-transparent to-transparent opacity-80" />

          {product.featured && (
            <Badge className="absolute left-3 top-3 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#050505] shadow-[0_8px_20px_rgba(212,175,55,0.24)]">
              Featured
            </Badge>
          )}

          {product.quantity < 10 && product.quantity > 0 && (
            <Badge
              variant="secondary"
              className="absolute right-3 top-3 rounded-full border border-[#D4AF37]/35 bg-[#050505]/80 px-3 py-1 text-[11px] font-medium text-[#F2D675] backdrop-blur"
            >
              Low Stock
            </Badge>
          )}

          {product.quantity === 0 && (
            <Badge
              variant="destructive"
              className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/90 px-3 py-1 text-[11px] font-medium text-[#050505]"
            >
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <Link to={`/product/${product.slug}`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[#D4AF37]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm capitalize text-white/50">
                {product.category}
              </p>
            </div>

            <div className="flex shrink-0 items-center rounded-full border border-[#D4AF37]/25 bg-white/[0.04] px-2.5 py-1">
              <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="ml-1 text-xs font-medium text-white/65">4.5</span>
            </div>
          </div>
        </Link>

        <Link to={`/product/${product.slug}`}>
          <p className="mb-5 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/70">
            {product.description}
          </p>
        </Link>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-2xl font-bold tracking-tight text-[#D4AF37]">
              {formatPrice(product.price)}
            </span>
            <span className="mt-1 text-xs text-white/45">
              {product.quantity} in stock
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => handleAddToCart(productId, productName, cartCode)}
            disabled={product.quantity === 0 || addToCartLoader || addedToCart}
            className="h-10 shrink-0 rounded-full bg-[#D4AF37] px-4 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_10px_24px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
          >
            {addToCartLoader ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {addedToCart ? "In Cart" : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};