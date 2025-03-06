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
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-transparent py-24">
        <div className="container-xl lg:container mx-auto px-4">
          <div className="relative mb-16 text-center">
            <div className="inline-block">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 relative z-10">
                Recent Cars
              </h2>
              <div className="absolute w-full h-3 bg-blue-100 dark:bg-blue-900/30 bottom-1 left-0 transform -rotate-1"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Discover our latest additions to the marketplace
            </p>
          </div>
          <div className="grid items-stretch grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentCars.length === 0 ? (
              <div className="col-span-full">
                <p className="text-center text-lg text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
                  No cars found.
                </p>
              </div>
            ) : (
              recentCars.map((car) => <CarCard key={car._id} car={car} />)
            )}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-t from-blue-50/30 to-transparent">
        <div className="container-xl lg:container mx-auto px-4">
          <Link
            href="/cars"
            className="group relative block w-full max-w-lg px-8 py-4 mx-auto text-center text-white text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">View All Cars</span>
            <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform duration-300"></div>
          </Link>
        </div>
      </section>
    </>
  );
}
