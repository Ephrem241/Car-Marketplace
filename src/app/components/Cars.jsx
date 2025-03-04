"use client";

import React, { useState, useEffect } from "react";
import CarCard from "../components/CarCard";
import Spinner from "./Spinner";
import Pagination from "./Pagination";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `/api/cars?page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCars(data.cars);
        setTotalItems(data.total);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner />
  ) : (
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
