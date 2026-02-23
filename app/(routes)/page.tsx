import LandingHero from "@/components/landing-hero";
import ProductScrollRow from "@/components/product-scroll-row";
import SummerCapsuleBanner from "@/components/summer-capsule-banner";
import NewsletterSection from "@/components/newsletter-section";
import { getCategoryProducts } from "@/actions/get-products";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  let menTShirts = [], womenTops = [], hoodies = [], coords = [], shirts = [], slides = [];

  try {
    [menTShirts, womenTops, hoodies, coords, shirts, slides] =
      await Promise.all([
        getCategoryProducts("Men T-Shirts"),
        getCategoryProducts("Women Tops"),
        getCategoryProducts("Sweats & Hoodies"),
        getCategoryProducts("Co-ords"),
        getCategoryProducts("Shirts & Jerseys"),
        getCategoryProducts("Slides"),
      ]);
  } catch (error) {
    console.error("[HOME_PAGE] Failed to fetch products:", error);
  }

  return (
    <>
      {/* Landing Hero - Video + Banner Images */}
      <LandingHero />

      {/* Men's T-Shirts */}
      <ProductScrollRow
        sectionTitle="Men"
        title="T-Shirts"
        products={menTShirts}
      />

      {/* Women's Tops */}
      <ProductScrollRow
        sectionTitle="Women"
        title="Tops"
        products={womenTops}
      />

      {/* Summer Capsule Banner #1 */}
      <SummerCapsuleBanner
        image1="/assets/summer1.avif"
        image2="/assets/summer2.avif"
      />

      {/* Sweats & Hoodies */}
      <ProductScrollRow title="Sweats & Hoodies" products={hoodies} />

      {/* Co-ords */}
      <ProductScrollRow title="Co-ords" products={coords} />

      {/* Shirts & Jerseys */}
      <ProductScrollRow title="T-Shirts" products={shirts} />

      {/* Slides */}
      <ProductScrollRow title="Slides" products={slides} />

      {/* Summer Capsule Banner #2 */}
      <SummerCapsuleBanner
        image1="/assets/summer down 1.avif"
        image2="/assets/summer down 2.avif"
      />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
};

export default HomePage;
