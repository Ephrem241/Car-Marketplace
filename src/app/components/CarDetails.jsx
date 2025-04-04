import Image from "next/image";
import React from "react";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import PropTypes from "prop-types";

export default function CarDetails({ car }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Car Details</h2>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Make:</span> {car.make}
            </p>
            <p>
              <span className="font-semibold">Model:</span> {car.model}
            </p>
            <p>
              <span className="font-semibold">Year:</span> {car.year}
            </p>
            <p>
              <span className="font-semibold">Price:</span> $
              {car.price?.toLocaleString() || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Mileage:</span>
              {car.mileage?.toLocaleString() || "N/A"} miles
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Color:</span> {car.color}
            </p>
            <p>
              <span className="font-semibold">Transmission:</span>{" "}
              {car.transmission}
            </p>
            <p>
              <span className="font-semibold">Fuel Type:</span> {car.fuelType}
            </p>
            <p>
              <span className="font-semibold">Condition:</span> {car.condition}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-600 dark:text-gray-300">{car.description}</p>
      </div>
    </div>
  );
}

CarDetails.propTypes = {
  car: PropTypes.shape({
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    mileage: PropTypes.number.isRequired,
    color: PropTypes.string,
    transmission: PropTypes.string,
    fuelType: PropTypes.string,
    condition: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
