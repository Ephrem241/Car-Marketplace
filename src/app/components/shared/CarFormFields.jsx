import React from "react";
import PropTypes from "prop-types";

export const CAR_FEATURES = [
  "CD Player",
  "Bluetooth",
  "Navigation",
  "Sunroof",
  "Leather Seats",
  "Backup Camera",
  "Cruise Control",
  "Heated Seats",
  "Satellite Radio",
  "Parking Sensors",
];

export const CAR_CLASSES = [
  "Economy",
  "Luxury",
  "Sports",
  "SUV",
  "Truck",
  "Van",
];

export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];

export const DRIVE_TYPES = [
  { value: "FWD", label: "Front Wheel Drive (FWD)" },
  { value: "RWD", label: "Rear Wheel Drive (RWD)" },
  { value: "AWD", label: "All Wheel Drive (AWD)" },
  { value: "4WD", label: "Four Wheel Drive (4WD)" },
];

// Helper function to ensure field values are never undefined
const ensureValue = (value, defaultValue = "") => {
  return value === undefined || value === null ? defaultValue : value;
};

export default function CarFormFields({
  fields,
  handleChange,
  handleFeaturesChange,
}) {
  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="carClass"
          className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
        >
          Car Class
        </label>
        <select
          id="carClass"
          name="carClass"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          required
          value={ensureValue(fields.carClass)}
          onChange={handleChange}
        >
          <option value="">Select Car Class</option>
          {CAR_CLASSES.map((carClass) => (
            <option key={carClass} value={carClass}>
              {carClass}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Car Make
          </label>
          <input
            type="text"
            name="make"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.make)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Car Model
          </label>
          <input
            type="text"
            name="model"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.model)}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="transmission"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.transmission)}
            onChange={handleChange}
          >
            <option value="">Select Transmission</option>
            <option value="a">Automatic</option>
            <option value="m">Manual</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="drive"
            className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
          >
            Drive Type
          </label>
          <select
            id="drive"
            name="drive"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.drive)}
            onChange={handleChange}
          >
            <option value="">Select Drive Type</option>
            {DRIVE_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fuel_type"
            className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
          >
            Fuel Type
          </label>
          <select
            id="fuel_type"
            name="fuel_type"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.fuel_type)}
            onChange={handleChange}
          >
            <option value="">Select Fuel Type</option>
            {FUEL_TYPES.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {fuelType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Numeric Fields */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Year
          </label>
          <input
            type="number"
            name="year"
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.year)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Price
          </label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.price)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Speed (KPH)
          </label>
          <input
            type="number"
            name="kph"
            min="0"
            max="500"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.kph)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Mileage (km)
          </label>
          <input
            type="number"
            name="mileage"
            min="0"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
            value={ensureValue(fields.mileage)}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          name="description"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows="4"
          required
          value={ensureValue(fields.description)}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* External Link */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
          External Link (Optional)
        </label>
        <input
          type="url"
          name="link"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="https://example.com"
          value={ensureValue(fields.link)}
          onChange={handleChange}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add a link to more details about the car
        </p>
      </div>

      {/* Features */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
          Features
        </label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {CAR_FEATURES.map((feature) => (
            <div key={feature}>
              <input
                type="checkbox"
                id={`feature_${feature.replace(/\s+/g, "_")}`}
                name="features"
                value={feature}
                className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                checked={
                  Array.isArray(fields.features) &&
                  fields.features.includes(feature)
                }
                onChange={handleFeaturesChange}
              />
              <label
                htmlFor={`feature_${feature.replace(/\s+/g, "_")}`}
                className="dark:text-gray-200"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

CarFormFields.propTypes = {
  fields: PropTypes.shape({
    carClass: PropTypes.string,
    make: PropTypes.string,
    model: PropTypes.string,
    transmission: PropTypes.string,
    drive: PropTypes.string,
    fuel_type: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    kph: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    link: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFeaturesChange: PropTypes.func.isRequired,
};
