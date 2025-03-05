"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";

import { format } from "date-fns";

export default function Message({ message, onMessageChange }) {
  const [isRead, setIsRead] = useState(message.readByAdmin);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setUnreadCount } = useGlobalContext();

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readByAdmin: !isRead }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }

      const { readByAdmin } = await response.json();
      setIsRead(readByAdmin);
      setUnreadCount((prevCount) =>
        readByAdmin ? prevCount - 1 : prevCount + 1
      );
      toast.success(readByAdmin ? "Marked as read" : "Marked as new");
      onMessageChange();
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setIsDeleting(true);
      if (!isRead) {
        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      }
      toast.success("Message deleted successfully");
      onMessageChange();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  if (isDeleting) {
    return null;
  }

  const { sender, car, name, email, phone, body, createdAt } = message;

  return (
    <div
      className={`border rounded-lg p-4 dark:border-gray-600 ${
        !isRead
          ? "bg-gray-100 dark:bg-gray-700"
          : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            From: {name}{" "}
            <span className="text-blue-600 dark:text-blue-400">({email})</span>
          </h3>
          {phone && (
            <p className="text-gray-600 dark:text-gray-300">Phone: {phone}</p>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
        </div>
      </div>

      {car && (
        <Link
          href={`/cars/${car._id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Re: {car.make} {car.model} - ${car.price?.toLocaleString()}
        </Link>
      )}
      <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap mt-2">
        {body}
      </p>

      {!isRead && (
        <div className="mt-4">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 dark:bg-yellow-600 rounded">
            Unread
          </span>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Button
          onClick={handleMarkAsRead}
          color={isRead ? "gray" : "blue"}
          disabled={isDeleting}
          className="dark:enabled:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isRead ? "Mark as New" : "Mark as Read"}
        </Button>
        <Button
          onClick={handleDelete}
          color="red"
          disabled={isDeleting}
          className="dark:enabled:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
