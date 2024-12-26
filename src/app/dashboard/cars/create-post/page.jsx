"use client";

import CarAddForm from "@/app/components/CarAddForm";
import { useUser } from "@clerk/nextjs";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) {
    return null;
  }
  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Add Car </h1>
        <CarAddForm />
      </div>
    );
  } else {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );
  }
}
