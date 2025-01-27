import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

export default function CarAddForm() {
  const [fields, setFields] = useState({
    kph: 25,
    class: "SUV",
    drive: "AWD",
    fuel_type: "Diesel",
    make: "Toyota",
    model: "RAV4",
    transmission: "a",
    year: 2021,
    price: 30000,
    features: [],
    images: [],
    seller_info: {
      name: "",
      email: "eph1234@epicmail.com",
      phone: "",
    },
    description:
      " This is a sample car description. You can add more details as needed. Enjoy your ride!",
  });
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: { ...prevFields[outerKey], [innerKey]: value },
      }));
    } else {
      setFields((prevFields) => ({ ...prevFields, [name]: value }));
    }
  };

  const handleFeaturesChange = (e) => {
    const { checked, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      features: checked
        ? [...prevFields.features, value]
        : prevFields.features.filter((feature) => feature !== value),
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 4) {
      setPublishError("You can only upload up to 4 images.");
      return;
    }
    setFields((prevFields) => ({
      ...prevFields,
      images: Array.from(files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...fields,
          userMongoId: user.publicMetadata.userMongoId,
        }),
      });
      if (!response.ok) {
        setPublishError("Failed to add car.");
        return;
      }
      if (response.ok) {
        router.push("/dashboard/add");
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-3xl text-center font-semibold mb-6">Add Car</h2>

      <div className="mb-4">
        <label
          htmlFor="car_type"
          className="block text-gray-700 font-bold mb-2"
        >
          Car Type
        </label>
        <select
          id="class"
          name="class"
          className="border rounded w-full py-2 px-3"
          required
          value={fields.class}
          onChange={handleChange}
        >
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Truck">Truck</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Convertible">Convertible</option>
          <option value="Coupe">Coupe</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Car make</label>
        <input
          type="text"
          id="make"
          name="make"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="e.g. Toyota"
          required
          value={fields.make}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Car model</label>
        <input
          type="text"
          id="model"
          name="model"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="e.g. RAV4"
          required
          value={fields.model}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border rounded w-full py-2 px-3"
          rows="4"
          placeholder="Enter car description"
          required
          value={fields.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-4 flex flex-wrap">
        <div className="w-full sm:w-1/3 pr-2">
          <label
            htmlFor="transmission"
            className="block text-gray-700 font-bold mb-2"
          >
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.transmission}
            onChange={handleChange}
          >
            <option value="">Select Transmission</option>
            <option value="a">a</option>
            <option value="m">m</option>
          </select>
        </div>
        <div className="w-full sm:w-1/3 px-2">
          <label htmlFor="drive" className="block text-gray-700 font-bold mb-2">
            Drive
          </label>
          <select
            id="drive"
            name="drive"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.drive}
            onChange={handleChange}
          >
            <option value="">Select Drive Type</option>
            <option value="FWD"> FWD</option>
            <option value="RWD"> RWD</option>
            <option value="AWD"> AWD</option>
            <option value="4WD"> 4WD</option>
          </select>
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <label htmlFor="kph" className="block text-gray-700 font-bold mb-2">
            KPH
          </label>
          <input
            type="number"
            id="kph"
            name="kph"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.kph}
            onChange={handleChange}
          />
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <label htmlFor="year" className="block text-gray-700 font-bold mb-2">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.year}
            onChange={handleChange}
          />
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <label
            htmlFor="fuel_type"
            className="block text-gray-700 font-bold mb-2"
          >
            Fuel Type
          </label>
          <select
            id="fuel_type"
            name="fuel_type"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.fuel_type}
            onChange={handleChange}
          >
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Car Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Features</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div>
            <input
              type="checkbox"
              id="feature_CD Player"
              name="feature"
              value="CD Player"
              className="mr-2"
              checked={fields.features.includes("CD Player")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_CD Player">CD Player</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Bluetooth"
              name="feature"
              value="Bluetooth"
              className="mr-2"
              checked={fields.features.includes("Bluetooth")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Bluetooth">Bluetooth</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Navigation"
              name="feature"
              value="Navigation"
              className="mr-2"
              checked={fields.features.includes("Navigation")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Navigation">Navigation</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Sunroof"
              name="feature"
              value="Sunroof"
              className="mr-2"
              checked={fields.features.includes("Sunroof")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Sunroof">Sunroof</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Leather_Seats"
              name="feature"
              value="Leather Seats"
              className="mr-2"
              checked={fields.features.includes("Leather Seats")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Leather_Seats">Leather Seats</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Backup_Camera"
              name="feature"
              value="Backup Camera"
              className="mr-2"
              checked={fields.features.includes("Backup Camera")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Backup_Camera">Backup Camera</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Cruise_Control"
              name="feature"
              value="Cruise Control"
              className="mr-2"
              checked={fields.features.includes("Cruise Control")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Cruise_Control">Cruise Control</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Heated_Seats"
              name="feature"
              value="Heated Seats"
              className="mr-2"
              checked={fields.features.includes("Heated Seats")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Heated_Seats">Heated Seats</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Satellite_Radio"
              name="feature"
              value="Satellite Radio"
              className="mr-2"
              checked={fields.features.includes("Satellite Radio")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Satellite_Radio">Satellite Radio</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_Parking_Sensors"
              name="feature"
              value="Parking Sensors"
              className="mr-2"
              checked={fields.features.includes("Parking Sensors")}
              onChange={handleFeaturesChange}
            />
            <label htmlFor="feature_Parking_Sensors">Parking Sensors</label>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="seller_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Name
        </label>
        <input
          type="text"
          id="seller_name"
          name="seller_info.name"
          className="border rounded w-full py-2 px-3"
          placeholder="Name"
          value={fields.seller_info.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="seller_email"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Email
        </label>
        <input
          type="email"
          id="seller_email"
          name="seller_info.email"
          className="border rounded w-full py-2 px-3"
          placeholder="Email address"
          required
          value={fields.seller_info.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="seller_phone"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Phone
        </label>
        <input
          type="tel"
          id="seller_phone"
          name="seller_info.phone"
          className="border rounded w-full py-2 px-3"
          placeholder="Phone"
          value={fields.seller_info.phone}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
          Images (Select up to 4 images)
        </label>
        <input
          type="file"
          id="images"
          name="images"
          className="border rounded w-full py-2 px-3"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />
      </div>
      {publishError && (
        <p className="text-red-500 font-semibold mt-4">{publishError}</p>
      )}

      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Car
        </button>
      </div>
    </form>
  );
}
