import React from "react";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CustomFilter from "./components/CustomFilter";
import HomeCars from "./components/HomeCars";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 sm:px-16 px-6 py-4 max-w-[1440px] mx-auto">
        <div className="flex flex-col items-start justify-start gap-y-2.5 text-black-100">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Browse the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" />
            <CustomFilter title="year" />
          </div>
        </div>
        <HomeCars />
      </div>
    </main>
  );
}
