"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CarCard({ car }) {
  return (
    <div className="relative shadow-lg rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-gray-500 text-sm">{car.make}</div>
            <h3 className="text-lg font-bold">{car.model}</h3>
          </div>
          <div className="bg-white shadow-md px-3 py-1 rounded-lg text-blue-500 font-bold text-sm">
            ${car.price}
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-500 text-xs mt-4">
          <div className="flex items-center gap-1">
            <Image
              src="/steering-wheel.svg"
              width={16}
              height={16}
              alt="Transmission"
            />
            <span>{car.transmission === "a" ? "Automatic" : "Manual"} </span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/tire.svg" width={16} height={16} alt="Drive Type" />
            <span>{car.drive.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/gas.svg" width={16} height={16} alt="Speed" />
            <span>{car.kph} KPH</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-600 text-xs mt-3">
          <span>{car.year}</span>
          <span>{car.fuel_type}</span>
        </div>

        <Link
          href={`/cars/${car._id}`}
          className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg text-sm transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
