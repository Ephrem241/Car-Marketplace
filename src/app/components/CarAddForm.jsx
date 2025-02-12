import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Alert, Button, FileInput } from "flowbite-react";
import Image from "next/image";

export default function CarAddForm() {
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [fields, setFields] = useState({
    kph: "",
    carClass: "",
    drive: "",
    fuel_type: "",
    make: "",
    model: "",
    transmission: "",
    year: "",
    price: "",
    features: [],
    images: [],
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "number" ? Number(value) || 0 : checked ? checked : value;
    setFields((prevFields) => ({ ...prevFields, [name]: newValue }));
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

  const handleUploadImages = async () => {
    try {
      setImageUploadError(null);
      if (!files || files.length === 0) {
        setImageUploadError("Please select at least one image");
        return;
      }

      const totalImages = fields.images.length + files.length;
      if (totalImages > 4) {
        setImageUploadError(
          `You can only upload up to 4 images (${fields.images.length} already uploaded)`
        );
        setFiles([]);
        return;
      }

      const storage = getStorage(app);
      setUploading(true);

      const uploadPromises = files.map(async (file) => {
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setImageUploadProgress((prev) => ({
                ...prev,
                [fileName]: progress,
              }));
            },

            (error) => reject(error),
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      });

      const urls = await Promise.allSettled(uploadPromises);
      const successfulUploads = urls
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      setFields((prev) => ({
        ...prev,
        images: [...prev.images, ...successfulUploads],
      }));
    } catch (error) {
      setImageUploadError("Image upload failed");
    } finally {
      setFiles([]);
      setImageUploadProgress({});
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    if (fields.images.length === 0) {
      setPublishError("Please upload at least one image");
      setIsSubmitting(false);
      return;
    }

    if (isSubmitting) return;

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add car");
      }

      router.push(`/cars/${data._id}`);
    } catch (error) {
      setPublishError(
        error.message || "Network error - please check your connection"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
        Add Car
      </h2>

      <div className="mb-4">
        <label
          htmlFor="carClass"
          className="block mb-2 font-bold text-gray-700"
        >
          Car Class
        </label>
        <select
          id="carClass"
          name="carClass"
          className="w-full px-3 py-2 border rounded"
          required
          value={fields.carClass}
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
        <label className="block mb-2 text-gray-700 font-semibold">
          Car Make
        </label>
        <input
          type="text"
          name="make"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          value={fields.make}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-semibold">
          Car Model
        </label>
        <input
          type="text"
          name="model"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          value={fields.model}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-semibold">
          Description
        </label>
        <textarea
          name="description"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="block mb-2 text-gray-700 font-semibold"
          >
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            value={fields.drive}
            onChange={handleChange}
          >
            <option value="">Select Drive Type</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
            <option value="4WD">4WD</option>
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
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
        <div className="w-full pl-2 sm:w-1/3">
          <label className="block mb-2 font-bold text-gray-700">
            Car Price
          </label>
          <input
            type="number"
            name="price"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
            step="0.01"
            value={fields.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-semibold">
          Features
        </label>
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

      <div className="flex flex-col gap-4 p-4 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <FileInput
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              disabled={uploading || fields.images.length >= 4}
              className="cursor-pointer"
              helperText={`${fields.images.length}/4 images uploaded`}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImages}
              disabled={uploading || files.length === 0}
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
          {fields.images.length >= 4 && (
            <p className="text-sm text-red-500">
              Maximum number of images (4) reached
            </p>
          )}
        </div>

        {Object.entries(imageUploadProgress).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {Object.entries(imageUploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-700">{fileName}</span>
                <div className="w-16 h-16">
                  <CircularProgressbar value={progress} text={`${progress}%`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {fields.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fields.images.map((img, index) => (
              <div key={index} className="relative w-40 h-32">
                <Image
                  src={img}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {publishError && <Alert color="failure">{publishError}</Alert>}

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Adding Car..." : "Add Car"}
      </Button>
    </form>
  );
}
