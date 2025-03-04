"use client";

import MessagesPage from "@/app/components/MessagesPage";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/app/components/Spinner";

export default function DashMessages() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (isLoaded && !user?.publicMetadata?.isAdmin) {
      router.push("/");
      return;
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <Spinner loading={true} />;
  }

  if (!user || !user.publicMetadata?.isAdmin) {
    return null;
  }

  return <MessagesPage />;
}
