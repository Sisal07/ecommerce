import { AddProductDialog } from "@/components/AddProductDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/api";
import { adminProductSearch, getProducts } from "@/lib/services";
import { IProduct } from "@/types/types";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(count / pageSize);

  // ---------- Unified fetch function ----------
  const fetchProducts = async (pageNum: number, search: string = "") => {
    setLoading(true);
    try {
      let response;
      if (search.trim()) {
        response = await adminProductSearch(pageNum, search);
      } else {
        response = await getProducts(pageNum);
      }
      setProducts(response.results);
      setCount(response.count);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Initial load ----------
  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  // ---------- Debounced search ----------
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ---------- Handlers for pagination ----------
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProducts(newPage, searchTerm);
  };

  // ---------- Helper functions ----------
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const frontendPopulateProduct = (newProduct: IProduct) => {
    setProducts([newProduct, ...products]);
  };

  const frontendUpdateProduct = (id: number, obj: IProduct) => {
    setProducts((curr) =>
      curr.map((product) => (product.id === id ? obj : product))
    );
  };

  const frontendDeleteProduct = (id: number) => {
    setProducts((items) => items.filter((item: IProduct) => item.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Products Inventory | SISAL Admin</title>
      </Helmet>

      <div className="space-y-6 font-['Inter','Poppins',sans-serif] text-[#F5F5F5]">
        {/* Header */}
        <div className="flex flex-col gap-5 rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-[#C0C0C0]/18 bg-[#C0C0C0]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C0C0C0]">
              Inventory Control
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5]">
              Products
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C0C0C0]/65">
              Manage catalog items, stock levels, pricing, and product visibility.
            </p>
          </div>

          <AddProductDialog frontendPopulateProduct={frontendPopulateProduct} />
        </div>

        {/* Table Card */}
        <Card className="overflow-hidden rounded-[2rem] border border-[#C0C0C0]/12 bg-[#171717] text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-[#C0C0C0]/10 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
                  Product Inventory
                </CardTitle>
                <p className="mt-1 text-sm text-[#C0C0C0]/55">
                  Search, review, edit, and remove products from your catalog.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-full border-[#C0C0C0]/14 bg-[#0B0B0B]/70 px-4 text-[#F5F5F5] placeholder:text-[#C0C0C0]/35 transition-all duration-300 focus-visible:border-[#C0C0C0]/45 focus-visible:ring-2 focus-visible:ring-[#C0C0C0]/15 sm:w-72"
                />

                <span className="inline-flex h-11 items-center justify-center rounded-full border border-[#C0C0C0]/14 bg-[#C0C0C0]/8 px-4 text-sm font-medium text-[#C0C0C0]">
                  {products.length} Products
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C0C0C0]/10 hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Product
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Category
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Price
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Stock
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Status
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#C0C0C0]/55">
                      Featured
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
                        {Array.from({ length: 7 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex} className="px-6 py-5">
                            <div className="h-4 animate-pulse rounded-full bg-[#C0C0C0]/10" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-[#C0C0C0]/10 transition-colors duration-300 hover:bg-[#2A2A2A]/45"
                      >
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`${baseURL}${product.image}`}
                              alt={product.name}
                              className="h-12 w-12 rounded-2xl border border-[#C0C0C0]/12 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                            />
                            <div>
                              <p className="font-semibold text-[#F5F5F5]">
                                {product.name}
                              </p>
                              <p className="text-sm text-[#C0C0C0]/50">
                                ID: {product.sku}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5 capitalize text-[#C0C0C0]/75">
                          {product.category}
                        </TableCell>

                        <TableCell className="px-6 py-5 font-medium text-[#F5F5F5]">
                          {formatPrice(product.price)}
                        </TableCell>

                        <TableCell className="px-6 py-5 text-[#C0C0C0]/75">
                          {product.quantity}
                        </TableCell>

                        <TableCell className="px-6 py-5">
                          <Badge
                            variant={
                              product.quantity > 10
                                ? "default"
                                : product.quantity > 0
                                ? "secondary"
                                : "destructive"
                            }
                            className="rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/10 px-3 py-1 text-xs font-medium text-[#F5F5F5]"
                          >
                            {product.quantity > 10
                              ? "In Stock"
                              : product.quantity > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-6 py-5">
                          {product.featured ? (
                            <Badge
                              variant="default"
                              className="rounded-full border border-[#C0C0C0]/16 bg-[#C0C0C0]/14 px-3 py-1 text-xs font-medium text-[#F5F5F5]"
                            >
                              Yes
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="rounded-full border border-[#C0C0C0]/12 bg-[#0B0B0B]/60 px-3 py-1 text-xs font-medium text-[#C0C0C0]/65"
                            >
                              No
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <AddProductDialog
                              editProduct
                              productId={product.id}
                              frontendUpdateProduct={frontendUpdateProduct}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-[#C0C0C0]/70 transition-all duration-300 hover:bg-[#2A2A2A] hover:text-[#F5F5F5]"
                            >
                              <DeleteDialog
                                product={product}
                                frontendDeleteProduct={frontendDeleteProduct}
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && products.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto max-w-md rounded-3xl border border-[#C0C0C0]/12 bg-[#0B0B0B]/65 p-8">
                  <p className="font-medium text-[#F5F5F5]">
                    No products found
                  </p>
                  <p className="mt-2 text-sm text-[#C0C0C0]/60">
                    No products found matching your search.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-full border-[#C0C0C0]/18 bg-[#171717] px-5 text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5] disabled:border-[#C0C0C0]/8 disabled:bg-[#171717]/60 disabled:text-[#C0C0C0]/25"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              onClick={() => goToPage(p)}
              className={`h-10 w-10 rounded-full transition-all duration-300 ${
                p === page
                  ? "bg-[#C0C0C0] text-[#0B0B0B] hover:bg-[#F5F5F5]"
                  : "border-[#C0C0C0]/18 bg-[#171717] text-[#C0C0C0] hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5]"
              }`}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-full border-[#C0C0C0]/18 bg-[#171717] px-5 text-[#C0C0C0] transition-all duration-300 hover:border-[#C0C0C0]/45 hover:bg-[#2A2A2A] hover:text-[#F5F5F5] disabled:border-[#C0C0C0]/8 disabled:bg-[#171717]/60 disabled:text-[#C0C0C0]/25"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;