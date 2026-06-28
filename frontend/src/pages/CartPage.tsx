import CartitemCard from "@/components/CartitemCard";
import CartLoader from "@/components/CartLoader";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/services";
import { ICartitems } from "@/types/types";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, cartTotal, cartitemCount, loading } = useCart();

  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  if (loading) {
    return <CartLoader />;
  }

  if (cart.cartitems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/25 bg-[#050505] px-6 py-14 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
              <ShoppingBag className="h-11 w-11 text-[#D4AF37]" />
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight">
              Your cart is empty
            </h1>

            <p className="mx-auto mb-8 max-w-sm text-white/60">
              Looks like you haven't added any products to your cart yet.
            </p>

            <Link to="/">
              <Button
                size="lg"
                className="rounded-full bg-[#D4AF37] px-7 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)]"
              >
                Continue Shopping
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
        <title>Cart | SISAL</title>
      </Helmet>

      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-white px-4 py-2 text-sm font-medium text-[#050505]/65 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                <CardHeader className="border-b border-[#D4AF37]/15 bg-[#050505] px-6 py-5">
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="text-xl font-semibold tracking-tight">
                      Shopping Cart
                    </span>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-sm font-medium text-[#D4AF37]">
                      {cartitemCount} items
                    </span>
                  </CardTitle>
                </CardHeader>

                {/* Scrollable cart items container */}
                <CardContent
                  className="
                    max-h-[500px]
                    space-y-1
                    overflow-y-auto
                    px-5 py-2
                    scrollbar-thin
                    scrollbar-thumb-[#D4AF37]/40
                    hover:scrollbar-thumb-[#D4AF37]/70
                    scrollbar-track-transparent
                  "
                >
                  {cart.cartitems.map((item: ICartitems) => (
                    <CartitemCard key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
                <CardHeader className="border-b border-[#D4AF37]/15 px-6 pb-4 pt-6">
                  <CardTitle className="text-xl font-semibold tracking-tight text-white">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 px-6 py-6 text-sm sm:text-base">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Subtotal ({cartitemCount} items)</span>
                    <span className="font-medium text-white">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-white/60">
                    <span>Shipping</span>
                    <span
                      className={`font-medium ${
                        shipping === 0 ? "text-[#D4AF37]" : "text-white"
                      }`}
                    >
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-white/60">
                    <span>Tax</span>
                    <span className="font-medium text-white">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  <Separator className="my-2 bg-[#D4AF37]/20" />

                  <div className="flex items-center justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span className="text-xl font-bold text-[#D4AF37]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {cartTotal < 50 && (
                    <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.05] p-3 text-center text-sm text-white/60">
                      Add{" "}
                      <span className="font-semibold text-white">
                        {formatPrice(50 - cartTotal)}
                      </span>{" "}
                      more to enjoy{" "}
                      <span className="font-medium text-[#D4AF37]">
                        FREE shipping!
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Link to="/checkout" className="block w-full">
                      <Button
                        size="lg"
                        className="w-full rounded-full bg-[#D4AF37] text-base font-semibold text-[#050505] transition-all duration-300 hover:scale-[1.02] hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)]"
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Link to="/" className="block w-full">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full rounded-full border-[#D4AF37]/35 bg-transparent text-base font-medium text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675]"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;