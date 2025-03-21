import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { app } from "@/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button, FileInput } from "flowbite-react";
import Image from "next/image";
import PropTypes from "prop-types";

const MAX_IMAGES = 12;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default function ImageUpload({ images, onImagesChange }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);

  const validateFiles = (files) => {
    const invalidFiles = files.filter(
      (file) => file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      return "Invalid files detected. Images must be under 10MB and be valid image files (JPG, PNG, GIF).";
    }

    const totalImages = images.length + files.length;
    if (totalImages > MAX_IMAGES) {
      return `Maximum ${MAX_IMAGES} images allowed. You can only add ${
        MAX_IMAGES - images.length
      } more image(s).`;
    }

    return null;
  };

  const handleUploadImages = async () => {
    try {
      setImageUploadError(null);
      if (!files?.length) {
        setImageUploadError("Please select at least one image");
        return;
      }

      const validationError = validateFiles(files);
      if (validationError) {
        setImageUploadError(validationError);
        setFiles([]);
        return;
      }

      setUploading(true);
      const storage = getStorage(app);

      const uploadPromises = files.map(async (file) => {
        const fileName = new Date().getTime() + "-" + file.name;
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

      const urls = await Promise.allSettled(uploadPromises);
      const successfulUploads = urls
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      onImagesChange([...images, ...successfulUploads]);
    } catch (error) {
      console.error("Upload error details:", error);
      setImageUploadError("Image upload failed - please try again");
    } finally {
      setFiles([]);
      setImageUploadProgress({});
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <FileInput
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            disabled={uploading || images.length >= MAX_IMAGES}
            className="cursor-pointer dark:text-gray-200"
            helperText={`${images.length}/${MAX_IMAGES} images uploaded`}
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
        {images.length >= MAX_IMAGES && (
          <p className="text-sm text-red-500 dark:text-red-400">
            Maximum number of images ({MAX_IMAGES}) reached
          </p>
        )}
      </div>

      {Object.entries(imageUploadProgress).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(imageUploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex flex-col items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {fileName}
              </span>
              <div className="w-16 h-16">
                <CircularProgressbar value={progress} text={`${progress}%`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {imageUploadError && (
        <div className="text-sm text-red-500 dark:text-red-400">
          {imageUploadError}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, index) => (
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
  );
}

ImageUpload.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onImagesChange: PropTypes.func.isRequired,
};
