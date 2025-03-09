"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function DashProfile() {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center items-center w-full min-h-[80vh] p-4 md:p-8">
      <div className="w-full max-w-[800px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <UserProfile
          appearance={{
            baseTheme: theme === "dark" ? dark : light,
            variables: {
              borderRadius: "0.75rem",
            },
          }}
          routing="hash"
        />
      </div>
    </div>
  );
}
