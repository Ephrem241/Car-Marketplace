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
  HiInbox,
} from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useGlobalContext } from "@/context/GlobalContext";

export default function DashSidebar() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { unreadCount } = useGlobalContext();

  // Admin tabs remain the same
  const adminTabs = [
    { name: "Dashboard", value: "dash", icon: HiChartPie },
    { name: "Profile", value: "profile", icon: HiUser },
    { name: "Posts", value: "posts", icon: HiDocumentText },
    { name: "Users", value: "users", icon: HiOutlineUserGroup },
    { name: "Messages", value: "messages", icon: HiInbox, badge: unreadCount },
  ];

  // Simplified user tabs - only Profile and Saved Cars
  const userTabs = [
    { name: "Profile", value: "profile", icon: HiUser },
    { name: "Saved Cars", value: "saved", icon: HiBookmark },
  ];

  const tabs = user?.publicMetadata?.isAdmin ? adminTabs : userTabs;

  return (
    <Sidebar className="w-full bg-white border-gray-200 transition-colors duration-300 md:w-56 dark:bg-gray-800 dark:border-gray-700">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {user?.publicMetadata?.isAdmin && (
            <Link href="/dashboard/add">
              <Sidebar.Item icon={HiPlus} as="div" className="sidebar-item">
                Post Car
              </Sidebar.Item>
            </Link>
          )}
          <>
            {tabs.map((item) => (
              <Link key={item.value} href={`/dashboard?tab=${item.value}`}>
                <Sidebar.Item
                  active={tab === item.value}
                  icon={item.icon}
                  as="div"
                  className={`sidebar-item ${
                    tab === item.value
                      ? "bg-gray-100 dark:bg-gray-700 shadow-sm"
                      : ""
                  }`}
                >
                  {item.name}
                  {item.badge > 0 && (
                    <span className="notification-badge">{item.badge}</span>
                  )}
                </Sidebar.Item>
              </Link>
            ))}
          </>
          <Sidebar.Item icon={HiArrowSmRight} className="sidebar-item">
            <SignOutButton />
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
