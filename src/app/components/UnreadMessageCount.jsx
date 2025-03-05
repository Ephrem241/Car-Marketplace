"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function UnreadMessageCount() {
  const { unreadCount, setUnreadCount } = useGlobalContext();
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        if (!response.ok) {
          throw new Error("Failed to fetch unread count");
        }
        const data = await response.json();
        setUnreadCount(data);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up interval
    const id = setInterval(fetchUnreadCount, 30000);
    setIntervalId(id);

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId, setUnreadCount]);

  return (
    unreadCount > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full dark:bg-red-700">
        {unreadCount}
      </span>
    )
  );
}
