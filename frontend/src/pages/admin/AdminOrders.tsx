import { DeleteOrderDialog } from '@/components/DeleteOrderDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { findOrderBySku, getAllOrders, updateOrderStatus } from '@/lib/services';
import { IOrders } from '@/types/types';
import { Filter, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateStatus, setUpdateStatus] = useState('');

  const [orders, setOrders] = useState<IOrders[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updateStatusLoader, setUpdateStatusLoader] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getAllOrders(pageNumber, statusFilter);

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
  }, [statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      async function handleFindOrder(pageNumber = 1) {
        try {
          setLoading(true);
          const res = await findOrderBySku(pageNumber, searchTerm);
          setOrders(res.results);
          setCount(res.count);
          setPage(pageNumber);
        } catch (err) {
          console.error("Error getting orders", err);
        } finally {
          setLoading(false);
        }
      }

      if (searchTerm) {
        handleFindOrder();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  function frontendUpdateOrderStatus(id: number, updatedOrder: IOrders) {
    setOrders((orders: IOrders[]) =>
      orders.map((order) => (order.id == id ? updatedOrder : order))
    );
  }

  function frontendEndDeleteOrder(id: number) {
    setOrders((orders: IOrders[]) => orders.filter((order) => order.id != id));
  }

  async function handleUpdateOrderStatus(orderId: number, data: { status: string }) {
    setUpdateStatusLoader(true);
    try {
      const response = await updateOrderStatus(orderId, data);
      frontendUpdateOrderStatus(orderId, response);
      toast.success("Order status updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setUpdateStatusLoader(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Helmet>
        <title>Orders | SISAL Admin</title>
      </Helmet>

      <div className="space-y-6 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        <div className="rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-4 inline-flex rounded-full border border-[#C0C0C0]/18 bg-[#C0C0C0]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C0C0C0]">
            Fulfillment Control
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5]">
            Orders
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#C0C0C0]/65">
            Manage customer orders, fulfillment status, and operational review.
          </p>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
                  Order Management
                </CardTitle>
                <p className="mt-1 text-sm text-[#C0C0C0]/55">
                  Search by order ID and filter by fulfillment status.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C0C0C0]/45" />
                  <Input
                    placeholder="Search orders by ID."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-full border-[#C0C0C0]/14 bg-[#0B0B0B]/70 pl-10 pr-4 text-[#F5F5F5] placeholder:text-[#C0C0C0]/35 transition-all duration-300 focus-visible:border-[#C0C0C0]/45 focus-visible:ring-2 focus-visible:ring-[#C0C0C0]/15 md:w-72"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 w-full rounded-full border-[#C0C0C0]/14 bg-[#0B0B0B]/70 text-[#C0C0C0] transition-all duration-300 focus:ring-[#C0C0C0]/15 md:w-[190px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="border-[#C0C0C0]/14 bg-[#171717] text-[#F5F5F5]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="success">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C0C0C0]/10 hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Order ID
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Items
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Total
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Status
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-[#C0C0C0]/10 hover:bg-transparent"
                      >
                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex} className="px-6 py-5">
                            <div className="h-4 animate-pulse rounded-full bg-[#C0C0C0]/10" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-[#C0C0C0]/10 transition-colors duration-300 hover:bg-[#2A2A2A]/45"
                      >
                        <TableCell className="px-6 py-5 font-semibold text-[#F5F5F5]">
                          {order.sku}
                        </TableCell>

                        <TableCell className="px-6 py-5 text-[#C0C0C0]/70">
                          {formatDate(order.created_at)}
                        </TableCell>

                        <TableCell className="px-6 py-5">
                          <div className="space-y-1.5">
                            {order.orderitems.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium text-[#F5F5F5]">
                                  {item.product.name}
                                </span>
                                <span className="text-[#C0C0C0]/55">
                                  {" "}
                                  × {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5 font-semibold text-[#F5F5F5]">
                          {formatPrice(order.total_amount)}
                        </TableCell>

                        <TableCell className="px-6 py-5">
                          <Select
                            disabled={updateStatusLoader}
                            value={updateStatus || order.status}
                            onValueChange={async (value) => {
                              setUpdateStatus(value);
                              await handleUpdateOrderStatus(order.id, {
                                status: value,
                              });
                            }}
                          >
                            <SelectTrigger className="h-10 w-[150px] rounded-full border-[#C0C0C0]/14 bg-[#0B0B0B]/70 text-[#F5F5F5] transition-all duration-300 focus:ring-[#C0C0C0]/15">
                              <Badge
                                variant={getStatusVariant(order.status)}
                                className="flex items-center gap-1 rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/10 px-3 py-1 text-xs font-medium capitalize text-[#F5F5F5]"
                              >
                                {updateStatusLoader ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)
                                )}
                              </Badge>
                            </SelectTrigger>

                            <SelectContent className="border-[#C0C0C0]/14 bg-[#171717] text-[#F5F5F5]">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="success">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="px-6 py-5 text-right">
                          <DeleteOrderDialog
                            orderId={order.id}
                            frontendEndDeleteOrder={frontendEndDeleteOrder}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && orders.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto max-w-md rounded-3xl border border-[#C0C0C0]/12 bg-[#0B0B0B]/65 p-8">
                  <p className="font-medium text-[#F5F5F5]">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No orders found'
                      : 'No orders yet'}
                  </p>
                  <p className="mt-2 text-sm text-[#C0C0C0]/60">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No orders found matching your criteria.'
                      : 'No orders have been placed yet.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#C0C0C0]/10 px-6 py-5">
              <Button
                variant="outline"
                onClick={() => fetchOrders(page - 1)}
                disabled={!prev}
                className="rounded-full border-[#C0C0C0]/18 bg-[#171717] px-5 text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5] disabled:border-[#C0C0C0]/8 disabled:bg-[#171717]/60 disabled:text-[#C0C0C0]/25"
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  variant={page === index + 1 ? "default" : "outline"}
                  onClick={() => fetchOrders(index + 1)}
                  className={`h-10 w-10 rounded-full transition-all duration-300 ${
                    page === index + 1
                      ? "bg-[#C0C0C0] text-[#0B0B0B] hover:bg-[#F5F5F5]"
                      : "border-[#C0C0C0]/18 bg-[#171717] text-[#C0C0C0] hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5]"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => fetchOrders(page + 1)}
                disabled={!next}
                className="rounded-full border-[#C0C0C0]/18 bg-[#171717] px-5 text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5] disabled:border-[#C0C0C0]/8 disabled:bg-[#171717]/60 disabled:text-[#C0C0C0]/25"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminOrders;