import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { verifyPayment } from "@/lib/services";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Helmet } from "react-helmet-async";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const { resetCart, toggleCartCode } = useCart();
  //   const status = searchParams.get("status");
  //   const isSuccess = status === "success";
  //   const isPending = !status || status === "pending";

  const reference = searchParams.get("reference");
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "pending"
  >("pending");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function handleVerifyPaymentStatus() {
      if (!reference) {
        setPaymentStatus("failed");
        return;
      }
      try {
        const response = await verifyPayment(reference);
        if (response.status === "success") {
          setPaymentStatus("success");
          localStorage.removeItem("cartCode");
          resetCart();
          toggleCartCode();
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
        setPaymentStatus("failed");
      }
    }

    handleVerifyPaymentStatus();
  }, [reference]);

  return (
    <>
      <Helmet>
        <title>Payment Status | SISAL</title>
      </Helmet>

      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)]" />

          <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <CardContent className="px-8 pb-8 pt-12">
              <div className="flex flex-col items-center space-y-6 text-center">
                {paymentStatus === "pending" ? (
                  <>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl" />
                      <Loader2 className="relative h-20 w-20 animate-spin text-[#D4AF37]" />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight text-white">
                        Processing Payment
                      </h1>
                      <p className="text-lg text-white/60">
                        Please wait while we confirm your payment
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                      <Progress
                        value={66}
                        className="h-2 w-full overflow-hidden rounded-full bg-white/10 [&>div]:bg-[#D4AF37]"
                      />
                      <p className="text-sm leading-relaxed text-white/55">
                        This usually takes just a few moments. Please don't
                        close this page.
                      </p>
                    </div>
                  </>
                ) : paymentStatus == "success" ? (
                  <>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl" />
                      <CheckCircle className="relative h-20 w-20 text-[#D4AF37]" />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight text-white">
                        Payment Successful!
                      </h1>
                      <p className="text-lg text-white/60">
                        Thank you for your purchase
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                      <p className="text-sm leading-relaxed text-white/55">
                        Your order has been confirmed and will be processed
                        shortly. You'll receive a confirmation email with your
                        order details.
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
                      <Button
                        asChild
                        className="flex-1 rounded-full bg-[#D4AF37] font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_12px_28px_rgba(212,175,55,0.24)]"
                      >
                        <Link to="/orders">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          View Orders
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 rounded-full border-[#D4AF37]/35 bg-transparent text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675]"
                      >
                        <Link to="/products">Continue Shopping</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
                      <div className="absolute inset-0 rounded-full bg-white/15 blur-2xl" />
                      <XCircle className="relative h-20 w-20 text-white/80" />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight text-white">
                        Payment Failed
                      </h1>
                      <p className="text-lg text-white/60">
                        Something went wrong
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                      <p className="text-sm leading-relaxed text-white/55">
                        We couldn't process your payment. Please check your
                        payment details and try again. If the problem persists,
                        contact your bank or try a different payment method.
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
                      <Button
                        asChild
                        className="flex-1 rounded-full bg-[#D4AF37] font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_12px_28px_rgba(212,175,55,0.24)]"
                      >
                        <Link to="/checkout">Try Again</Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 rounded-full border-[#D4AF37]/35 bg-transparent text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675]"
                      >
                        <Link to="/cart">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Link>
                      </Button>
                    </div>
                  </>
                )}

                <div className="w-full border-t border-[#D4AF37]/15 pt-6">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm text-white/55 transition-colors duration-300 hover:text-[#D4AF37]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PaymentStatusPage;