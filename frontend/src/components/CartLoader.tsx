import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const CartLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#050505] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl animate-pulse" />
          <ShoppingBag className="relative z-10 h-14 w-14 text-[#D4AF37]" />
        </div>
      </motion.div>

      <motion.p
        className="mt-6 font-medium tracking-wide text-[#050505]/60"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
      >
        Loading your cart...
      </motion.p>
    </div>
  );
};

export default CartLoader;