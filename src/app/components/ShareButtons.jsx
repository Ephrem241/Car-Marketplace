import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  XIcon,
  TelegramIcon,
} from "react-share";
import Skeleton from "react-loading-skeleton";

export default function ShareButtons({ car }) {
  if (!car?._id) return null;
  const shareUrl = `${
    process.env.NEXT_PUBLIC_DOMAIN || window.location.origin
  }/cars/${car._id}`;

  const ShareButtonWrapper = ({ children }) => (
    <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
      {children}
    </div>
  );

  return !car ? (
    <div className="flex justify-center gap-4 pb-5">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} circle width={36} height={36} />
      ))}
    </div>
  ) : (
    <div className="w-full px-2 py-4 transition-colors duration-200 bg-white rounded-lg dark:bg-gray-800">
      <h3 className="pt-2 mb-4 text-xl font-bold text-center text-gray-900 transition-colors duration-200 dark:text-white">
        Share This Car
      </h3>
      <div className="flex flex-wrap justify-center gap-4 pb-5 px-2">
        <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
          <ShareButtonWrapper>
            <FacebookShareButton url={shareUrl} aria-label="Share on Facebook">
              <FacebookIcon
                size={36}
                round={true}
                className="dark:brightness-125 hover:dark:brightness-150"
              />
            </FacebookShareButton>
          </ShareButtonWrapper>
        </div>
        <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
          <TwitterShareButton url={shareUrl}>
            <XIcon
              size={36}
              round={true}
              className="dark:brightness-125 hover:dark:brightness-150"
            />
          </TwitterShareButton>
        </div>
        <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon
              size={36}
              round={true}
              className="dark:brightness-125 hover:dark:brightness-150"
            />
          </WhatsappShareButton>
        </div>
        <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
          <EmailShareButton
            url={shareUrl}
            subject={`Check out this ${car?.make} ${car?.model}`}
            body={`I found this amazing car listing:\n\n`}
          >
            <EmailIcon
              size={36}
              round={true}
              className="dark:brightness-125 hover:dark:brightness-150"
            />
          </EmailShareButton>
        </div>
        <div className="transition-all duration-200 hover:scale-110 hover:-translate-y-1">
          <TelegramShareButton url={shareUrl}>
            <TelegramIcon
              size={36}
              round={true}
              className="dark:brightness-125 hover:dark:brightness-150"
            />
          </TelegramShareButton>
        </div>
      </div>
    </div>
  );
}
