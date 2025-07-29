import React from 'react';
import { ShoppingCart } from 'lucide-react';

// Updated with new UI changes: Relationship Status, faffit.com CTA, and ₹100 increments

interface HeroProps {
  onCheckoutClick: () => void;
  onStartSavingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCheckoutClick, onStartSavingClick }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.7; // 70vh
      setIsVisible(scrollPosition < heroHeight * 0.8); // Hide when 80% scrolled past hero
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-[60vh] sm:h-[70vh] w-full z-0 max-md:relative max-md:aspect-[3/2] max-md:h-auto md:aspect-auto overflow-hidden">
      {/* Hero Image with enhanced overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[3000ms] ease-out"
        style={{
          backgroundImage: 'url(/image.png)'
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-transparent"></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float delay-0"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-white/15 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-white/25 rounded-full animate-float delay-2000"></div>
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-white/10 rounded-full animate-float delay-1500"></div>
        </div>
      </div>

      {/* Top-right Checkout Button */}
      {isVisible && (
        <>
          {/* Logo in top-left corner */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 animate-fade-in-up delay-500">
            <img
              src="/image copy.png"
              alt="faff logo"
              className="h-10 sm:h-12 md:h-16 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* CTA button to faffit.com */}
          <a
            href="https://faffit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-20 sm:top-6 sm:right-32 md:right-40 z-50 flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white text-[#145C48] hover:bg-[#145C48] hover:text-white transition-all duration-300 rounded-lg font-semibold text-xs sm:text-sm md:text-base hover:scale-105 hover:shadow-2xl backdrop-blur-sm animate-fade-in-up delay-600"
          >
            <span>Visit faffit.com</span>
          </a>

          {/* Checkout button in top-right corner */}
          <button
            onClick={onCheckoutClick}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#145C48] transition-all duration-300 rounded-lg font-semibold text-xs sm:text-sm md:text-base hover:scale-105 hover:shadow-2xl backdrop-blur-sm animate-fade-in-up delay-700"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">Checkout</span>
            <span className="xs:hidden">Cart</span>
          </button>
        </>
      )}

      {/* Hero Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-6 md:pl-16 lg:pl-24 max-md:items-center md:pt-0">
        <div className="text-[#F6F8F5] z-10 relative max-md:pt-[80px] sm:max-md:pt-[100px] pt-20 md:pt-24 lg:pt-28 animate-fade-in-up delay-300">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-tight sm:leading-tight md:leading-tight hover:scale-105 transition-transform duration-500 cursor-default" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            <span className="mb-4 md:mb-6 lg:mb-8 block" style={{ color: '#ebdfd1' }}>
              Smarter Way to
            </span>
            <span className="block mt-4 md:mt-6 lg:mt-8" style={{ color: '#0d4e4d' }}>
              Save Time
            </span>
          </h1>

          {/* Subtle glow effect behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Subtle animated border gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
    </div>
  );
};
