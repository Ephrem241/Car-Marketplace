import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 mt-24 bg-gray-200">
      <div className="container flex flex-col items-center justify-between px-4 mx-auto md:flex-row">
        <div>
          <p className="mt-2 text-sm text-gray-500 md:mt-0">
            &copy; {currentYear} Gode & Million CAR MARKET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
