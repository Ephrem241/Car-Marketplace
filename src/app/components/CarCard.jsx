"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CarCard({ car }) {
  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={`/images/cars/${car.images[0]}`}
        alt=""
        className="w-full h-auto rounded-t-xl"
        width={0}
        height={0}
        sizes="100vw"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{car.make}</div>
          <h3 className="text-xl font-bold">{car.model}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          {car.price}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <Image
              src="/steering-wheel.svg"
              width={0}
              height={0}
              sizes="100vw"
              alt="steering wheel"
              className="md:hidden lg:inline"
            />
            <span className="md:hidden lg:inline">
              {" "}
              {car.transmission === "a" ? "Automatic" : "Manual"}
            </span>
          </p>
          <p>
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <span className="md:hidden lg:inline">
              {car.drive.toUpperCase()}
            </span>
          </p>
          <p>
            <Image src="/gas.svg" width={20} height={20} alt="seat" />
            {car.kmp} <span className="md:hidden lg:inline">KMP</span>
          </p>
          <p>
            <span className="hidden sm:inline">{car.year} </span>
          </p>
          <p>
            <span className="hidden sm:inline">{car.fuel_type} </span>
          </p>
        </div>
        <Link
          href={`/cars/${car._id}`}
          className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
