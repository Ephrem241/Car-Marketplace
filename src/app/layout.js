import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeModeScript } from "flowbite-react";
import Footer from "./components/Footer";
import { GlobalProvider } from "@/context/GlobalContext";
import "photoswipe/dist/photoswipe.css";

import ThemeCom from "./components/ThemeCom";

export const metadata = {
  title: "GODE & MILLION CAR MARKET | Best Deals on Quality Vehicles",
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
            <link
              rel="icon"
              type="image/png"
              href="/favicon-96x96.png"
              sizes="96x96"
            />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" href="/favicon.ico" />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <ThemeModeScript />
          </head>
          <body>
            <ThemeProvider>
              <ThemeCom>
                <Header />
                {children}
                <Footer />
              </ThemeCom>
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </GlobalProvider>
  );
}
