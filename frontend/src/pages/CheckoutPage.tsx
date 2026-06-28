import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { baseURL } from "@/lib/api";
import {
  createShippingAddress,
  getShippingInfo,
  initiatePayment,
} from "@/lib/services";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type ShippingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

const CheckoutPage = () => {
  const { cart, cartTotal, cartitemCount, cartCode } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  useEffect(() => {
    async function handleGetShippingInfo() {
      try {
        const response = await getShippingInfo();
        setValue("firstName", response.first_name);
        setValue("lastName", response.last_name);
        setValue("email", response.email);
        setValue("address", response.address);
        setValue("city", response.city);
        setValue("state", response.state);
        setValue("zipCode", response.zip_code);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error getting user's shipping info", err.message);
        }
      }
    }

    handleGetShippingInfo();
  }, [setValue]);

  async function handleCreateShippingAddress(data: ShippingFormData) {
    setIsProcessing(true);
    try {
      await createShippingAddress(data);
      toast.success("Shipping address successfully saved!");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleInitializePayment() {
    setIsProcessing(true);
    try {
      const response = await initiatePayment({ cart_code: cartCode });
      if (response.access_code && response.authorization_url) {
        window.location.href = response.authorization_url;
      }
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        throw new Error(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  const onSubmit = async (data: ShippingFormData) => {
    setIsProcessing(true);
    try {
      await handleCreateShippingAddress(data);
      await handleInitializePayment();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.cartitems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-12 text-center">
          <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/25 bg-[#050505] px-6 py-12 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <h1 className="mb-4 text-2xl font-bold tracking-tight">
              Your cart is empty
            </h1>
            <Link to="/">
              <Button className="rounded-full bg-[#D4AF37] px-7 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675]">
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
        <title>Checkout | SISAL</title>
      </Helmet>

      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="mb-6 inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-white px-4 py-2 text-sm font-medium text-[#050505]/65 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                <CardHeader className="border-b border-[#D4AF37]/15 bg-[#050505] px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                      <Lock className="h-5 w-5 text-[#D4AF37]" />
                    </span>
                    Secure Checkout
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 py-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Shipping Information */}
                    <div className="space-y-5">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                          Delivery Details
                        </p>
                        <h3 className="text-lg font-semibold tracking-tight text-[#050505]">
                          Shipping Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm text-[#050505]/70"
                          >
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                            className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-[#B45309]">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm text-[#050505]/70"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                            className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-[#B45309]">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm text-[#050505]/70"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            },
                          })}
                          className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-[#B45309]">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm text-[#050505]/70"
                        >
                          Address
                        </Label>
                        <Input
                          id="address"
                          {...register("address", {
                            required: "Address is required",
                          })}
                          className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-[#B45309]">
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor="city"
                            className="text-sm text-[#050505]/70"
                          >
                            City
                          </Label>
                          <Input
                            id="city"
                            {...register("city", {
                              required: "City is required",
                            })}
                            className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                          />
                          {errors.city && (
                            <p className="mt-1 text-sm text-[#B45309]">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="state"
                            className="text-sm text-[#050505]/70"
                          >
                            State
                          </Label>
                          <Input
                            id="state"
                            {...register("state", {
                              required: "State is required",
                            })}
                            className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                          />
                          {errors.state && (
                            <p className="mt-1 text-sm text-[#B45309]">
                              {errors.state.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="zipCode"
                            className="text-sm text-[#050505]/70"
                          >
                            ZIP Code
                          </Label>
                          <Input
                            id="zipCode"
                            {...register("zipCode", {
                              required: "ZIP Code is required",
                            })}
                            className="h-11 rounded-xl border-[#D4AF37]/25 bg-white text-[#050505] transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                          />
                          {errors.zipCode && (
                            <p className="mt-1 text-sm text-[#B45309]">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-[#D4AF37] text-base font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/35"
                      disabled={isProcessing}
                    >
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isProcessing
                        ? "Processing..."
                        : `Place Order - ${formatPrice(finalTotal)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
                <CardHeader className="border-b border-[#D4AF37]/15 px-6 py-5">
                  <CardTitle className="text-xl font-semibold tracking-tight text-white">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 px-6 py-6">
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#D4AF37]/40 hover:scrollbar-thumb-[#D4AF37]/70 scrollbar-track-transparent">
                    {cart.cartitems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/15 bg-white/[0.04] p-3"
                      >
                        <img
                          src={`${baseURL}${item.product.image}`}
                          alt={item.product.name}
                          className="h-14 w-14 rounded-xl border border-[#D4AF37]/20 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-white/50">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#D4AF37]">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-[#D4AF37]/20" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Subtotal ({cartitemCount} items)</span>
                      <span className="font-medium text-white">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-white/60">
                      <span>Shipping</span>
                      <span
                        className={
                          shipping === 0
                            ? "font-medium text-[#D4AF37]"
                            : "font-medium text-white"
                        }
                      >
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-white/60">
                      <span>Tax</span>
                      <span className="font-medium text-white">
                        {formatPrice(tax)}
                      </span>
                    </div>

                    <Separator className="bg-[#D4AF37]/20" />

                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3 text-center text-sm text-white/70">
                    <Lock className="mr-2 inline h-4 w-4 text-[#D4AF37]" />
                    Your payment information is secure and encrypted
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

export default CheckoutPage;