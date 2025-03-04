"use client";

import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Message from "./Message";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user?.publicMetadata?.isAdmin) {
      setError("Unauthorized access");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        // Sort messages by date, newest first
        const sortedMessages = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages);
        toast.success(`Loaded ${sortedMessages.length} messages`);
      } catch (error) {
        setError(
          error.message || "Unable to load messages. Please try again later."
        );
        toast.error(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return <Spinner loading={true} />;
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border dark:border-gray-700 m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Messages
          </h1>
          <div className="mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Unread Messages:{" "}
              {messages.filter((msg) => !msg.readByAdmin).length}
            </span>
          </div>
          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No messages found
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Message key={message._id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
