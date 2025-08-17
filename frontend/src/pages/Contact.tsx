// import React from "react";
import NewsLetter from "../components/Newsletter";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import InputFields from "../components/InputFields";
import LoginButton from "../components/LoginButton";

function Contact() {
  return (
    <div className="w-full ">
      <NewsLetter />
      <Navbar />
      <div className="px-1 sm:px-6 md:px-10 lg:px-20">
        <div className=" md:p-14 p-5 flex justify-center items-center">
          <div className="border md:p-10 p-5 flex flex-col gap-5 bg-[#191919] border-[#262626] rounded-xl">
            <p className="md:text-5xl text-4xl font-semibold text-center md:text-start">
              Contact Us
            </p>
            <div className="flex flex-col md:flex-row gap-2 p-2">
              <InputFields Label="Name" />
              <InputFields Label="Email" />
            </div>
            <div className=" px-2">
              <InputFields Label="Message" className="pb-20 " />
            </div>
            <div className=" flex justify-center">
              <LoginButton className="w-[150px] text-lg " label="Send" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Contact;
