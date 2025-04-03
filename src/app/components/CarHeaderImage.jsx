import Image from "next/image";
import React from "react";

export default function CarHeaderImage({ imageUrl, title }) {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
    </div>
  );
}
