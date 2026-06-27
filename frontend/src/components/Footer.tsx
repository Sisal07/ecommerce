import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, CreditCard, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#050505] text-white font-['Inter','Poppins',sans-serif] border-t border-[#D4AF37]/30">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-5">
            <Link to="/" className="group flex items-center space-x-3 w-fit">
              <div className="w-11 h-11 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_14px_36px_rgba(212,175,55,0.35)]">
                <span className="text-[#050505] font-bold text-xl">S</span>
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-2xl tracking-tight text-white">
                  SISAL
                </span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">
                  Secure Instant Shopping And Lifestyle
                </span>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Your trusted destination for secure instant shopping and lifestyle essentials.
              We deliver quality products with a refined experience and reliable service.
            </p>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-[#D4AF37]/35 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-[#D4AF37]/35 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-[#D4AF37]/35 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-[#D4AF37]/35 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#D4AF37] transition-all duration-300 text-sm inline-flex hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '/help' },
                { name: 'Track Your Order', href: '/track' },
                { name: 'Live Chat', href: '/chat' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Accessibility', href: '/accessibility' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#D4AF37] transition-all duration-300 text-sm inline-flex hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Stay Connected
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>

            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 bg-white/5 border-[#D4AF37]/30 text-white placeholder:text-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all duration-300"
              />
              <Button className="w-full h-11 rounded-xl bg-[#D4AF37] text-[#050505] font-semibold hover:bg-[#F2D675] transition-all duration-300 hover:shadow-[0_10px_28px_rgba(212,175,55,0.25)]">
                Subscribe
              </Button>
            </form>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>support@sisal.com</span>
              </div>
              <div className="flex items-start space-x-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                <span>123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-[#D4AF37]/25" />

      {/* Features Bar */}
      <div className="bg-[#0B0B0B]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center md:justify-start space-x-4 rounded-2xl border border-[#D4AF37]/25 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5">
              <div className="w-11 h-11 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Free Shipping</p>
                <p className="text-white/50 text-xs">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4 rounded-2xl border border-[#D4AF37]/25 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5">
              <div className="w-11 h-11 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Secure Payment</p>
                <p className="text-white/50 text-xs">SSL encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4 rounded-2xl border border-[#D4AF37]/25 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5">
              <div className="w-11 h-11 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Easy Returns</p>
                <p className="text-white/50 text-xs">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-[#D4AF37]/25" />

      {/* Bottom Footer */}
      <div className="bg-[#050505]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <p className="text-white/55 text-sm">
                © {currentYear} SISAL. All rights reserved.
                <span className="ml-2 text-xs text-[#D4AF37]">
                  Secure Instant Shopping And Lifestyle
                </span>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="text-white/50 text-xs">We accept:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                  <div
                    key={method}
                    className="border border-[#D4AF37]/30 bg-white/[0.03] px-3 py-1.5 rounded-full text-xs font-medium text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:border-[#D4AF37]"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};