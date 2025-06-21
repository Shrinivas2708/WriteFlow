// import React from "react";
import NewsLetter from "../components/Newsletter";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col">
      <NewsLetter />
      <div className="w-full h-[70px] ">
        <Navbar />
      </div>
    </div>
  );
}

export default About;
