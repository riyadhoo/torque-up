
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Categories from "@/components/home/Categories";
import FeaturedParts from "@/components/home/FeaturedParts";
import FeaturedCars from "@/components/home/FeaturedCars";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-16">
        <Hero />
        <Services />
        <Categories />
        <FeaturedParts />
        <FeaturedCars />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
