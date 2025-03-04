"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import CarCard from "@/app/components/CarCard";
import Spinner from "@/app/components/Spinner";
import CarSearch from "@/app/components/CarSearch";

export default function SearchResults() {
  const searchParams = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("q");
  const fuel = searchParams.get("fuel");
  const transmission = searchParams.get("transmission");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (fuel) params.append("fuel", fuel);
        if (transmission) params.append("transmission", transmission);

        const response = await fetch(`/api/cars/search?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setCars(data.cars || []);
      } catch (error) {
        console.log(error);
        setCars([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, fuel, transmission]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-8">
        <div className="container px-4 mx-auto max-w-7xl">
          <CarSearch />
        </div>
      </section>

      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <section className="py-8">
          <div className="container px-4 mx-auto max-w-7xl">
            <Link
              href="/cars"
              className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaArrowAltCircleLeft className="mr-2" /> Back to Cars
            </Link>

            <h1 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
              Search Results
            </h1>

            {cars.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No search results found.
              </p>
            ) : (
              <div className="grid items-stretch grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
