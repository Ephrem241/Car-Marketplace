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
      <section className="py-24 bg-gradient-to-b via-white to-transparent from-blue-50/50">
        <div className="px-4 mx-auto container-xl lg:container">
          <div className="relative mb-16 text-center">
            <div className="inline-block">
              <h2 className="relative z-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Recent Cars
              </h2>
              <div className="absolute left-0 bottom-1 w-full h-3 bg-blue-100 transform -rotate-1 dark:bg-blue-900/30"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 items-stretch md:grid-cols-2 lg:grid-cols-3">
            {recentCars.length === 0 ? (
              <div className="col-span-full">
                <p className="p-8 text-lg text-center text-gray-600 bg-gray-50 rounded-xl dark:text-gray-400 dark:bg-gray-800/50">
                  No cars found.
                </p>
              </div>
            ) : (
              recentCars.map((car) => <CarCard key={car._id} car={car} />)
            )}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-t to-transparent from-blue-50/30">
        <div className="px-4 mx-auto container-xl lg:container">
          <Link
            href="/cars"
            className="block overflow-hidden relative px-8 py-4 mx-auto w-full max-w-lg text-lg font-semibold text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl transition-all duration-300 transform group hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="relative z-10">View All Cars</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform duration-300 -translate-y-full group-hover:translate-y-0"></div>
          </Link>
        </div>
      </section>
    </>
  );
}
