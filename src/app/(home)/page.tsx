import { ComponentsExample } from "@/components/home/components-example";
import { ContributorsSection } from "@/components/home/contributors";
import { Hero } from "@/components/home/hero";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <Hero />
      <ComponentsExample />
      <ContributorsSection />
    </div>
  );
}
