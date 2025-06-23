// import React from "react";
import NewsLetter from "../components/Newsletter";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

function Terms() {
  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col">
      <NewsLetter />
      <div className="w-full h-[70px] ">
        <Navbar />
      </div>
     
      <div className="px-1 sm:px-6 md:px-10 lg:px-20 ">
         <p className="text-white  p-20 text-center">
        Do whatever you wanna ! NO TERMS
      </p>
      <Footer />
      </div>
    </div>
    
  );
}

export default Terms;
