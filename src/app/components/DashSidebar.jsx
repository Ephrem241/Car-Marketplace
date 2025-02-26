"use client";

import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
  HiBookmark,
  HiPlus,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashSidebar() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  // Admin tabs remain the same
  const adminTabs = [
    { name: "Dashboard", value: "dash", icon: HiChartPie },
    { name: "Profile", value: "profile", icon: HiUser },
    { name: "Posts", value: "posts", icon: HiDocumentText },
    { name: "Users", value: "users", icon: HiOutlineUserGroup },
  ];

  // Simplified user tabs - only Profile and Saved Cars
  const userTabs = [
    { name: "Profile", value: "profile", icon: HiUser },
    { name: "Saved Cars", value: "saved", icon: HiBookmark },
  ];

  const tabs = user?.publicMetadata?.isAdmin ? adminTabs : userTabs;

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {user?.publicMetadata?.isAdmin && (
            <Link href="/dashboard/add">
              <Sidebar.Item icon={HiPlus} as="div">
                Post Car
              </Sidebar.Item>
            </Link>
          )}
          {tabs.map((item) => (
            <Link key={item.value} href={`/dashboard?tab=${item.value}`}>
              <Sidebar.Item
                active={tab === item.value}
                icon={item.icon}
                as="div"
              >
                {item.name}
              </Sidebar.Item>
            </Link>
          ))}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            <SignOutButton />
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
