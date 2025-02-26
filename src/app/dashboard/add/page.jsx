"use client";

import CarAddForm from "@/app/components/CarAddForm";
import { useUser } from "@clerk/nextjs";

export default function AddCarPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }
  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <section className="min-h-screen bg-blue-50 dark:bg-gray-900">
        <div className="container max-w-2xl py-24 m-auto">
          <div className="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700 md:m-0">
            <CarAddForm />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <h1 className="text-3xl font-semibold text-center my-7 dark:text-gray-200">
        You are not authorized to view this page
      </h1>
    );
  }
}
