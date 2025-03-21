"use client";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";

import { FaMoon, FaSun } from "react-icons/fa";

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <Navbar className="border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white dark:hover:text-gray-300 cursor-pointer"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white flex items-center gap-2">
          <span className="px-2 py-1 bg-amber-400 rounded-lg ">
            GODE & MILLION
          </span>
          CAR MARKET
        </span>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline "
          color="gray"
          pill
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: theme === "light" ? light : dark,
            }}
            userProfileUrl="/dashboard?tab=profile"
          />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button outline className="cursor-pointer">
              Sign In
            </Button>
          </Link>
        </SignedOut>
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link href="/">
          <Navbar.Link
            active={path === "/"}
            as={"div"}
            className="cursor-pointer"
          >
            Home
          </Navbar.Link>
        </Link>
        <Link href="/cars">
          <Navbar.Link
            active={path === "/cars"}
            as={"div"}
            className="cursor-pointer"
          >
            Cars
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
