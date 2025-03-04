import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "next-themes";
import ThemeCom from "./components/ThemeCom";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeModeScript } from "flowbite-react";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";
import "photoswipe/dist/photoswipe.css";

export const metadata = {
  title: "Premium Cars for Sale | Best Deals on Quality Vehicles",
  description:
    "Find your dream car at unbeatable prices! Browse our extensive inventory of new & used cars, trucks, and SUVs. Best-in-class warranties & financing options available. Shop now!",
  keywords: [
    "cars for sale",
    "used cars",
    "new cars",
    "car dealership",
    "best car prices",
    "certified pre-owned",
    "car financing",
    "SUV for sale",
    "trucks for sale",
    "luxury cars",
  ],
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <ThemeModeScript />
          </head>

          <body className="relative">
            <ThemeProvider>
              <ThemeCom>
                <Header />
                {children}
                <Footer />
                <ToastContainer />
              </ThemeCom>
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </GlobalProvider>
  );
}
