import Features from "../layouts/Features";
import Footer from "../layouts/Footer";
import FutureComp from "../layouts/FutureComp";
import Hero from "../layouts/Hero";
import HeroCards from "../components/cards/HeroCards";
import Navbar from "../layouts/Navbar";
import NewsLetter from "../components/Newsletter";
import Popular from "../layouts/Popular";
import Testimonials from "../layouts/Testimonials";

function Landing() {
  return (
    <div className="w-full   ">
      <NewsLetter />
      <Navbar />
      <div className="w-full px-1 sm:px-6 md:px-10 lg:px-20">
        <Hero />
        <HeroCards />
        <Features />
        <Popular />
        <Testimonials />
        <FutureComp />
        <Footer />
      </div>
    </div>
  );
}

export default Landing;
