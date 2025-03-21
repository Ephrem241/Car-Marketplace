import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Alert, Button } from "flowbite-react";
import CarFormFields from "./shared/CarFormFields";
import ImageUpload from "./shared/ImageUpload";
import { validateCarData, validateImageFile } from "@/utils/validation";

export default function CarAddForm() {
  const { user } = useUser();
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
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
      const numValue = Number(value);
      newValue = !isNaN(numValue) ? numValue : "";
    }

    setFields((prevFields) => ({ ...prevFields, [name]: newValue }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);
    setFieldErrors({});

    const validation = validateCarData(fields);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        if (key === "images") {
          fields.images.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        } else if (key === "features") {
          fields.features.forEach((feature) =>
            formData.append("features", feature)
          );
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add car");
      }

      router.push(`/cars/${data._id}`);
    } catch (error) {
      console.error("Add car error:", error);
      setPublishError({
        type: "error",
        message: error.message || "Failed to add car",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mx-auto max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800 dark:text-white">
        Add Car
      </h2>

      <CarFormFields
        fields={fields}
        errors={fieldErrors}
        handleChange={handleChange}
        handleFeaturesChange={handleFeaturesChange}
      />

      <ImageUpload
        images={fields.images}
        onImagesChange={(newImages) =>
          setFields((prev) => ({ ...prev, images: newImages }))
        }
        validateFile={validateImageFile}
        error={fieldErrors.images}
        maxFiles={12}
      />

      {publishError && (
        <Alert color="failure" className="mt-4">
          {publishError.message}
        </Alert>
      )}

      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={isSubmitting}
        gradientDuoTone="purpleToBlue"
      >
        {isSubmitting ? "Adding Car..." : "Add Car"}
      </Button>
    </form>
  );
}
