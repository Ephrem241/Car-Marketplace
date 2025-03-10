"use client";

import React, { useState, useEffect } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";

const TRANSMISSION_OPTIONS = [
  { value: "", label: "Any Transmission" },
  { value: "a", label: "Automatic" },
  { value: "m", label: "Manual" },
];

const CAR_CLASSES = [
  { value: "", label: "Any Class" },
  { value: "Economy", label: "Economy" },
  { value: "Luxury", label: "Luxury" },
  { value: "Sports", label: "Sports" },
  { value: "SUV", label: "SUV" },
  { value: "Truck", label: "Truck" },
  { value: "Van", label: "Van" },
];

const currentYear = new Date().getFullYear();

export default function CarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [carClass, setCarClass] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Sync state with URL parameters
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setFuelType(searchParams.get("fuel") || "");
    setTransmission(searchParams.get("transmission") || "");
    setCarClass(searchParams.get("class") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinYear(searchParams.get("minYear") || "");
    setMaxYear(searchParams.get("maxYear") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (searchQuery.trim()) urlParams.set("q", searchQuery.trim());
    if (fuelType) urlParams.set("fuel", fuelType);
    if (transmission) urlParams.set("transmission", transmission);
    if (carClass) urlParams.set("class", carClass);
    if (minPrice) urlParams.set("minPrice", minPrice);
    if (maxPrice) urlParams.set("maxPrice", maxPrice);
    if (minYear) urlParams.set("minYear", minYear);
    if (maxYear) urlParams.set("maxYear", maxYear);

    router.push(
      `/cars/search-results${urlParams.toString() ? `?${urlParams}` : ""}`
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setFuelType("");
    setTransmission("");
    setCarClass("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    router.push("/cars");
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Search and Basic Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search cars..."
              rightIcon={AiOutlineSearch}
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search cars"
            />
          </div>

          <div className="w-full md:w-44">
            <Select
              value={carClass}
              onChange={(e) => setCarClass(e.target.value)}
              aria-label="Select car class"
              className="w-full"
            >
              {CAR_CLASSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full md:w-44">
            <Select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              aria-label="Select fuel type"
              className="w-full"
            >
              <option value="">Any Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div className="w-full md:w-44">
            <Select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              aria-label="Select transmission type"
              className="w-full"
            >
              {TRANSMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Price and Year Range Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Min Price
              </label>
              <TextInput
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Max Price
              </label>
              <TextInput
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex-1 flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Min Year
              </label>
              <TextInput
                type="number"
                placeholder="Min Year"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                min="1900"
                max={currentYear + 1}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Max Year
              </label>
              <TextInput
                type="number"
                placeholder="Max Year"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                min="1900"
                max={currentYear + 1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Search
          </Button>
          <Button color="gray" onClick={handleReset} className="px-6">
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
