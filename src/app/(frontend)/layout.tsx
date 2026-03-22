import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { CommandPalette } from "@/components/shared/command-palette";
import { SplashScreen } from "@/components/shared/splash-screen";
import { CVPromoBanner } from "@/components/shared/cv-promo-banner";
import { Toaster } from "sonner";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SplashScreen />
      <CustomCursor />
      <CommandPalette />
      <ScrollProgress />
      <Navbar />
      <div className="sticky top-[68px] z-40">
        <CVPromoBanner />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
