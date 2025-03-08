"use client";

import Image from "next/image";
import { useState } from "react";

export default function CarImage({ src, alt, ...props }) {
  const [error, setError] = useState(false);

  // If src is empty string or undefined, use default image
  const imageSource = !src || src === "" ? "/images/default-car.jpg" : src;

  return (
    <Image
      src={error ? "/images/default-car.jpg" : imageSource}
      alt={alt || "Car image"}
      onError={() => setError(true)}
      {...props}
    />
  );
}
