"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the context

const GlobalContext = createContext();

// Create the provider

export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Remove the entire useEffect with interval
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Create the custom hook to access the context

export function useGlobalContext() {
  return useContext(GlobalContext);
}
