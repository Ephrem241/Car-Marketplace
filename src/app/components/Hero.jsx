import React from "react";
import Image from "next/image";
import InfoBoxes from "./InfoBoxes";

export default function Hero() {
  return (
    <section>
      <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-w-[1440px] mx-auto">
        <div className="flex-1 px-6 pt-36 sm:px-16">
          <h1 className="2xl:text-[72px] sm:text-[64px] text-[50px] font-extrabold">
            Find, book, rent a car—quick and super easy!
          </h1>

          <p className="text-[27px] text-black-100 font-light mt-5">
            Streamline your car rental experience with our effortless booking
            process.
          </p>
        </div>
        <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen">
          <div className="relative xl:w-full w-[90%] xl:h-full h-[590px] z-0">
            <Image src="/hero.png" alt="hero" fill className="object-contain" />
            <div className="hero__image-overlay" />
          </div>
        </div>
      </div>
      <InfoBoxes />
    </section>
  );
}
