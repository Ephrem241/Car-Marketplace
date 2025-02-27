"use client";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";

import { FaMoon, FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  return (
    <Navbar className="border-b-2">
      <Link
        href="/"
        className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white"
      >
        <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Zena
        </span>
        Car&apos;s
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button
          className="hidden w-12 h-10 sm:inline"
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
            userProfileUrl="/dashboard?tap=profile"
          />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        </SignedOut>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link href="/">
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link href="/cars">
          <Navbar.Link active={path === "/cars"} as={"div"}>
            Cars
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
