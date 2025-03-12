import React from "react";
import { fetchCars } from "@/utils/requests";
import FeaturedCarCard from "./FeaturedCarCard";

export default async function FeaturedCars() {
  const { cars } = await fetchCars();
  const featuredCars = cars.filter((car) => car.isFeatured).slice(0, 2);

  return featuredCars.length > 0 ? (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-8">
        {/* Modern Hexagonal Pattern Overlay */}
        <div className="absolute inset-0 mix-blend-soft-light">
          <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMzQ4MmY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjU2M2ViIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0iaGV4IiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0xNSAwbDMwIDE3LjN2MzQuNkwxNSA2OS4yLTE1IDUxLjlWMTcuM3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNncmFkKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hleCkiLz48L3N2Zz4=')] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10"></div>
        </div>
        <div className="container-xl lg:container mx-auto px-4">
          <div className="relative">
            <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Featured Cars
            </h2>
            <div className="absolute w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full mt-4"></div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-white to-blue-50/30 px-4 pb-24">
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
