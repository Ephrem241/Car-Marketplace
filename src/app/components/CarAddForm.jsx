"use client";

import { useState, useEffect } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/fairbase";

export default function CarAddForm() {
  const [fields, setFields] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    price: "",
    features: [],
    images: [],
  });

  const [submitError, setSubmitError] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleFeaturesChange = (e) => {
    const { value, checked } = e.target;
    setFields((prevFields) => {
      const updatedFeatures = checked
        ? [...prevFields.features, value]
        : prevFields.features.filter((feature) => feature !== value);
      return { ...prevFields, features: updatedFeatures };
    });
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(fields).forEach((key) => {
        if (key === "images") {
          fields[key].forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, fields[key]);
        }
      });

      const res = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setSubmitError(errorData.message || "Failed to submit the form");
        return;
      }

      setSubmitError(null);
      alert("Car added successfully!");
    } catch (error) {
      setSubmitError("Something went wrong");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextInput
        id="make"
        name="make"
        placeholder="Enter car make"
        required
        value={fields.make}
        onChange={handleChange}
      />
      <TextInput
        id="model"
        name="model"
        placeholder="Enter car model"
        required
        value={fields.model}
        onChange={handleChange}
      />
      <TextInput
        id="year"
        name="year"
        type="number"
        placeholder="Enter car year"
        required
        value={fields.year}
        onChange={handleChange}
      />
      <TextInput
        id="mileage"
        name="mileage"
        type="number"
        placeholder="Enter mileage"
        required
        value={fields.mileage}
        onChange={handleChange}
      />
      <Select
        id="fuel_type"
        name="fuel_type"
        required
        value={fields.fuel_type}
        onChange={handleChange}
      >
        <option value="">Select Fuel Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
      </Select>
      <Select
        id="transmission"
        name="transmission"
        required
        value={fields.transmission}
        onChange={handleChange}
      >
        <option value="">Select Transmission</option>
        <option value="Manual">Manual</option>
        <option value="Automatic">Automatic</option>
      </Select>
      <TextInput
        id="price"
        name="price"
        type="number"
        placeholder="Enter price"
        required
        value={fields.price}
        onChange={handleChange}
      />

      <h3 className="text-lg font-semibold">Features</h3>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <div>
          <input
            type="checkbox"
            id="feature_air_conditioning"
            name="features"
            value="Air Conditioning"
            className="mr-2"
            checked={fields["Feature Air Conditioning"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_air_conditioning">Air Conditioning</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="feature_gps"
            name="features"
            value="GPS"
            className="mr-2"
            checked={fields["Feature GPS"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_gps">GPS</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="feature_leather_seats"
            name="features"
            value="Leather Seats"
            className="mr-2"
            checked={fields["Feature Leather Seats"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_leather_seats">Leather Seats</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="feature_heated_seats"
            name="features"
            value="Heated Seats"
            className="mr-2"
            checked={fields["Feature Heated Seats"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_heated_seats">Heated Seats</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="feature_sunroof"
            name="features"
            value="Sunroof"
            className="mr-2"
            checked={fields["Feature Sunroof"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_sunroof">Sunroof</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="feature_backup_camera"
            name="features"
            value="Backup Camera"
            className="mr-2"
            checked={fields["Feature Backup Camera"]}
            onChange={handleChange}
          />
          <label htmlFor="feature_backup_camera">Backup Camera</label>
        </div>
      </div>
      <h3 className="gap-2 text-lg">
        <label className="mb-2 font-semibold " htmlFor="images">
          Images (Select up to 4 images)
        </label>
      </h3>
      <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted">
        <FileInput
          id="images"
          name="images"
          accept="image/*"
          multiple
          onChange={(e) => setFile(Array.from(e.target.files))}
        />
        <Button
          type="button"
          gradientDuoTone="purpleToBlue"
          size="sm"
          outline
          onClick={handleUploadImage}
          disabled={imageUploadProgress}
        >
          {imageUploadProgress ? (
            <div className="w-16 h-16 ">
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            </div>
          ) : (
            "Upload Image"
          )}
        </Button>
      </div>

      {submitError && <Alert color="failure">{submitError}</Alert>}
      <Button type="submit" gradientDuoTone="purpleToPink">
        Add Car
      </Button>
    </form>
  );
}
