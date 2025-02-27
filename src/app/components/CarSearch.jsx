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

export default function CarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");

  // Sync state with URL parameters
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setFuelType(searchParams.get("fuel") || "");
    setTransmission(searchParams.get("transmission") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (searchQuery.trim()) urlParams.set("q", searchQuery.trim());
    if (fuelType) urlParams.set("fuel", fuelType);
    if (transmission) urlParams.set("transmission", transmission);

    router.push(
      `/cars/search-results${urlParams.toString() ? `?${urlParams}` : ""}`
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setFuelType("");
    setTransmission("");
    router.push("/cars");
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
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

          <div className="w-full md:w-48">
            <Select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              aria-label="Select fuel type"
            >
              <option value="">Any Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              aria-label="Select transmission type"
            >
              {TRANSMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Search
          </Button>
          <Button color="gray" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
