"use client";

import Image from "next/image";
import { useState } from "react";

export default function CarImage({ src, alt, ...props }) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? "/images/default-car.jpg" : src}
      alt={alt || "Car image"}
      onError={() => setError(true)}
      {...props}
    />
  );
}
