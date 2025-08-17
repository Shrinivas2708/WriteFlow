// import React from "react";
import NewsLetter from "../components/Newsletter";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

function About() {
  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col">
      <NewsLetter />
      <Navbar />
      <div className="px-1 sm:px-6 md:px-10 lg:px-20 ">
        <Footer />
      </div>
      

    </div>
  );
}

export default About;
