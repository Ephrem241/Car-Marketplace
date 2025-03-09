import Image from "next/image";
import React from "react";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import PropTypes from "prop-types";

export default function CarDetails({ car }) {
  return (
    <main className="mx-auto max-w-6xl">
      <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-xl dark:bg-gray-800/90 dark:border-gray-700">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              {car.make}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {car.model}
            </h1>
            <div className="mt-4">
              <span className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-full shadow-sm dark:bg-orange-900/30 dark:text-orange-400">
                {car.carClass}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Price
            </p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              {car.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-inner md:grid-cols-5 md:gap-8 dark:from-gray-800 dark:to-gray-700/50">
          {[
            {
              icon: "/steering-wheel.svg",
              label: "Transmission",
              value: car.transmission === "a" ? "Automatic" : "Manual",
            },
            {
              icon: "/tire.svg",
              label: "Drive Type",
              value: car.drive?.toUpperCase() || "N/A",
            },
            {
              icon: "/gas.svg",
              label: "Speed",
              value: car.kph ? `${car.kph.toLocaleString()} KPH` : "N/A",
            },
            {
              label: "Year",
              value: car.year || "N/A",
            },
            {
              label: "Fuel Type",
              value: car.fuel_type || "N/A",
            },
            {
              label: "Mileage",
              value: car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A",
            },
          ].map((spec, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 items-center p-4 rounded-xl transition-shadow bg-white/50 dark:bg-gray-800/50 hover:shadow-md"
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
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Description
          </h3>
          <p className="p-6 mt-4 leading-relaxed text-gray-600 bg-gray-50 rounded-xl dark:text-gray-300 dark:bg-gray-800/50">
            {car.description}
          </p>
        </div>

        <div className="mt-12">
          <h3 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Features
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {car.features?.length ? (
              car.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl transition-shadow dark:from-gray-800/90 dark:to-gray-700/50 hover:shadow-md"
                >
                  <div className="flex justify-center items-center w-8 h-8 bg-green-100 rounded-full dark:bg-green-900/30">
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

        {car.link && (
          <div className="mt-8">
            <a
              href={car.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              View More Details
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

CarDetails.propTypes = {
  car: PropTypes.shape({
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    carClass: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    transmission: PropTypes.string,
    drive: PropTypes.string,
    kph: PropTypes.number,
    year: PropTypes.number,
    fuel_type: PropTypes.string,
    mileage: PropTypes.number,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }).isRequired,
};
