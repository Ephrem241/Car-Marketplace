"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUser } from "@clerk/nextjs";

export default function UnreadMessageCount() {
  const { unreadCount, setUnreadCount } = useGlobalContext();
  const [intervalId, setIntervalId] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.publicMetadata?.isAdmin) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        if (!response.ok) throw new Error("Failed to fetch unread count");
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
    return () => clearInterval(id);
  }, [setUnreadCount, user, isLoaded]);
  // Only show badge if user is admin and there are unread messages
  if (!user?.publicMetadata?.isAdmin || !unreadCount) {
    return null;
  }

  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full dark:bg-red-700">
      {unreadCount}
    </span>
  );
}
