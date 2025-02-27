import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  XIcon,
} from "react-share";

export default function ShareButtons({ car }) {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/cars/${car._id}`;

  // Create a safe string formatter helper
  const formatText = (text) => {
    return text ? text.toString().replace(/\s/g, "") : "";
  };

  // Create hashtag string
  const hashtagString = `#${formatText(car.brand)}${formatText(
    car.model
  )}${formatText(car.year)}ForSale`;

  return (
    <div className="w-full px-2 py-4 transition-colors duration-200 bg-white rounded-lg dark:bg-gray-800">
      <h3 className="pt-2 mb-4 text-xl font-bold text-center text-gray-900 transition-colors duration-200 dark:text-white">
        Share This Car
      </h3>
      <div className="flex justify-center gap-4 pb-5">
        <div className="transition-transform duration-200 hover:scale-110">
          <FacebookShareButton
            url={shareUrl}
            quote={car.brand || ""}
            hashtag={hashtagString}
          >
            <FacebookIcon size={36} round={true} />
          </FacebookShareButton>
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <TwitterShareButton
            url={shareUrl}
            title={car.brand || ""}
            hashtag={[hashtagString]}
          >
            <XIcon size={36} round={true} />
          </TwitterShareButton>
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <WhatsappShareButton
            url={shareUrl}
            title={car.brand || ""}
            separator=":: "
          >
            <WhatsappIcon size={36} round={true} />
          </WhatsappShareButton>
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <EmailShareButton
            url={shareUrl}
            subject={car.brand || ""}
            body={`Check out this car for sale: ${shareUrl}`}
          >
            <EmailIcon size={36} round={true} />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
}
