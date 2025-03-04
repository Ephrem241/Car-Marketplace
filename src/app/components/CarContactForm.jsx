"use client";

import React, { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

export default function CarContactForm({ car }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add this debug log
    console.log("Sending message to:", {
      recipientId: car.createdBy,
      carId: car._id,
      car: car,
    });

    const data = {
      name,
      email,
      phone,
      message,
      recipient: car.createdBy,
      car: car._id,
      body: message,
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        toast.success(data.message);
        setWasSubmitted(true);
      } else if (response.status === 400 || response.status === 401) {
        const dataObj = await response.json();
        toast.error(dataObj.message);
      } else {
        toast.error("Error sending form");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending form");
    } finally {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        Contact Car Manager
      </h3>
      {!isSignedIn ? (
        <p>You must be logged in to send a message</p>
      ) : user.publicMetadata.isAdmin ? (
        <p>Admins cannot send messages to themselves</p>
      ) : wasSubmitted ? (
        <p className="mb-4 text-green-500">
          Your message has been sent successfully
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 bg-white border rounded shadow appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 bg-white border rounded shadow appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              htmlFor="phone"
            >
              Phone:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 bg-white border rounded shadow appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              htmlFor="message"
            >
              Message:
            </label>
            <textarea
              className="w-full px-3 py-2 text-gray-700 bg-white border rounded shadow appearance-none h-44 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:shadow-outline"
              id="message"
              placeholder="Enter your message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <button
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <FaPaperPlane className="mr-2" />
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
