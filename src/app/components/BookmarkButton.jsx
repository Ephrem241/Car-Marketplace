"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaBookmark } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

// Add timeout promise with increased timeout for bookmark operations
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Add cache control headers to prevent stale responses
      headers: {
        ...options.headers,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
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
  const [pendingRequests, setPendingRequests] = useState([]);

  // Function to extract car ID
  const getCarId = useCallback(
    () => (typeof car === "object" && car !== null ? car._id || car.id : car),
    [car]
  );

  const retryOperation = async (operation, maxRetries = 2, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  };

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const id = getCarId();
        if (!id) {
          console.warn("Invalid car ID provided to BookmarkButton");
          setError("Invalid car ID");
          setLoading(false);
          return;
        }

        // Ensure we have a valid ID before making the request
        if (typeof id !== "string" && typeof id !== "number") {
          console.warn("Invalid car ID type:", typeof id);
          setError("Invalid car ID type");
          setLoading(false);
          return;
        }

        // Add retry logic for the check operation
        const checkOperation = async () => {
          const res = await fetchWithTimeout(`/api/bookmarks/check/${id}`);
          const data = await res.json();

          if (!res.ok) {
            const errorMessage =
              data.error || "Failed to check bookmark status";
            throw new Error(errorMessage);
          }

          return data;
        };

        const data = await retryOperation(checkOperation);

        if (typeof data.isBookmarked !== "boolean") {
          console.warn(
            "Invalid response format - isBookmarked not boolean:",
            data
          );
          setError("Invalid server response");
          toast.error("Something went wrong");
          return;
        }

        setIsBookmarked(data.isBookmarked);
        setError(null);
      } catch (error) {
        console.warn("Error in checkBookmarkStatus:", error);
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
    if (user?.publicMetadata?.isAdmin) {
      toast.error("Admins cannot bookmark cars");
      return;
    }

    // Get car ID before setting any state
    const id = getCarId();
    if (!id) {
      toast.error("Invalid car ID");
      return;
    }

    // Optimistic update
    setIsProcessing(true);
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      // Add retry logic for the bookmark operation
      const bookmarkOperation = async () => {
        const res = await fetchWithTimeout("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carId: id }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update bookmark");
        }
        return data;
      };

      const data = await retryOperation(bookmarkOperation);
      setError(null);
      toast.success(data.message);
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(previousState);
      console.warn("Error updating bookmark:", error);

      if (error.message === "Request timeout") {
        setError("Request timed out");
        toast.error("Request timed out, please try again");
      } else if (error.message.includes("Too many requests")) {
        setError("Too many requests");
        toast.error("Too many requests. Please try again later.");
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isSignedIn, user, getCarId, isProcessing, isBookmarked]);

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
        className="flex justify-center items-center px-4 py-2 w-full font-bold text-white bg-gray-500 rounded-full transition hover:bg-gray-600"
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
