"use client";

import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function BookmarkButton({ car }) {
  const { isSignedIn, user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to extract car ID
  const getCarId = () =>
    typeof car === "object" && car !== null ? car._id || car.id : car;

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const id = getCarId();
        if (!id) {
          toast.error("Invalid car ID");
          return;
        }

        const res = await fetch(`/api/bookmarks/check/${id}`);
        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        toast.error("Failed to check bookmark status");
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [car, isSignedIn]);

  const handleClick = async () => {
    if (!isSignedIn) {
      toast.error("Please login to bookmark cars");
      return;
    }
    if (user?.publicMetadata?.userMongoId === "admin") {
      toast.error("Admins cannot bookmark cars");
      return;
    }

    try {
      const id = getCarId();
      if (!id) {
        toast.error("Invalid car ID");
        return;
      }

      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
        toast.success(data.message);
      } else {
        toast.error(data.error || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 animate-pulse">Loading...</p>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-full px-4 py-2 font-bold text-white rounded-full transition 
        ${
          isBookmarked
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
    >
      <FaBookmark className="mr-2" />
      {isBookmarked ? "Remove Bookmark" : "Bookmark Car"}
    </button>
  );
}
