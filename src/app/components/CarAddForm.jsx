import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";

export default function CarAddForm() {
  const { session } = useSession();
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    description: "This is a sample car description.",
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const user = session.user;
    if (user?.publicMetadata?.isAdmin) {
      setIsAdmin(true);
    } else {
      router.push("/"); // Redirect non-admins
    }
    setLoading(false);
  }, [session, router]);

  if (loading) return <p>Loading...</p>;

  if (!isAdmin) return <p>Unauthorized</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
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
    setIsSubmitting(true);
    setPublishError(null);

    const formData = new FormData();

    // Append all fields to formData
    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, fields[key]);
      }
    });

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.error || "Failed to add car");
        return;
      }

      router.push(`/cars/${data._id}`);
    } catch (error) {
      setPublishError("Network error - please check your connection");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="mb-6 text-3xl font-semibold text-center">Add Car</h2>

      <div className="mb-4">
        <label
          htmlFor="car_type"
          className="block mb-2 font-bold text-gray-700"
        >
          Car Type
        </label>
        <select
          id="class"
          name="class"
          className="w-full px-3 py-2 border rounded"
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
        <label className="block mb-2 font-bold text-gray-700">Car Make</label>
        <input
          type="text"
          name="make"
          className="w-full px-3 py-2 border rounded"
          required
          value={fields.make}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">Car Model</label>
        <input
          type="text"
          name="model"
          className="w-full px-3 py-2 border rounded"
          required
          value={fields.model}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          className="w-full px-3 py-2 border rounded"
          rows="4"
          required
          value={fields.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="flex flex-wrap mb-4">
        <div className="w-full pr-2 sm:w-1/3">
          <label
            htmlFor="transmission"
            className="block mb-2 font-bold text-gray-700"
          >
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            className="w-full px-3 py-2 border rounded"
            required
            value={fields.transmission}
            onChange={handleChange}
          >
            <option value="">Select Transmission</option>
            <option value="a">a</option>
            <option value="m">m</option>
          </select>
        </div>

        <div className="w-full px-2 sm:w-1/3">
          <label htmlFor="drive" className="block mb-2 font-bold text-gray-700">
            Drive
          </label>
          <select
            id="drive"
            name="drive"
            className="w-full px-3 py-2 border rounded"
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
        <div className="w-full pl-2 sm:w-1/3">
          <label htmlFor="kph" className="block mb-2 font-bold text-gray-700">
            KPH
          </label>
          <input
            type="number"
            id="kph"
            name="kph"
            className="w-full px-3 py-2 border rounded"
            required
            value={fields.kph}
            onChange={handleChange}
          />
        </div>
        <div className="w-full pl-2 sm:w-1/3">
          <label htmlFor="year" className="block mb-2 font-bold text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            className="w-full px-3 py-2 border rounded"
            required
            value={fields.year}
            onChange={handleChange}
          />
        </div>
        <div className="w-full pl-2 sm:w-1/3">
          <label
            htmlFor="fuel_type"
            className="block mb-2 font-bold text-gray-700"
          >
            Fuel Type
          </label>
          <select
            id="fuel_type"
            name="fuel_type"
            className="w-full px-3 py-2 border rounded"
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
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Car Price
          </label>
          <input
            type="number"
            name="price"
            className="w-full px-3 py-2 border rounded"
            required
            value={fields.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">Features</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          <div>
            <input
              type="checkbox"
              id="feature_CD Player"
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
              name="features"
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
        <label className="block mb-2 font-bold text-gray-700">
          Images (Max 4)
        </label>
        <input
          type="file"
          name="images"
          className="w-full px-3 py-2 border rounded"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />
      </div>
      {publishError && (
        <p className="mt-4 font-semibold text-red-500">{publishError}</p>
      )}

      <div>
        <button
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Car..." : "Add Car"}
        </button>
      </div>
    </form>
  );
}
