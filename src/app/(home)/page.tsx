import { ComponentsExample } from "@/components/home/components-example";
import { ContributorsSection } from "@/components/home/contributors";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";

export default function HomePage() {
  return (
    <div className="w-[95%] mx-auto">
      <Hero />
      <ComponentsExample />
      <ContributorsSection />
      <Footer />
    </div>
  );
}
