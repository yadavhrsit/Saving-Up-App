import React from "react";

function InfoCard({ image, heading, text }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-blue-950"></div>
      <div className="relative p-4 md:p-8 text-white">
        <div className="flex items-center justify-center mb-4 md:mb-8">
          <img src={image} width={80} className="rounded-full" alt="Rs" />
        </div>
        <h2 className="text-sm md:text-xl xl:text-2xl font-extrabold text-center mb-2 md:mb-4">
          {heading}
        </h2>

        <p className="text-base md:text-2xl xl:text-3xl font-medium text-center">
          {text}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
