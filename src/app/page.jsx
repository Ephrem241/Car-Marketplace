import React from "react";
import Hero from "./components/Hero";

import HomeCars from "./components/HomeCars";
import CarSearch from "./components/CarSearch";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 sm:px-16 px-6 py-4 max-w-[1440px] mx-auto">
        <div className="flex flex-col items-start justify-start gap-y-2.5 text-black-100">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Browse the cars you might like</p>
          <div className="flex items-center w-full gap-x-3">
            <CarSearch />
          </div>
        </div>
        <HomeCars />
      </div>
    </main>
  );
}
