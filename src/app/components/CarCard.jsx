"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CarCard({ car }) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-2xl hover:shadow-2xl hover:scale-[1.02] dark:bg-gray-800/90 dark:border-gray-700 group">
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <Image
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {car.model}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {car.make}
            </p>
          </div>
          <div className="px-4 py-2 text-lg font-bold text-blue-600 bg-blue-50 rounded-xl shadow-sm dark:bg-blue-900/30 dark:text-blue-400 group-hover:shadow-md transition-shadow">
            ${car.price.toLocaleString()}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 mt-6 border-t border-gray-100 dark:border-gray-700/70">
          {[
            {
              icon: "/steering-wheel.svg",
              text: car.transmission === "a" ? "Automatic" : "Manual",
            },
            { icon: "/tire.svg", text: car.drive.toUpperCase() },
            { icon: "/gas.svg", text: `${car.kph} KPH` },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
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
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-700/70">
          <div className="flex gap-4">
            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
              {car.year}
            </span>
            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
              {car.fuel_type}
            </span>
          </div>
          <Link
            href={`/cars/${car._id}`}
            className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
