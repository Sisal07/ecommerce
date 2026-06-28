const Loader = () => {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-white font-['Inter','Poppins',sans-serif]">
      <div className="flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-[#050505] px-6 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
        <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.55)] [animation-delay:-0.3s]"></div>
        <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-[#F2D675] shadow-[0_0_18px_rgba(212,175,55,0.45)] [animation-delay:-0.15s]"></div>
        <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.35)]"></div>
      </div>
    </div>
  );
};

export default Loader;