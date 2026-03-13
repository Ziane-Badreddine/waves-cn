import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";
import { Banner } from "fumadocs-ui/components/banner";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | waves-cn",
    default: "waves-cn",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <TooltipProvider>
            <Banner
              variant="rainbow"
              className="bg-background text-foreground w-full mx-auto"
            >
              <div>
                @waves-cn is now available on the shadcn/ui registry —{" "}
                <Link
                  href="/docs/installation"
                  className="inline! font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Read more
                </Link>
              </div>
            </Banner>
            {children}
          </TooltipProvider>
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
