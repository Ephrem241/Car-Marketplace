"use client";

import React, { useEffect, useState } from "react";
import CarCard from "./CarCard";
import Link from "next/link";
import { fetchCars } from "@/utils/requests";

export default function HomeCars() {
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        const sortedCars = (data.cars || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setRecentCars(sortedCars);
      } catch (error) {
        console.error("Failed to load cars:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  return (
    <>
      <section className="relative py-16 bg-gradient-to-b via-white to-transparent md:py-24 from-blue-50/50 dark:from-gray-900/80 dark:via-gray-800">
        <div className="absolute inset-0 mix-blend-soft-light">
          <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMzQ4MmY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjU2M2ViIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0iaGV4IiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0xNSAwbDMwIDE3LjN2MzQuNkwxNSA2OS4yLTE1IDUxLjlWMTcuM3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNncmFkKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hleCkiLz48L3N2Zz4=')] animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10" />
        </div>

        <div className="relative px-4 mx-auto container-xl lg:container">
          <div className="relative mb-12 text-center md:mb-16">
            <div className="inline-block relative">
              <h2 className="relative z-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 md:text-5xl dark:from-blue-400 dark:to-blue-300">
                Recent Cars
              </h2>
              <div className="absolute left-0 bottom-1 w-full h-3 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-full transform -rotate-1 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-900/30" />
              <span className="absolute -top-6 -right-6 text-5xl font-bold text-blue-200/50 dark:text-blue-600/30">
                🚗
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 items-stretch md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
                  aria-label="Loading..."
                />
              ))
            ) : recentCars.length === 0 ? (
              <div className="col-span-full">
                <p className="p-8 text-lg text-center text-gray-600 bg-gray-50 rounded-xl shadow-inner dark:text-gray-300 dark:bg-gray-800/70">
                  No recent cars found. Check back later!
                </p>
              </div>
            ) : (
              recentCars.map((car, index) => (
                <div
                  key={car._id}
                  className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fadeInUp-delayed"
                  style={{ "--delay": index }}
                >
                  <CarCard car={car} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-t to-transparent md:py-16 from-blue-50/30 dark:from-gray-900/80">
        <div className="px-4 mx-auto container-xl lg:container">
          <Link
            href="/cars"
            className="group relative block px-8 py-4 mx-auto w-full max-w-lg text-lg font-semibold text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden"
            aria-label="View all car listings"
          >
            <span className="flex relative z-10 gap-2 justify-center items-center">
              View All Cars
              <svg
                className="w-5 h-5 transition-transform transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform duration-300 -translate-y-full group-hover:translate-y-0" />
          </Link>
        </div>
      </section>
    </>
  );
}
