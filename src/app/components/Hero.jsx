import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="flex xl:flex-row flex-col gap-8 xl:gap-12 relative z-0 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Text Content */}
        <div className="flex-1 pb-8 pt-28 xl:pt-36">
          <div className="max-w-2xl xl:max-w-none">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-bold leading-[1.1] tracking-tighter bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Your Dream Car Awaits
              <span className="block mt-3 text-2xl font-semibold text-gray-700 sm:text-3xl lg:text-4xl">
                Buy with Confidence
              </span>
            </h1>

            <p className="max-w-3xl mt-6 text-lg leading-relaxed text-gray-600 lg:mt-8 sm:text-xl lg:text-2xl">
              Discover a wide selection of quality cars at competitive prices.
            </p>
          </div>
        </div>

        {/* Image Container */}
        <div className="xl:flex-[1.4] w-full xl:h-[calc(100vh-120px)] relative">
          <div className="relative w-full h-[480px] sm:h-[580px] xl:h-full rounded-l-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/20 to-transparent" />

            <Image
              src="/hero.png"
              alt="Luxury car"
              fill
              className="object-cover w-full h-full transition-all duration-500 ease-out transform hover:scale-105"
              priority
              quality={90}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 xl:mt-16"></div>
    </section>
  );
}
