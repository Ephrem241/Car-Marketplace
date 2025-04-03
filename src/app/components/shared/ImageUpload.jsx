"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import Image from "next/image";

export default function ImageUpload({ images, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size
    const validFiles = files.filter((file) => file.size <= 20 * 1024 * 1024);
    const invalidFiles = files.filter((file) => file.size > 20 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setUploadError("Some files exceed the 20MB size limit.");
      return;
    }

    setSelectedFiles(validFiles);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    await onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
      />
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}

      <Button
        className="mt-3"
        gradientDuoTone="purpleToBlue"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
      >
        Upload Images
      </Button>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt="Car image"
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  );
}
