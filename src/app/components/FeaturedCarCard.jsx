import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FeaturedCarCard({ car }) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:scale-[1.01] dark:bg-gray-800 dark:border-gray-700">
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={car.images[0] || "/images/default-car.jpg"}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {car.model}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {car.make}
            </p>
          </div>
          <div className="px-4 py-2 text-lg font-bold text-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
            {car.price.toLocaleString()}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 mt-6 border-t border-gray-100 dark:border-gray-700">
          {[
            {
              icon: "/steering-wheel.svg",
              text: car.transmission === "a" ? "Automatic" : "Manual",
            },
            { icon: "/tire.svg", text: car.drive.toUpperCase() },
            { icon: "/gas.svg", text: `${car.kph} KPH` },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt=""
                className="opacity-75"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.year}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.fuel_type}
            </span>
          </div>
          <Link
            href={`/cars/${car._id}`}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
