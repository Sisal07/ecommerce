import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  HelpCircle,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  RotateCcw,
  Ruler,
  Search,
  ShieldCheck,
  Truck,
  FileText,
  Accessibility,
} from "lucide-react";

const quickLinks = [
  {
    title: "About Us",
    icon: Home,
    content:
      "SISAL stands for Secure Instant Shopping And Lifestyle. We are an online shopping store focused on offering a smooth, secure, and premium shopping experience for everyday lifestyle products.",
  },
  {
    title: "Contact",
    icon: Mail,
    content:
      "You can contact SISAL support by phone at +977 980-1234567 or by email at support@sisal.com.np. Our location is Nepathya College, Bhairahawa, Rupandehi, Nepal.",
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    content:
      "Common questions include account setup, product availability, order tracking, payment confirmation, shipping time, and returns. If your answer is not listed, contact our support team.",
  },
  {
    title: "Shipping Info",
    icon: Truck,
    content:
      "We process orders as quickly as possible after successful payment. Shipping time may vary by location. Orders above $50 are eligible for free shipping where available.",
  },
  {
    title: "Returns",
    icon: RotateCcw,
    content:
      "Items can be returned within 30 days if they are unused, undamaged, and in original condition. Return approval may depend on product type and order status.",
  },
  {
    title: "Size Guide",
    icon: Ruler,
    content:
      "For clothing and lifestyle products, always check product details before ordering. Compare your usual size with the product description, category notes, and available stock information.",
  },
];

const customerService = [
  {
    title: "Help Center",
    icon: HelpCircle,
    content:
      "The SISAL Help Center supports account questions, shopping issues, payment concerns, delivery updates, returns, and product information.",
  },
  {
    title: "Track Your Order",
    icon: PackageSearch,
    content:
      "After placing an order, you can check your order history to review status updates such as processing, shipped, delivered, or cancelled.",
  },
  {
    title: "Live Chat",
    icon: MessageCircle,
    content:
      "Live chat support is intended for quick help with shopping, orders, payments, and account access. If live chat is unavailable, email support is the best alternative.",
  },
  {
    title: "Privacy Policy",
    icon: ShieldCheck,
    content:
      "SISAL respects your privacy. Customer information is used for account access, order processing, payment confirmation, delivery support, and improving the shopping experience.",
  },
  {
    title: "Terms of Service",
    icon: FileText,
    content:
      "By using SISAL, customers agree to use the store responsibly, provide accurate order information, complete valid payments, and follow return and service policies.",
  },
  {
    title: "Accessibility",
    icon: Accessibility,
    content:
      "SISAL aims to keep the shopping experience clean, readable, responsive, and easy to navigate across devices for all customers.",
  },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)]" />

        <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-300 group-hover:scale-105">
                <span className="text-xl font-bold text-[#050505]">S</span>
              </div>
              <div className="leading-tight">
                <span className="block text-xl font-bold tracking-tight">
                  SISAL
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] sm:block">
                  Secure Instant Shopping And Lifestyle
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-white px-4 py-2 text-sm font-medium text-[#050505]/70 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="mb-8 rounded-3xl border border-[#D4AF37]/25 bg-[#050505] p-7 text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)] sm:p-10">
            <div className="mb-6 inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              Information Page
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              SISAL Help & Information
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-white/60">
              Welcome to the "I Need Help" headquarters. Whether you're tracking an order, decoding our policies, or just wondering if we actually answer emails (we do), you'll find it all right here.
            </p>

            

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/" className="w-full sm:w-auto">
                <button className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#D4AF37] px-6 text-sm font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)] sm:w-auto">
                  Return to Store
                </button>
              </Link>

              <Link to="/products" className="w-full sm:w-auto">
                <button className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#D4AF37]/35 bg-transparent px-6 text-sm font-semibold text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675] sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Products
                </button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-[#D4AF37]/20 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:p-6">
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Quick Links
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Store Information
                </h2>
              </div>

              <div className="space-y-4">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-[#D4AF37]/15 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/45 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10">
                          <Icon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <h3 className="font-semibold text-[#050505]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-[#050505]/60">
                        {item.content}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-[#D4AF37]/20 bg-[#050505] p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] sm:p-6">
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Customer Service
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Support Details
                </h2>
              </div>

              <div className="space-y-4">
                {customerService.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/10"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10">
                          <Icon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">
                        {item.content}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-3xl border border-[#D4AF37]/20 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:p-6">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                Contact Details
              </p>
              <h2 className="text-2xl font-bold tracking-tight">
                Need direct help?
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-4">
                <Phone className="mb-3 h-5 w-5 text-[#D4AF37]" />
                <p className="text-sm font-semibold">Phone</p>
                <p className="text-sm text-[#050505]/55">+977 980-1234567</p>
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-4">
                <Mail className="mb-3 h-5 w-5 text-[#D4AF37]" />
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-[#050505]/55">
                  support@sisal.com.np
                </p>
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-4">
                <MapPin className="mb-3 h-5 w-5 text-[#D4AF37]" />
                <p className="text-sm font-semibold">Address</p>
                <p className="text-sm text-[#050505]/55">
                  Nepathya College, Bhairahawa, Rupandehi, Nepal
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default NotFound;