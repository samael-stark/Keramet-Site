import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/CategoriesSlider";
import BestSeller from "@/components/BestSeller";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <BestSeller />
      <Reviews />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
