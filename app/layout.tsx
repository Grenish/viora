import type { Metadata } from "next";
import { Public_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CurrencyProvider } from "@/lib/use-currency";

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Viora",
  description:
    "Viora is restaurant that serves every dish with a touch of elegance and tradition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        "font-sans",
        publicSans.variable,
        notoSansHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <CurrencyProvider>
          <Navbar />
          {children}
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
