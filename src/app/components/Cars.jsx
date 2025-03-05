"use client";

import React, { useState, useEffect } from "react";
import CarCard from "../components/CarCard";
import Spinner from "./Spinner";
import Pagination from "./Pagination";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setError(null);
        const url = new URL("/api/cars", window.location.origin);
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);

        // Add search/filter params
        const searchParams = new URLSearchParams(window.location.search);
        ["q", "fuel", "transmission"].forEach((param) => {
          const value = searchParams.get(param);
          if (value) {
            url.searchParams.set(param, value);
          }
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !data.cars) {
          throw new Error("Invalid data format received");
        }

        setCars(data.cars);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Available Cars
        </h1>
        {cars.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No cars found.
          </p>
        ) : (
          <div className="grid items-stretch grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
