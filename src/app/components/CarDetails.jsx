import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

export default function CarDetails({ car }) {
  return (
    <main>
      <div className="p-6 text-center bg-white rounded-lg shadow-md md:text-left">
        <div className="mb-4 text-gray-500">{car.make}</div>
        <h1 className="mb-4 text-3xl font-bold">{car.model}</h1>
        <div className="flex justify-center mb-4 text-gray-500 align-middle md:justify-start">
          <p className="text-orange-700">{car.carClass}</p>
        </div>

        <h3 className="p-2 my-6 text-lg font-bold text-white bg-gray-800">
          Price
        </h3>

        <div className="flex items-center justify-center pb-4 mb-4 border-b border-gray-200 md:border-b-0 md:pb-0">
          <div className="text-2xl font-bold text-blue-500">{car.price}</div>
        </div>
      </div>

      <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-6 text-lg font-bold">Description & Details</h3>
        <div className="flex justify-center gap-4 mb-4 text-xl text-blue-500 space-x-9">
          <p>
            <Image
              src="/steering-wheel.svg"
              width={40}
              height={40}
              layout="intrinsic"
              alt="steering wheel"
              className="md:hidden lg:inline"
            />{" "}
            {car.transmission === "a" ? "Automatic" : "Manual"}
          </p>
          <p>
            <Image
              src="/tire.svg"
              width={40}
              height={40}
              layout="intrinsic"
              alt="seat"
            />{" "}
            <span className="hidden sm:inline">{car.drive.toUpperCase()}</span>
          </p>
          <p>
            <Image
              src="/gas.svg"
              width={40}
              height={40}
              layout="intrinsic"
              alt="seat"
            />{" "}
            {car.kph}
            <span className="hidden sm:inline">KPH</span>
          </p>{" "}
          <p>
            <span className="hidden sm:inline">{car.year} </span>
          </p>
          <p>
            <span className="hidden sm:inline">{car.fuel_type} </span>
          </p>
        </div>
        <p className="mb-4 text-center text-gray-500">{car.description}</p>
      </div>

      <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-6 text-lg font-bold">Features</h3>

        <ul className="grid grid-cols-1 space-y-2 list-none md:grid-cols-2 lg:grid-cols-3">
          {car.features.map((feature, index) => (
            <li key={index}>
              <FaCheck className="inline-block mr-2 text-green-600" /> {feature}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
