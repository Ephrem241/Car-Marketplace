"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import "react-circular-progressbar/dist/styles.css";

import { Alert, Button } from "flowbite-react";

import CarFormFields from "./shared/CarFormFields";
import ImageUpload from "./shared/ImageUpload";

export default function CarUpdateForm({ id }) {
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      if (fields.images.length > 12) {
        throw new Error("Maximum of 12 images allowed");
      }

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

          <CarFormFields
            fields={fields}
            handleChange={handleChange}
            handleFeaturesChange={handleFeaturesChange}
          />

          <ImageUpload
            images={fields.images}
            onImagesChange={(newImages) => {
              if (newImages.length > 12) {
                setPublishError({
                  type: "error",
                  message: "Maximum of 12 images allowed",
                });
                return;
              }
              setFields((prev) => ({ ...prev, images: newImages }));
            }}
          />

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
