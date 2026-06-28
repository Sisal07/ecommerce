import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getUserOrders } from "@/lib/services";
import { IOrders } from "@/types/types";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;
  const totalPages = Math.ceil(count / pageSize);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
      case "processing":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getUserOrders(pageNumber);

      setOrders(res.results);
      setCount(res.count);
      setNext(res.next);
      setPrev(res.previous);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
      {/* Fixed Navbar */}
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#D4AF37]/25 bg-[#050505]/95 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <Navbar />
      </header>

      <main className="container mx-auto flex-grow px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-white px-4 py-2 text-sm font-medium text-[#050505]/65 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Link>

        <div className="mb-8 rounded-3xl border border-[#D4AF37]/20 bg-[#050505] px-6 py-8 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            SISAL Orders
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Order History
          </h1>
          <p className="text-white/60">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#050505] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            </div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <CardContent className="px-6 py-14 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <Package className="h-10 w-10 text-[#D4AF37]" />
              </div>

              <h3 className="mb-2 text-xl font-semibold tracking-tight">
                No orders yet
              </h3>
              <p className="mb-6 text-white/60">
                You haven't placed any orders yet.
              </p>

              <Link to="/">
                <Button className="rounded-full bg-[#D4AF37] px-7 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)]">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
                >
                  <CardHeader className="border-b border-[#D4AF37]/15 bg-[#050505] px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                            <Package className="h-5 w-5 text-[#D4AF37]" />
                          </span>
                          <span className="text-xl font-semibold tracking-tight">
                            Order {order.sku}
                          </span>
                        </CardTitle>
                        <p className="mt-2 text-sm text-white/55">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <Badge
                          variant={getStatusVariant(order.status)}
                          className="mb-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold capitalize text-[#D4AF37]"
                        >
                          {order.status}
                        </Badge>
                        <p className="text-lg font-bold text-[#D4AF37]">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-5">
                    <div className="space-y-3">
                      {order.orderitems.map((item, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 border-b border-[#D4AF37]/15 py-3 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[#050505]">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-[#050505]/55">
                              Quantity: {item.quantity} ×{" "}
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="shrink-0 font-semibold text-[#050505]">
                            {formatPrice(item.quantity * item.product.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-4 border-t border-[#D4AF37]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#D4AF37]/35 bg-white text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#D4AF37]/35 bg-white text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
                          >
                            Reorder
                          </Button>
                        )}
                      </div>

                      <div className="rounded-full border border-[#D4AF37]/20 bg-[#050505] px-4 py-2 text-sm font-medium text-[#D4AF37]">
                        {order.status === "delivered" && "✓ Delivered"}
                        {order.status === "shipped" && "In Transit"}
                        {order.status === "success" && "Processing"}
                        {order.status === "cancelled" && "Cancelled"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => fetchOrders(page - 1)}
                disabled={!prev}
                className="rounded-full border-[#D4AF37]/35 bg-white px-5 text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37] disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
              >
                Prev
              </Button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  variant={page === index + 1 ? "default" : "outline"}
                  onClick={() => fetchOrders(index + 1)}
                  className={`h-10 w-10 rounded-full transition-all duration-300 ${
                    page === index + 1
                      ? "bg-[#D4AF37] text-[#050505] hover:bg-[#F2D675]"
                      : "border-[#D4AF37]/35 bg-white text-[#050505] hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37]"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => fetchOrders(page + 1)}
                disabled={!next}
                className="rounded-full border-[#D4AF37]/35 bg-white px-5 text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37] disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;