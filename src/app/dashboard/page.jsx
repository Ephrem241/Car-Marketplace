"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import SavedCars from "../components/SavedCars";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashboardComp from "../components/DashboardComp";
import DashUsers from "../components/DashUsers";
import DashSidebar from "../components/DashSidebar";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("");
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      // Set default tab based on user role
      setTab(user?.publicMetadata?.isAdmin ? "dash" : "profile");
    }
  }, [searchParams, user?.publicMetadata?.isAdmin]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div className="flex-1">
        {user?.publicMetadata?.isAdmin ? (
          // Admin view
          <>
            {tab === "profile" && <DashProfile />}
            {tab === "posts" && <DashPosts />}
            {tab === "users" && <DashUsers />}
            {tab === "dash" && <DashboardComp />}
          </>
        ) : (
          // Regular user view
          <>
            {tab === "profile" && <DashProfile />}
            {tab === "saved" && <SavedCars />}
          </>
        )}
      </div>
    </div>
  );
}
