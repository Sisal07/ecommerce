import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useProductCart } from "@/hooks/useProductCart";
import { baseURL } from "@/lib/api";
import { getProductsBySlug } from "@/lib/services";
import { IProduct } from "@/types/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  RotateCcw,
  ShoppingCart,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { cartCode } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const { addedToCart, addToCartLoader, handleAddToCart, handleProductInCart } =
    useProductCart();

  const productId = product?.id;
  const productName = product?.name;

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoadingProduct(true);
      try {
        const response = await getProductsBySlug(slug);
        setProduct(response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching product:", err.message);
        }
      } finally {
        setLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (productId && cartCode) handleProductInCart(productId, cartCode);
  }, [productId, cartCode, handleProductInCart]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  if (loadingProduct) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#050505] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl animate-pulse" />
            <Loader2 className="relative z-10 h-10 w-10 animate-spin text-[#D4AF37]" />
          </div>

          <p className="mt-5 text-sm font-medium tracking-wide text-[#050505]/60">
            Loading product details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-20 text-center">
          <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/25 bg-[#050505] px-6 py-12 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <h1 className="mb-4 text-2xl font-bold tracking-tight">
              Product Not Found
            </h1>

            <Link to="/">
              <Button className="rounded-full bg-[#D4AF37] px-7 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675]">
                Return to Store
              </Button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | SISAL</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-white px-4 py-2 text-sm font-medium text-[#050505]/65 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#050505] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={`${baseURL}${product.image}`}
                    alt={product.name}
                    className="h-96 w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[500px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/35 via-transparent to-transparent" />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border border-[#D4AF37]/25 bg-[#050505] px-3 py-1 capitalize text-[#D4AF37]">
                    {product.category}
                  </Badge>

                  {product.featured && (
                    <Badge className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37] px-3 py-1 text-[#050505]">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#050505] lg:text-5xl">
                  {product.name}
                </h1>

                <div className="mb-5 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-full border border-[#D4AF37]/20 bg-[#050505] px-3 py-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
                      />
                    ))}
                    <span className="ml-2 text-sm text-white/60">
                      (4.5) 127 reviews
                    </span>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-[#050505]/60">
                  {product.description}
                </p>
              </div>

              <Separator className="bg-[#D4AF37]/20" />

              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-4xl font-bold tracking-tight text-[#D4AF37]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[#050505]/40 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                  <Badge className="rounded-full bg-[#050505] px-3 py-1 text-[#D4AF37]">
                    Save 20%
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#050505]/55">Stock:</span>
                  <Badge
                    className={`rounded-full px-3 py-1 ${
                      product.quantity > 10
                        ? "bg-[#050505] text-[#D4AF37]"
                        : product.quantity > 0
                        ? "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#050505]"
                        : "bg-[#050505]/10 text-[#050505]/55"
                    }`}
                  >
                    {product.quantity > 0
                      ? `${product.quantity} available`
                      : "Out of stock"}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-[#D4AF37]/20" />

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      handleAddToCart(productId!, productName!, cartCode)
                    }
                    disabled={
                      product.quantity === 0 || addToCartLoader || addedToCart
                    }
                    className="h-12 flex-1 rounded-full bg-[#D4AF37] text-base font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/35"
                  >
                    {addToCartLoader ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-5 w-5" />
                    )}
                    {addedToCart ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </div>

                <p className="text-sm text-[#050505]/55">
                  Free shipping on orders over $50 • 30-day return policy
                </p>
              </div>
            </div>
          </div>

          <Card className="mt-12 rounded-3xl border border-[#D4AF37]/20 bg-[#050505] p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <h3 className="mb-5 text-xl font-semibold tracking-tight">
              Product Features
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Package className="h-6 w-6 text-[#D4AF37]" />,
                  title: "Fast Shipping",
                  desc: "Free 2-day shipping on orders over $50",
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-[#D4AF37]" />,
                  title: "Premium Quality",
                  desc: "Carefully selected premium materials",
                },
                {
                  icon: <RotateCcw className="h-6 w-6 text-[#D4AF37]" />,
                  title: "Easy Returns",
                  desc: "30-day hassle-free return policy",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.04] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/10"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                    {feature.icon}
                  </div>
                  <h4 className="mb-2 font-semibold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/55">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;