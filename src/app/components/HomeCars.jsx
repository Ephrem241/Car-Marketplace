import React from "react";
import CarCard from "./CarCard";
import Link from "next/link";
import { fetchCars } from "@/utils/requests";

export default async function HomeCars() {
  const data = await fetchCars();

  // Sort by creation date and get the 3 most recent cars
  const recentCars = data.cars
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="container-xl lg:container mx-auto px-4">
          <div className="relative mb-12">
            <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Recent Cars
            </h2>
            <div className="absolute w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full mt-4"></div>
          </div>
          <div className="grid items-stretch grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {recentCars.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No cars found.
              </p>
            ) : (
              recentCars.map((car) => <CarCard key={car._id} car={car} />)
            )}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-xl lg:container mx-auto px-4">
          <Link
            href="/cars"
            className="block w-full max-w-lg px-8 py-4 mx-auto text-center text-white text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View All Cars
          </Link>
        </div>
      </section>
    </>
  );
}
