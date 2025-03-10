"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

const SPEC_ITEMS = [
  {
    icon: "/steering-wheel.svg",
    getText: (car) => (car.transmission === "a" ? "Automatic" : "Manual"),
  },
  {
    icon: "/tire.svg",
    getText: (car) => car.drive?.toUpperCase() || "N/A",
  },
  {
    icon: "/gas.svg",
    getText: (car) => (car.kph ? `${car.kph} KPH` : "N/A"),
  },
];

const CarCard = memo(function CarCard({ car }) {
  return (
    <div
      className="relative flex flex-col h-full overflow-hidden transition-all duration-300 
        transform-gpu  /* Add GPU acceleration */
        hover:shadow-2xl hover:scale-[1.02]
        active:scale-[0.99]  /* Add click effect */
        motion-safe:transition-transform  /* Respect user motion preferences */
        dark:bg-gray-800/90 dark:border-gray-700 group"
      role="article"
      aria-label={`${car.year} ${car.make} ${car.model}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-t to-transparent from-black/20" />
        <Image
          src={car.images[0] || "/images/default-car.jpg"}
          alt={`${car.make} ${car.model}`}
          fill
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="flex gap-4 justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {car.model}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {car.make}
            </p>
          </div>
          <div className="px-4 py-2 text-lg font-bold text-blue-600 bg-blue-50 rounded-xl shadow-sm transition-shadow dark:bg-blue-900/30 dark:text-blue-400 group-hover:shadow-md">
            {car.price.toLocaleString()}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 mt-6 border-t border-gray-100 dark:border-gray-700/70">
          {SPEC_ITEMS.map((item, index) => (
            <div
              key={index}
              className="flex gap-2 items-center px-2 py-1.5 bg-gray-50 rounded-lg dark:bg-gray-800"
            >
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt=""
                className="opacity-75"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.getText(car)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center pt-4 mt-auto border-t border-gray-100 dark:border-gray-700/70">
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
              transition-all hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 
              hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

CarCard.propTypes = {
  car: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    transmission: PropTypes.oneOf(["a", "m"]).isRequired,
    drive: PropTypes.string,
    kph: PropTypes.number,
    year: PropTypes.number.isRequired,
    fuel_type: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default CarCard;
