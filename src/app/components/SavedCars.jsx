"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CarCard from "./CarCard";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

export default function SavedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchSavedCars = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        const data = await response.json();

        if (!response.ok) {
          console.error(`Failed to fetch bookmarks: ${JSON.stringify(data)}`);
          toast.error(data.error || "Failed to fetch saved cars");
          setLoading(false);
          return;
        }

        // Filter out any invalid or deleted cars
        const validCars = data
          .filter((bookmark) => {
            if (!bookmark.carId) {
              console.warn(`Bookmark found with no carId: ${bookmark._id}`);
              return false;
            }
            if (typeof bookmark.carId !== "object") {
              console.warn(
                `Bookmark found with invalid carId type: ${bookmark._id}`
              );
              return false;
            }
            // Check if the car has required properties
            if (!bookmark.carId.make || !bookmark.carId.model) {
              console.warn(`Bookmark references deleted car: ${bookmark._id}`);
              return false;
            }
            return true;
          })
          .map((bookmark) => bookmark.carId);

        if (validCars.length === 0) {
          if (data.length > 0) {
            console.warn("No valid cars found in bookmarks");
            toast.info("Some saved cars may have been removed");
          }
          setCars([]);
          setLoading(false);
          return;
        }

        setCars(validCars);
      } catch (error) {
        console.error("Error fetching saved cars:", error);
        toast.error("Failed to fetch saved cars");
      } finally {
        setLoading(false);
      }
    };

    if (user && !user.publicMetadata?.isAdmin) {
      fetchSavedCars();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!isLoaded) {
    return <Spinner loading={true} />;
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center py-7 w-full h-full">
        <h1 className="text-2xl font-semibold">
          Please sign in to view saved cars
        </h1>
      </div>
    );
  }

  if (user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center py-7 w-full h-full">
        <h1 className="text-2xl font-semibold">
          Saved cars not available for admin users
        </h1>
      </div>
    );
  }

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <h2 className="mb-4 text-2xl">Saved Cars</h2>
      <div className="px-4 py-6 m-auto container-xl lg:container">
        {cars.length === 0 ? (
          <p>No saved cars</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
