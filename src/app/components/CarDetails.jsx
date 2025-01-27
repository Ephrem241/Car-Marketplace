import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

export default function CarDetails({ car }) {
  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">{car.make}</div>
        <h1 className="text-3xl font-bold mb-4">{car.model}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <p className="text-orange-700">{car.class}</p>
        </div>

        <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
          Price
        </h3>

        <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
          <div className="text-2xl font-bold text-blue-500">{car.price}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Description & Details</h3>
        <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
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
        <p className="text-gray-500 mb-4 text-center">{car.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Features</h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {car.features.map((feature, index) => (
            <li key={index}>
              <FaCheck className="text-green-600 mr-2 inline-block" /> {feature}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
