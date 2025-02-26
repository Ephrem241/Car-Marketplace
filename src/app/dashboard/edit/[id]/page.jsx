"use client";

import CarUpdateForm from "@/app/components/CarUpdateForm";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UpdateCarPage({ params }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (isLoaded) {
      setIsAuthorized(isSignedIn && user?.publicMetadata?.isAdmin);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin">
          <CarUpdateForm id={id} />
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <h1 className="text-3xl font-semibold text-center my-7">
        You are not authorized to view this page
      </h1>
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container max-w-2xl py-24 m-auto">
        <div className="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
          <CarUpdateForm id={id} />
        </div>
      </div>
    </section>
  );
}
