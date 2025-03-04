import React from "react";
import CarCard from "./CarCard";
import Link from "next/link";
import { fetchCars } from "@/utils/requests";

export default async function HomeCars() {
  const data = await fetchCars();

  // Better shuffle implementation
  const recentCars = data.cars.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <>
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-blue-500 dark:text-blue-400">
            Featured Cars
          </h2>
          <div className="grid items-stretch grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
      <section className="py-10">
        <div className="container px-4 mx-auto">
          <Link
            href="/cars"
            className="block w-full max-w-lg px-6 py-4 mx-auto text-center text-white transition-colors duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            View All Cars
          </Link>
        </div>
      </section>
    </>
  );
}
