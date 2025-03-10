"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaBookmark } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

// Add timeout promise
const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

export default function BookmarkButton({ car }) {
  const { isSignedIn, user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Function to extract car ID
  const getCarId = useCallback(
    () => (typeof car === "object" && car !== null ? car._id || car.id : car),
    [car]
  );

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const id = getCarId();
        if (!id) {
          setError("Invalid car ID");
          toast.error("Invalid car ID");
          return;
        }

        const res = await fetchWithTimeout(`/api/bookmarks/check/${id}`);

        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
          setError(null);
        } else {
          if (res.status === 408) {
            setError("Request timed out");
            toast.error("Request timed out, please try again");
          } else {
            setError("Failed to check bookmark status");
            toast.error("Failed to check bookmark status");
          }
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        if (error.message === "Request timeout") {
          setError("Request timed out");
          toast.error("Request timed out, please try again");
        } else {
          setError("Failed to check bookmark status");
          toast.error("Failed to check bookmark status");
        }
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [car, isSignedIn, getCarId]);

  const handleClick = useCallback(async () => {
    if (isProcessing) return;

    if (!isSignedIn) {
      toast.error("Please login to bookmark cars");
      return;
    }
    if (user?.publicMetadata?.userMongoId === "admin") {
      toast.error("Admins cannot bookmark cars");
      return;
    }

    try {
      setIsProcessing(true);
      const id = getCarId();
      if (!id) {
        toast.error("Invalid car ID");
        return;
      }

      const res = await fetchWithTimeout("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
        setError(null);
        toast.success(data.message);
      } else {
        if (res.status === 429) {
          setError("Too many requests");
          toast.error("Too many requests. Please try again later.");
        } else if (res.status === 408) {
          setError("Request timed out");
          toast.error("Request timed out, please try again");
        } else {
          setError(data.error || "Failed to update bookmark");
          toast.error(data.error || "Failed to update bookmark");
        }
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      if (error.message === "Request timeout") {
        setError("Request timed out");
        toast.error("Request timed out, please try again");
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isSignedIn, user, getCarId, isProcessing]);

  const debouncedHandleClick = useMemo(
    () => debounce(handleClick, 300),
    [handleClick]
  );

  if (loading) {
    return (
      <p className="text-center text-gray-500 animate-pulse">Loading...</p>
    );
  }

  if (error && !isProcessing) {
    return (
      <button
        onClick={debouncedHandleClick}
        className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 transition"
      >
        <FaBookmark className="mr-2" />
        Retry
      </button>
    );
  }

  return (
    <button
      onClick={debouncedHandleClick}
      disabled={isProcessing}
      className={`flex items-center justify-center w-full px-4 py-2 font-bold text-white rounded-full transition 
        ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isBookmarked
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
    >
      <FaBookmark className="mr-2" />
      {isProcessing
        ? "Processing..."
        : isBookmarked
        ? "Remove Bookmark"
        : "Bookmark Car"}
    </button>
  );
}
