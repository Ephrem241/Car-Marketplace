import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

export default function CarDetails({ car }) {
  return (
    <main className="max-w-6xl mx-auto">
      <div className="p-8 bg-white shadow-xl rounded-2xl dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              {car.make}
            </p>
            <h1 className="mt-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {car.model}
            </h1>
            <div className="mt-4">
              <span className="px-4 py-2 text-sm font-medium text-orange-700 rounded-full bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 shadow-sm">
                {car.carClass}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Price
            </p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              ${car.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 p-6 mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl dark:from-gray-800 dark:to-gray-700/50 shadow-inner">
          {[
            {
              icon: "/steering-wheel.svg",
              label: "Transmission",
              value: car.transmission === "a" ? "Automatic" : "Manual",
            },
            {
              icon: "/tire.svg",
              label: "Drive Type",
              value: car.drive.toUpperCase(),
            },
            {
              icon: "/gas.svg",
              label: "Speed",
              value: `${car.kph} KPH`,
            },
            {
              label: "Year",
              value: car.year,
            },
            {
              label: "Fuel Type",
              value: car.fuel_type,
            },
          ].map((spec, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white/50 rounded-xl dark:bg-gray-800/50 hover:shadow-md transition-shadow"
            >
              {spec.icon && (
                <Image
                  src={spec.icon}
                  width={32}
                  height={32}
                  alt={spec.label}
                  className="opacity-75"
                />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {spec.label}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Description
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
            {car.description}
          </p>
        </div>

        <div className="mt-12">
          <h3 className="mb-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Features
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {car.features?.length ? (
              car.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                    <FaCheck className="text-green-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    {feature}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No features available.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
