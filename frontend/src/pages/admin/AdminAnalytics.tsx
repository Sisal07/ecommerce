import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "@/lib/api";
import { Helmet } from "react-helmet-async";

// ---------- Type Definitions ----------
interface Metrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  conversion_rate: number;
}

interface SalesDataPoint {
  month: string;
  sales: number;
  orders: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface AnalyticsData {
  metrics: Metrics;
  sales_data: SalesDataPoint[];
  category_data: CategoryDataPoint[];
  top_products: TopProduct[];
}

// ---------- Component ----------
const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/");
        setData(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#0B0B0B] px-4 py-8 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <div className="space-y-8">
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
            <div className="h-96 animate-pulse rounded-3xl border border-[#C0C0C0]/10 bg-[#171717]" />
            <div className="h-96 animate-pulse rounded-3xl border border-[#C0C0C0]/10 bg-[#171717]" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- Error State ----------
  if (error || !data) {
    return (
      <div className="min-h-[70vh] bg-[#0B0B0B] px-4 py-12 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#C0C0C0]/15 bg-[#171717] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <p className="text-lg font-semibold text-[#F5F5F5]">
            {error || "Failed to load data"}
          </p>
          <p className="mt-2 text-sm text-[#C0C0C0]/65">
            Please refresh the page or try again shortly.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Safe data extraction with fallbacks ----------
  const metrics = data.metrics || {
    total_revenue: 0,
    total_orders: 0,
    average_order_value: 0,
    conversion_rate: 0,
  };

  const salesData = data.sales_data || [];
  const categoryData = data.category_data || [];
  const topProducts = data.top_products || [];

  const metricCards = [
    {
      title: "Total Revenue",
      value: formatPrice(metrics.total_revenue),
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: metrics.total_orders.toString(),
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Average Order Value",
      value: formatPrice(metrics.average_order_value),
      change: "+4.3%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversion_rate}%`,
      change: "-0.5%",
      isPositive: false,
      icon: Users,
    },
  ];

  // ---------- Render ----------
  return (
    <>
      <Helmet>
        <title>Analytics | SISAL Admin</title>
      </Helmet>

      <div className="space-y-6 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        {/* Header */}
        <div className="rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-4 inline-flex rounded-full border border-[#C0C0C0]/18 bg-[#C0C0C0]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C0C0C0]">
            Intelligence Layer
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5]">
            Analytics
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#C0C0C0]/65">
            Track store performance, revenue movement, order volume, and
            category insights.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.title}
                className="group overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C0C0C0]/35 hover:shadow-[0_30px_90px_rgba(0,0,0,0.4)]"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-3 pt-6">
                  <CardTitle className="text-sm font-medium text-[#C0C0C0]/65">
                    {metric.title}
                  </CardTitle>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C0C0C0]/14 bg-[#C0C0C0]/8 transition-all duration-300 group-hover:border-[#C0C0C0]/35 group-hover:bg-[#C0C0C0]/12">
                    <Icon className="h-5 w-5 text-[#C0C0C0]" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
                    {metric.value}
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    {metric.isPositive ? (
                      <TrendingUp className="mr-1 h-3.5 w-3.5 text-[#C0C0C0]" />
                    ) : (
                      <TrendingDown className="mr-1 h-3.5 w-3.5 text-[#C0C0C0]/70" />
                    )}
                    <span className="font-medium text-[#C0C0C0]">
                      {metric.change}
                    </span>
                    <span className="ml-1 text-[#C0C0C0]/55">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales Trend */}
          <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-6 sm:px-6">
              {salesData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-[#C0C0C0]/40">
                  No sales data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(192,192,192,0.12)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(192,192,192,0.55)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(192,192,192,0.55)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatPrice(Number(value)),
                        "Sales",
                      ]}
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid rgba(192,192,192,0.18)",
                        borderRadius: "16px",
                        color: "#F5F5F5",
                        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
                      }}
                      labelStyle={{ color: "#C0C0C0" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#C0C0C0"
                      strokeWidth={3}
                      dot={{
                        fill: "#C0C0C0",
                        stroke: "#0B0B0B",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6, fill: "#F5F5F5", stroke: "#C0C0C0" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-6 sm:px-6">
              {categoryData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-[#C0C0C0]/40">
                  No category data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={86}
                      dataKey="value"
                      label={({ name, percent }) => {
                        if (percent === undefined) return name;
                        return `${name} ${(percent * 100).toFixed(0)}%`;
                      }}
                      labelLine={false}
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#C0C0C0",
                              "#F5F5F5",
                              "#8A8A8A",
                              "#5F5F5F",
                              "#2A2A2A",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid rgba(192,192,192,0.18)",
                        borderRadius: "16px",
                        color: "#F5F5F5",
                        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Products & Monthly Orders */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5">
              {topProducts.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-[#C0C0C0]/40">
                  No product data available
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#C0C0C0]/10 bg-[#0B0B0B]/55 p-4 transition-all duration-300 hover:border-[#C0C0C0]/28 hover:bg-[#2A2A2A]/45"
                    >
                      <div className="flex min-w-0 items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/10 text-[#F5F5F5]"
                        >
                          {index + 1}
                        </Badge>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#F5F5F5]">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#C0C0C0]/55">
                            {product.sold} sold
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 font-semibold text-[#C0C0C0]">
                        {formatPrice(product.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Orders */}
          <Card className="overflow-hidden rounded-3xl border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Monthly Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-6 sm:px-6">
              {salesData.length === 0 ? (
                <div className="flex h-[250px] items-center justify-center text-[#C0C0C0]/40">
                  No order data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(192,192,192,0.12)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(192,192,192,0.55)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(192,192,192,0.55)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid rgba(192,192,192,0.18)",
                        borderRadius: "16px",
                        color: "#F5F5F5",
                        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
                      }}
                      labelStyle={{ color: "#C0C0C0" }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#C0C0C0"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;