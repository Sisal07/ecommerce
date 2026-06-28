import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

// ✅ Active Link Helper
const NavLinkItem = ({
  to,
  children,
  className = "",
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-all duration-300 ${
        isActive ? "text-[#D4AF37]" : "text-white/70 hover:text-[#D4AF37]"
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export const Navbar = () => {
  const { cartitemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userIsAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D4AF37]/25 bg-[#050505]/95 text-white font-['Inter','Poppins',sans-serif] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#D4AF37]/35 bg-white shadow-[0_8px_24px_rgba(212,175,55,0.22)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.34)]">
              <img
                src={logo}
                alt="SISAL logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div className="leading-tight">
              <span className="block font-bold text-xl tracking-tight text-white">
                SISAL
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
                Secure Instant Shopping And Lifestyle
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-8 hidden md:block"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#D4AF37]" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-11 rounded-full border border-[#D4AF37]/25 bg-white/[0.06] text-white placeholder:text-white/40 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cart */}
            <NavLinkItem to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full text-white/75 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartitemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full border border-[#050505] bg-[#D4AF37] text-[#050505] text-xs font-bold"
                  >
                    {cartitemCount}
                  </Badge>
                )}
              </Button>
            </NavLinkItem>

            {/* Auth or User */}
            {userIsAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-white/75 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 border-[#D4AF37]/25 bg-[#0B0B0B] text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                >
                  <DropdownMenuItem asChild>
                    <NavLinkItem
                      to="/orders"
                      className="w-full cursor-pointer px-2 py-1.5"
                    >
                      Order History
                    </NavLinkItem>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <NavLinkItem
                      to="/admin"
                      className="w-full cursor-pointer px-2 py-1.5"
                    >
                      Admin Dashboard
                    </NavLinkItem>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[#D4AF37]/20" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-white/70 hover:text-[#D4AF37] focus:text-[#D4AF37] focus:bg-[#D4AF37]/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLinkItem to="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1.5 rounded-full px-4 transition-all duration-300 ${
                      location.pathname === "/signin"
                        ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                        : "text-white/75 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </NavLinkItem>

                <NavLinkItem to="/signup">
                  <Button
                    size="sm"
                    className={`flex items-center gap-1.5 rounded-full px-4 font-semibold transition-all duration-300 ${
                      location.pathname === "/signup"
                        ? "bg-[#F2D675] text-[#050505]"
                        : "bg-[#D4AF37] text-[#050505] hover:bg-[#F2D675] hover:shadow-[0_10px_24px_rgba(212,175,55,0.25)]"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </NavLinkItem>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-full text-white/75 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#D4AF37]/20 animate-in slide-in-from-top duration-200">
            {/* Mobile Search */}
            <div className="py-4">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#D4AF37]" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-11 rounded-full border border-[#D4AF37]/25 bg-white/[0.06] text-white placeholder:text-white/40 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                  />
                </div>
              </form>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-1 pb-5">
              <NavLinkItem
                to="/"
                className="block rounded-xl px-3 py-2 hover:bg-[#D4AF37]/10"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLinkItem>

              <NavLinkItem
                to="/products"
                className="block rounded-xl px-3 py-2 hover:bg-[#D4AF37]/10"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </NavLinkItem>

              <NavLinkItem
                to="/cart"
                className="block rounded-xl px-3 py-2 hover:bg-[#D4AF37]/10"
                onClick={() => setMenuOpen(false)}
              >
                Cart
              </NavLinkItem>

              {userIsAuthenticated ? (
                <>
                  <NavLinkItem
                    to="/orders"
                    className="block rounded-xl px-3 py-2 hover:bg-[#D4AF37]/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </NavLinkItem>

                  <NavLinkItem
                    to="/admin"
                    className="block rounded-xl px-3 py-2 hover:bg-[#D4AF37]/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </NavLinkItem>

                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start rounded-xl px-3 text-sm text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-3">
                  <Link to="/signin" onClick={() => setMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 rounded-full border-[#D4AF37]/35 bg-transparent text-white hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      Sign In
                    </Button>
                  </Link>

                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full h-10 rounded-full bg-[#D4AF37] text-[#050505] font-semibold hover:bg-[#F2D675] hover:shadow-[0_10px_24px_rgba(212,175,55,0.25)] transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 mr-1.5" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};