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
        const bookmarks = await response.json();

        if (response.ok) {
          // Extract car data from bookmarks and ensure carId is populated
          const validCars = bookmarks
            .filter(
              (bookmark) => bookmark.carId && typeof bookmark.carId === "object"
            )
            .map((bookmark) => bookmark.carId);
          setCars(validCars);
        } else {
          toast.error(bookmarks.error || "Failed to fetch saved cars");
        }
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
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">
          Please sign in to view saved cars
        </h1>
      </div>
    );
  }

  if (user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
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
      <h2 className="text-2xl mb-4">Saved Cars</h2>
      <div className="container-xl lg:container m-auto px-4 py-6">
        {cars.length === 0 ? (
          <p>No saved cars</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
