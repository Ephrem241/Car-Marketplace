"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import app from "@/firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Alert, Button, FileInput } from "flowbite-react";
import Image from "next/image";

export default function CarUpdateForm({ id }) {
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    mileage: "",
    year: "",
    price: "",
    features: [],
    images: [],
    description: "",
    link: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "year") {
      const currentYear = new Date().getFullYear();
      if (value < 1900 || value > currentYear + 1) return;
    }
    const newValue = type === "number" ? Number(value) || "" : value;
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

  const removeImage = (index) => {
    setFields((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleUploadImages = async () => {
    try {
      setImageUploadError(null);
      if (!files?.length) {
        setImageUploadError("Please select at least one image");
        return;
      }

      // Check total number of images (existing + new)
      const totalImages = fields.images.length + files.length;
      if (totalImages > 4) {
        setImageUploadError(
          `Maximum 4 images allowed. You can only add ${
            4 - fields.images.length
          } more image(s).`
        );
        setFiles([]);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const invalidFiles = files.filter(
        (file) => !allowedTypes.includes(file.type)
      );
      if (invalidFiles.length > 0) {
        setImageUploadError("Only JPG, PNG, and GIF files are allowed");
        return;
      }

      const storage = getStorage(app);
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `car-images/${uuidv4()}-${file.name}`);
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

      const results = await Promise.allSettled(uploadPromises);
      const failedUploads = results.filter(
        ({ status }) => status === "rejected"
      );

      if (failedUploads.length > 0) {
        setImageUploadError(
          `${failedUploads.length} image(s) failed to upload`
        );
      }

      const successfulUploads = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // Final check to ensure we don't exceed 4 images
      if (fields.images.length + successfulUploads.length > 4) {
        setImageUploadError("Cannot add more than 4 images in total");
        return;
      }

      setFields((prev) => ({
        ...prev,
        images: [...prev.images, ...successfulUploads],
      }));
      setFiles([]);
    } catch (error) {
      setImageUploadError(`Upload failed: ${error.message}`);
    } finally {
      setImageUploadProgress({});
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const numericFields = ["year", "price", "kph", "mileage"];
      const formattedData = {
        ...fields,
        ...Object.fromEntries(
          Object.entries(fields).map(([key, value]) => [
            key,
            numericFields.includes(key) ? Number(value) : value,
          ])
        ),
      };

      const res = await fetch(`/api/cars/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update car");
      }

      const data = await res.json();

      setPublishError({
        type: "success",
        message: "Car updated successfully!",
      });

      // Use router.refresh() to update the page data
      router.refresh();

      // Wait a bit before redirecting to ensure the user sees the success message
      setTimeout(() => {
        router.push(`/cars/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setPublishError({
        type: "error",
        message: error.message || "Failed to update car",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      setIsLoading(true);
      try {
        if (!id) return;

        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch car");
        }

        const data = await res.json();
        setFields({
          ...data,
          year: data.year?.toString() || "",
          price: data.price?.toString() || "",
          kph: data.kph?.toString() || "",
          mileage: data.mileage?.toString() || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setPublishError({
          type: "error",
          message: error.message || "Failed to fetch car",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin dark:border-blue-400" />
        </div>
      ) : (
        <>
          <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800 dark:text-white">
            Update Car
          </h2>

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
              value={fields.carClass}
              onChange={handleChange}
            >
              <option value="">Select Car Class</option>
              <option value="Economy">Economy</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Car Make
            </label>
            <input
              type="text"
              name="make"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
              value={fields.make}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Car Model
            </label>
            <input
              type="text"
              name="model"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
              value={fields.model}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows="4"
              required
              value={fields.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              External Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="https://example.com"
              value={fields.link}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a link to more details about the car (e.g., tiktok website)
            </p>
          </div>
          <div className="w-full pl-2 sm:w-1/3">
            <label className="block mb-2 font-bold">Mileage</label>
            <input
              type="number"
              name="mileage"
              required
              value={fields.mileage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          <div className="flex flex-wrap mb-4">
            <div className="w-full pr-2 sm:w-1/3">
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
                value={fields.transmission}
                onChange={handleChange}
              >
                <option value="">Select Transmission</option>
                <option value="a">a</option>
                <option value="m">m</option>
              </select>
            </div>

            <div className="w-full px-2 sm:w-1/3">
              <label
                htmlFor="drive"
                className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
              >
                Drive
              </label>
              <select
                id="drive"
                name="drive"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
              <label
                htmlFor="kph"
                className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
              >
                KPH
              </label>
              <input
                type="number"
                id="kph"
                name="kph"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
                value={fields.kph}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Year
              </label>
              <input
                type="number"
                name="year"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={fields.year}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Price
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={fields.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
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
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Features
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <div>
                <input
                  type="checkbox"
                  id="feature_CD Player"
                  name="features"
                  value="CD Player"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("CD Player")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_CD Player"
                  className="dark:text-gray-200"
                >
                  CD Player
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Bluetooth"
                  name="features"
                  value="Bluetooth"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Bluetooth")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Bluetooth"
                  className="dark:text-gray-200"
                >
                  Bluetooth
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Navigation"
                  name="features"
                  value="Navigation"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Navigation")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Navigation"
                  className="dark:text-gray-200"
                >
                  Navigation
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Sunroof"
                  name="features"
                  value="Sunroof"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Sunroof")}
                  onChange={handleFeaturesChange}
                />
                <label htmlFor="feature_Sunroof" className="dark:text-gray-200">
                  Sunroof
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Leather_Seats"
                  name="features"
                  value="Leather Seats"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Leather Seats")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Leather_Seats"
                  className="dark:text-gray-200"
                >
                  Leather Seats
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Backup_Camera"
                  name="features"
                  value="Backup Camera"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Backup Camera")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Backup_Camera"
                  className="dark:text-gray-200"
                >
                  Backup Camera
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Cruise_Control"
                  name="features"
                  value="Cruise Control"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Cruise Control")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Cruise_Control"
                  className="dark:text-gray-200"
                >
                  Cruise Control
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Heated_Seats"
                  name="features"
                  value="Heated Seats"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Heated Seats")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Heated_Seats"
                  className="dark:text-gray-200"
                >
                  Heated Seats
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Satellite_Radio"
                  name="features"
                  value="Satellite Radio"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Satellite Radio")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Satellite_Radio"
                  className="dark:text-gray-200"
                >
                  Satellite Radio
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="feature_Parking_Sensors"
                  name="features"
                  value="Parking Sensors"
                  className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={fields.features.includes("Parking Sensors")}
                  onChange={handleFeaturesChange}
                />
                <label
                  htmlFor="feature_Parking_Sensors"
                  className="dark:text-gray-200"
                >
                  Parking Sensors
                </label>
              </div>
            </div>
          </div>

          {/* Enhanced image upload section */}
          <div className="flex flex-col gap-4 p-4 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-4">
                <FileInput
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  disabled={fields.images.length >= 4}
                  helperText={`${fields.images.length}/4 images`}
                  className="dark:text-gray-200"
                />
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  onClick={handleUploadImages}
                  disabled={!files.length || fields.images.length >= 4}
                >
                  Upload Images
                </Button>
              </div>
            </div>
            {Object.entries(imageUploadProgress).length > 0 && (
              <div className="flex flex-wrap gap-3">
                {Object.entries(imageUploadProgress).map(
                  ([fileName, progress]) => (
                    <div
                      key={fileName}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {fileName}
                      </span>
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={progress}
                          text={`${progress}%`}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            {imageUploadError && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {imageUploadError}
              </div>
            )}

            {fields.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {fields.images.map((img, index) => (
                  <div key={index} className="relative w-40 h-32 group">
                    <Image
                      src={img}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {publishError && (
            <Alert color={publishError.type} className="mt-4">
              {publishError.message}
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isSubmitting}
            gradientDuoTone="purpleToBlue"
          >
            {isSubmitting ? "Updating..." : "Update Car"}
          </Button>
        </>
      )}
    </form>
  );
}
