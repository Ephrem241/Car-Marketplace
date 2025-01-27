import React from "react";
import InfoBox from "./InfoBox";

export default function InfoBoxes() {
  return (
    <section>
      <div className="m-auto container-xl lg:container">
        <div className="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2">
          <InfoBox
            backgroundColor="bg-gray-100"
            textColor="text-gray-800"
            buttonInfo={{
              text: "Browse Cars",
              link: "/cars",
              backgroundColor: "bg-blue-500",
            }}
          >
            Find your dream car.
          </InfoBox>
        </div>
      </div>
    </section>
  );
}
