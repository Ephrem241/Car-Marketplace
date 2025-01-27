import Link from "next/link";
import React from "react";

export default function infoBox({
  backgroundColor = "bg-gray-100",
  textColor = "text-gray-800",
  buttonInfo,
  children,
}) {
  return (
    <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
      <p className={`${textColor}mt-2 mb-4`}>{children}</p>
      <Link
        href={buttonInfo.link}
        className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
}
