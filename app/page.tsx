import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/CategoriesSlider";
import BestSeller from "@/components/BestSeller";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TrustStrip from "@/components/home/TrustStrip";
import StoryBanner from "@/components/home/StoryBanner";
import { getProductSummaries } from "@/lib/products-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Cached product list (shared with the shop page). The random pick
  // still changes on every visit; only the Firestore read is cached.
  // Sold rugs (stock 0) are left out so the homepage never shows them.
  const products = (await getProductSummaries())
    .filter((p) => p.isActive !== false && Number(p.stock ?? 1) > 0)
    .map((p) => ({
      id: p.id,
      title: p.title,
      coverUrl: p.coverUrl,
      price: p.price,
      category: p.category,
    }))
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Categories />
        <BestSeller products={products} />
        <StoryBanner />
        <Reviews />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
