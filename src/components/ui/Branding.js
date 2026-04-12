import { Sparkles } from 'lucide-react';

export default function Branding() {
  const logoUrl = "https://play-lh.googleusercontent.com/9gv1JFbJKV_j0616yCR4UJY5p49oPo9HyvnK7JzowNoqlznAU0GmUEsqw_xUMr7fVw";

  return (
    <div
      className="relative flex flex-col items-center py-10 px-6 text-center overflow-hidden rounded-b-[44px]"
      style={{ background: 'linear-gradient(160deg, #000 60%, #1a1200 100%)' }}
    >
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo Image */}
      <div className="relative mb-6">
        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 shadow-gold">
          <img
            src={logoUrl}
            alt="God of Graphics Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
        <span className="absolute -top-1.5 -right-1.5 bg-secondary text-primary rounded-full p-1 shadow-lg">
          <Sparkles size={14} />
        </span>
      </div>

      <div className="mt-2 bg-secondary/10 border border-secondary/20 rounded-full px-5 py-2">
        <p className="text-secondary text-xs font-black tracking-[0.15em] uppercase">
          Book Your Seat Today
        </p>
      </div>

      {/* Decorative dots */}
      <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-secondary/30" />
      <div className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full bg-secondary/20" />
    </div>
  );
}
