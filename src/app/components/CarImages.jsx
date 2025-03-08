import Image from "next/image";
import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";

export default function CarImages({ images }) {
  // Return null if images is undefined or empty
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const defaultImage = "/images/default-car.jpg";

  // Ensure all images in the array are valid strings
  const validImages = images.map((img) =>
    typeof img === "string" && img ? img : defaultImage
  );

  return (
    <Gallery>
      <section className="p-4 bg-blue-50">
        <div className="container mx-auto">
          {validImages.length === 1 ? (
            <Item
              original={validImages[0]}
              thumbnail={validImages[0]}
              width={1000}
              height={600}
            >
              {({ ref, open }) => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={validImages[0]}
                  alt="Car image"
                  className="object-cover h-[400px] mx-auto rounded-xl"
                  width={1000}
                  height={600}
                  priority={true}
                />
              )}
            </Item>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {validImages.map((image, index) => (
                <div
                  key={index}
                  className={`${
                    validImages.length === 3 && index === 2
                      ? "col-span-2"
                      : "col-span-1"
                  }`}
                >
                  <Item
                    original={image}
                    thumbnail={image}
                    width={1000}
                    height={600}
                  >
                    {({ ref, open }) => (
                      <Image
                        ref={ref}
                        onClick={open}
                        src={image}
                        alt={`Car image ${index + 1}`}
                        className="object-cover h-[400px] w-full rounded-xl"
                        width={1000}
                        height={600}
                        priority={index === 0}
                        loading={index > 0 ? "lazy" : "eager"}
                      />
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
}
