import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getFeaturedProducts,
  toSnakeCase,
} from "@/lib/services";
import { IProduct } from "@/types/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

// Categories List
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home and Garden",
  "Sports",
  "Books",
];

// Simple shimmer skeleton card
const SkeletonCard = () => (
  <motion.div
    className="h-72 rounded-2xl border border-[#D4AF37]/20 bg-[#050505] shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
    initial={{ opacity: 0.45 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
  >
    <div className="h-40 rounded-t-2xl bg-white/[0.06]" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 rounded-full bg-[#D4AF37]/20" />
      <div className="h-3 w-1/2 rounded-full bg-white/10" />
      <div className="h-3 w-full rounded-full bg-white/10" />
      <div className="h-3 w-2/3 rounded-full bg-white/10" />
    </div>
  </motion.div>
);

const StorePage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [featuredProductsLoader, setFeaturedProductsLoader] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);

  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [loadingAllProducts, setLoadingAllProducts] = useState(true);

  /** Fetch All Products **/
  useEffect(() => {
    async function handleGetAllProducts() {
      setLoadingAllProducts(true);
      try {
        const res = await getAllProducts(
          page,
          searchQuery,
          toSnakeCase(selectedCategory)
        );
        setProducts(res.results);
        setNextPage(res.next);
        setPrevPage(res.previous);
        setCount(res.count);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingAllProducts(false);
      }
    }

    handleGetAllProducts();
  }, [page, searchQuery, selectedCategory]);

  /** Fetch Featured Products **/
  useEffect(() => {
    async function handleGetFeaturedProducts() {
      setFeaturedProductsLoader(true);
      try {
        const res = await getFeaturedProducts();
        setFeaturedProducts(res);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching featured products:", err.message);
        }
      } finally {
        setFeaturedProductsLoader(false);
      }
    }

    handleGetFeaturedProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | SISAL</title>
      </Helmet>

      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          {!searchQuery && (
            <section className="mb-14">
              <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] px-6 py-12 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:px-8 md:px-12 md:py-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
                <div className="absolute -right-16 top-10 h-44 w-44 rounded-full border border-[#D4AF37]/25" />
                <div className="absolute right-10 bottom-8 h-20 w-20 rounded-full border border-white/10" />

                <div className="relative max-w-3xl">
                  <Badge className="mb-5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                    Secure Instant Shopping And Lifestyle
                  </Badge>

                  <h1 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
                    Luxury shopping, made effortless.
                  </h1>

                  <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
                    Discover premium products with SISAL, crafted for a refined,
                    secure, and modern shopping experience.
                  </p>

                  <Button
                    size="lg"
                    className="rounded-full bg-[#D4AF37] px-7 font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_14px_30px_rgba(212,175,55,0.25)]"
                    onClick={() =>
                      document
                        .getElementById("all-products")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Search Results Header */}
          {searchQuery && (
            <section className="mb-8 rounded-2xl border border-[#D4AF37]/20 bg-[#050505] p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                Search Results
              </p>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                "{searchQuery}"
              </h1>
              <p className="text-white/60">{count} products found</p>
            </section>
          )}

          {/* Featured Products */}
          {!searchQuery && (
            <section className="mb-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                    Curated Selection
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-[#050505]">
                    Featured Products
                  </h2>
                </div>
              </div>

              {featuredProductsLoader ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                featuredProducts.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )
              )}
            </section>
          )}

          {/* Category Filters */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[#D4AF37]/20 bg-[#050505] p-3 shadow-[0_14px_35px_rgba(0,0,0,0.12)]">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#D4AF37] text-[#050505] hover:bg-[#F2D675]"
                      : "border-[#D4AF37]/25 bg-transparent text-white/70 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>

          {/* Products Grid */}
          <section id="all-products">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Explore Collection
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-[#050505]">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h2>
              </div>

              <Badge className="rounded-full border border-[#D4AF37]/25 bg-[#050505] px-3 py-1 text-[#D4AF37]">
                {count} products
              </Badge>
            </div>

            {loadingAllProducts ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#050505] px-6 py-14 text-center text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
                <p className="mb-5 text-lg text-white/65">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full border-[#D4AF37]/35 bg-transparent px-6 text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F2D675]"
                  onClick={() => {
                    setSelectedCategory("All");
                    window.history.pushState({}, "", "/");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={!prevPage}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-full border-[#D4AF37]/35 bg-white px-5 text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37] disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
            >
              Previous
            </Button>

            <span className="rounded-full border border-[#D4AF37]/20 bg-[#050505] px-4 py-2 text-sm font-medium text-[#D4AF37]">
              Page {page}
            </span>

            <Button
              variant="outline"
              disabled={!nextPage}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border-[#D4AF37]/35 bg-white px-5 text-[#050505] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#050505] hover:text-[#D4AF37] disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
            >
              Next
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StorePage;