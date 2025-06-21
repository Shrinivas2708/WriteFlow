// import React from "react";

function NewsLetter() {
  return (
    <div className=" w-full h-[50px]  text-[#98989A] flex justify-center items-center md:text-sm text-sm border-b-2 border-[#262626]">
      <span>
        Subscribe to our Newsletter
      </span>
      <div className=" p-2 ">
        <svg
          width="18"
          height="17"
          viewBox="0 0 18 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.25 0.25L16.5 0.25C16.6989 0.25 16.8897 0.329018 17.0303 0.46967C17.171 0.610322 17.25 0.801088 17.25 1V12.25C17.25 12.6642 16.9142 13 16.5 13C16.0858 13 15.75 12.6642 15.75 12.25V2.81066L2.03033 16.5303C1.73744 16.8232 1.26256 16.8232 0.96967 16.5303C0.676777 16.2374 0.676777 15.7626 0.96967 15.4697L14.6893 1.75L5.25 1.75C4.83579 1.75 4.5 1.41421 4.5 1C4.5 0.585787 4.83579 0.25 5.25 0.25Z"
            fill="#FFD11A"
          />
        </svg>
      </div>
    </div>
  );
}

export default NewsLetter;
