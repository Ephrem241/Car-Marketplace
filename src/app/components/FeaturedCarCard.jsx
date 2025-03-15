"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function FeaturedCarCard({ car }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:scale-[1.02] group-hover:scale-110 dark:bg-gray-800 dark:border-gray-700">
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={imageError ? "/images/default-car.jpg" : car.images[0]}
          onError={() => setImageError(true)}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="flex gap-4 justify-between items-start">
          <div>
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {car.model}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {car.make}
            </p>
          </div>
          <div className="px-4 py-2 text-lg font-bold text-blue-600 bg-blue-50 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
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
            <div key={index} className="flex gap-2 items-center">
              <Image
                src={item.icon}
                width={24}
                height={24}
                alt=""
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
