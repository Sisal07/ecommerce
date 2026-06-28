import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import api from "@/lib/api";
import { Helmet } from "react-helmet-async";

interface Order {
  id: number;
  sku: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  growth_rate: string;
  low_stock_products: Product[];
  recent_orders: Order[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard-stats/");
        console.log("dashboard stats", res);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#0B0B0B] px-4 py-8 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-3">
            <div className="h-4 w-32 animate-pulse rounded-full bg-[#C0C0C0]/20" />
            <div className="h-10 w-64 animate-pulse rounded-2xl bg-[#C0C0C0]/15" />
            <div className="h-4 w-80 animate-pulse rounded-full bg-[#C0C0C0]/10" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-3xl border border-[#C0C0C0]/10 bg-[#171717] shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-3xl border border-[#C0C0C0]/10 bg-[#171717]" />
            <div className="h-80 animate-pulse rounded-3xl border border-[#C0C0C0]/10 bg-[#171717]" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[70vh] bg-[#0B0B0B] px-4 py-12 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#C0C0C0]/15 bg-[#171717] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <p className="text-lg font-semibold text-[#F5F5F5]">
            Failed to load dashboard.
          </p>
          <p className="mt-2 text-sm text-[#C0C0C0]/65">
            Please refresh the page or try again shortly.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: Package,
      description: "Active products in catalog",
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingCart,
      description: "Orders this month",
    },
    {
      title: "Revenue",
      value: formatPrice(stats.total_revenue),
      icon: DollarSign,
      description: "Total revenue this month",
    },
    {
      title: "Growth Rate",
      value: stats.growth_rate,
      icon: TrendingUp,
      description: "Compared to last month",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | SISAL Admin</title>
      </Helmet>

      <div className="min-h-screen bg-[#0B0B0B] px-4 py-8 font-['Inter','Poppins',sans-serif] text-[#F5F5F5] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="relative p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,192,192,0.14),transparent_34%),linear-gradient(135deg,rgba(245,245,245,0.06),transparent_42%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center rounded-full border border-[#C0C0C0]/18 bg-[#C0C0C0]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C0C0C0]">
                    Enterprise Control Center
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5] sm:text-5xl">
                    Dashboard
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#C0C0C0]/65 sm:text-base">
                    Monitor performance, revenue, stock health, and recent
                    activity across the SISAL administration workspace.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#C0C0C0]/12 bg-[#0B0B0B]/70 px-4 py-3 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C0C0C0]/18 bg-[#C0C0C0]/10">
                    <Users className="h-5 w-5 text-[#C0C0C0]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#C0C0C0]/55">Workspace</p>
                    <p className="text-sm font-semibold text-[#F5F5F5]">
                      SISAL Admin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="group overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C0C0C0]/35 hover:shadow-[0_30px_90px_rgba(0,0,0,0.4)]"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-3 pt-6">
                    <CardTitle className="text-sm font-medium text-[#C0C0C0]/65">
                      {stat.title}
                    </CardTitle>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C0C0C0]/14 bg-[#C0C0C0]/8 transition-all duration-300 group-hover:border-[#C0C0C0]/35 group-hover:bg-[#C0C0C0]/12">
                      <Icon className="h-5 w-5 text-[#C0C0C0]" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-xs text-[#C0C0C0]/55">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Orders */}
            <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold tracking-tight">
                    Recent Orders
                  </span>
                  <span className="rounded-full border border-[#C0C0C0]/14 bg-[#C0C0C0]/8 px-3 py-1 text-xs font-medium text-[#C0C0C0]">
                    Live feed
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-5">
                <div className="space-y-3">
                  {stats.recent_orders.length === 0 ? (
                    <div className="rounded-2xl border border-[#C0C0C0]/10 bg-[#0B0B0B]/70 p-6 text-center">
                      <p className="text-sm text-[#C0C0C0]/65">
                        No recent orders found.
                      </p>
                    </div>
                  ) : (
                    stats.recent_orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-3 rounded-2xl border border-[#C0C0C0]/10 bg-[#0B0B0B]/55 p-4 transition-all duration-300 hover:border-[#C0C0C0]/28 hover:bg-[#2A2A2A]/45 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold tracking-tight text-[#F5F5F5]">
                            {order.sku}
                          </p>
                          <p className="mt-1 text-sm text-[#C0C0C0]/55">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              order.status === "success"
                                ? "default"
                                : order.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/10 px-3 py-1 text-xs font-medium capitalize text-[#F5F5F5]"
                          >
                            {order.status}
                          </Badge>
                          <span className="font-semibold text-[#C0C0C0]">
                            {formatPrice(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C0C0C0]/14 bg-[#C0C0C0]/8">
                    <Package className="h-5 w-5 text-[#C0C0C0]" />
                  </span>
                  Low Stock Alert
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-5">
                {stats.low_stock_products.length === 0 ? (
                  <div className="rounded-2xl border border-[#C0C0C0]/10 bg-[#0B0B0B]/70 p-6 text-center">
                    <p className="font-medium text-[#F5F5F5]">
                      Inventory is healthy
                    </p>
                    <p className="mt-1 text-sm text-[#C0C0C0]/60">
                      All products are well stocked.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.low_stock_products.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col gap-3 rounded-2xl border border-[#C0C0C0]/10 bg-[#0B0B0B]/55 p-4 transition-all duration-300 hover:border-[#C0C0C0]/28 hover:bg-[#2A2A2A]/45 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold tracking-tight text-[#F5F5F5]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-[#C0C0C0]/55">
                            {product.category}
                          </p>
                        </div>

                        <Badge
                          variant={
                            product.quantity === 0 ? "destructive" : "secondary"
                          }
                          className="w-fit rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/10 px-3 py-1 text-xs font-medium text-[#F5F5F5]"
                        >
                          {product.quantity === 0
                            ? "Out of stock"
                            : `${product.quantity} left`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;