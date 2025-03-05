import React from "react";
import { fetchCars } from "@/utils/requests";
import FeaturedCarCard from "./FeaturedCarCard";

export default async function FeaturedCars() {
  const { cars } = await fetchCars();
  const featuredCars = cars.filter((car) => car.isFeatured).slice(0, 2);

  return featuredCars.length > 0 ? (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container-xl lg:container mx-auto px-4">
          <div className="relative">
            <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Featured Cars
            </h2>
            <div className="absolute w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full mt-4"></div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-white to-blue-50/30 px-4 pb-16">
        <div className="container-xl lg:container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {featuredCars.map((car) => (
              <FeaturedCarCard key={car._id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </>
  ) : null;
}
