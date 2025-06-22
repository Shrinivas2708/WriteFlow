import Features from "../components/Features";
import Hero from "../components/Hero";
import HeroCards from "../components/HeroCards";
import Navbar from "../components/Navbar";
import NewsLetter from "../components/Newsletter";
import Popular from "../components/Popular";
import Testimonials from "../components/Testimonials";

function Landing() {
  return (
    <div className="w-full  bg-[#141414] min-h-screen overflow-y-auto  ">
      <NewsLetter />
      <Navbar />
      <div className="w-full px-1 sm:px-6 md:px-10 lg:px-20">
        <Hero />
        <HeroCards />
        <Features />
        <Popular />
        <Testimonials />
      
  );
}

export default Landing;
