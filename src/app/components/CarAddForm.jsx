import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Alert, Button } from "flowbite-react";
import CarFormFields from "./shared/CarFormFields";
import ImageUpload from "./shared/ImageUpload";

export default function CarAddForm() {
  const { user } = useUser();
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    mileage: "",
    features: [],
    images: [],
    description: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === "number") {
      switch (name) {
        case "year":
          const yearNum = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (!yearNum || yearNum < 1900 || yearNum > currentYear + 1) {
            newValue = "";
          } else {
            newValue = yearNum;
          }
          break;
        case "price":
          const priceNum = parseFloat(value);
          newValue = !isNaN(priceNum) && priceNum >= 0 ? priceNum : "";
          break;
        case "kph":
          const kphNum = parseInt(value);
          newValue = !isNaN(kphNum) && kphNum >= 0 ? kphNum : "";
          break;
        case "mileage":
          const mileageNum = parseInt(value);
          newValue = !isNaN(mileageNum) && mileageNum >= 0 ? mileageNum : "";
          break;
        default:
          newValue = value ? Number(value) : "";
      }
    }

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

    // Validate required fields
    const requiredFields = [
      "make",
      "model",
      "year",
      "price",
      "kph",
      "mileage",
      "carClass",
      "drive",
      "fuel_type",
      "transmission",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      setPublishError({
        type: "error",
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
      });
      setIsSubmitting(false);
      return;
    }

    if (fields.images.length === 0) {
      setPublishError({
        type: "error",
        message: "Please upload at least one image",
      });
      setIsSubmitting(false);
      return;
    }

    if (isSubmitting) return;

    try {
      // Convert numeric fields
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

      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add car");
      }

      router.push(`/cars/${data._id}`);
    } catch (error) {
      console.error("Add car error:", error);
      let errorMessage = "Failed to add car";

      if (error.message) {
        errorMessage = error.message;
      }

      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `${errorMessage} (Status: ${error.response.status})`;
        }
      }

      setPublishError({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800 dark:text-white">
        Add Car
      </h2>

      <CarFormFields
        fields={fields}
        handleChange={handleChange}
        handleFeaturesChange={handleFeaturesChange}
      />

      <ImageUpload
        images={fields.images}
        onImagesChange={(newImages) =>
          setFields((prev) => ({ ...prev, images: newImages }))
        }
      />

      {publishError && <Alert color="failure">{publishError.message}</Alert>}

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isSubmitting}
        gradientDuoTone="purpleToBlue"
      >
        {isSubmitting ? "Adding Car..." : "Add Car"}
      </Button>
    </form>
  );
}
