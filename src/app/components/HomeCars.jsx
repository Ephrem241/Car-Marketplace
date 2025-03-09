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
      <section className="relative py-16 bg-gradient-to-b via-white to-transparent md:py-24 from-blue-50/50">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none"></div>

        <div className="relative px-4 mx-auto container-xl lg:container">
          <div className="relative mb-12 text-center md:mb-16">
            <div className="inline-block relative">
              <h2 className="relative z-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 md:text-5xl">
                Recent Cars
              </h2>
              <div className="absolute left-0 bottom-1 w-full h-3 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-full transform -rotate-1 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-900/30"></div>
              <span className="absolute -top-6 -right-6 text-5xl font-bold text-blue-200/50">
                🚗
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 items-stretch md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {recentCars.length === 0 ? (
              <div className="col-span-full">
                <p className="p-8 text-lg text-center text-gray-600 bg-gray-50 rounded-xl shadow-inner dark:text-gray-400 dark:bg-gray-800/50">
                  No cars found.
                </p>
              </div>
            ) : (
              recentCars.map((car, index) => (
                <div
                  key={car._id}
                  className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    animation: `fadeInUp 0.5s ease-out forwards ${
                      index * 0.2
                    }s`,
                    opacity: 0,
                  }}
                >
                  <CarCard car={car} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-t to-transparent md:py-16 from-blue-50/30">
        <div className="px-4 mx-auto container-xl lg:container">
          <Link
            href="/cars"
            className="group relative block px-8 py-4 mx-auto w-full max-w-lg text-lg font-semibold text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden"
          >
            <span className="flex relative z-10 gap-2 justify-center items-center">
              View All Cars
              <svg
                className="w-5 h-5 transition-transform transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform duration-300 -translate-y-full group-hover:translate-y-0"></div>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
