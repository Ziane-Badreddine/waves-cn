import { ComponentsExample } from "@/components/home/components-example";
import { ContributorsSection } from "@/components/home/contributors";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { GetStarted } from "@/components/home/get-started";
import { Hero } from "@/components/home/hero";

export default function HomePage() {
  return (
    <div className="mx-auto w-full">
      <Hero />
      <Features />
      <ComponentsExample />
      <GetStarted />
      <ContributorsSection />
      <Footer />
    </div>
  );
}
