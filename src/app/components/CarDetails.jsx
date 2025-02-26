import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

export default function CarDetails({ car }) {
  return (
    <main className="max-w-6xl mx-auto">
      <div className="p-8 bg-white shadow-lg rounded-xl dark:bg-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {car.make}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              {car.model}
            </h1>
            <div className="mt-4">
              <span className="px-4 py-2 text-sm font-medium text-orange-700 rounded-full bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400">
                {car.carClass}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Price
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {car.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-8 p-6 mt-8 bg-gray-50 rounded-xl dark:bg-gray-700/50">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/steering-wheel.svg"
              width={32}
              height={32}
              alt="Transmission"
              className="opacity-75"
            />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/tire.svg"
              width={32}
              height={32}
              alt="Drive Type"
              className="opacity-75"
            />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.drive.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/gas.svg"
              width={32}
              height={32}
              alt="Speed"
              className="opacity-75"
            />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.kph} KPH
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
              {car.year}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {car.fuel_type}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fuel Type
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Description
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            {car.description}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Features
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {car.features?.length ? (
              car.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <FaCheck className="text-green-500" />
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
