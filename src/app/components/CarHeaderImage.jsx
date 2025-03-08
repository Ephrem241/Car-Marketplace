import Image from "next/image";
import React from "react";

export default function CarHeaderImage({ image }) {
  // If image is empty string or undefined, use a default image
  const imageSource = image || "/images/default-car.jpg";

  return (
    <section>
      <div className="m-auto container-xl">
        <div className="grid grid-cols-1">
          <Image
            src={imageSource}
            alt="Car header image"
            className="object-cover h-[400px] w-full"
            width={0}
            height={0}
            sizes="100vw"
            priority={true}
          />
        </div>
      </div>
    </section>
  );
}
