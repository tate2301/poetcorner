import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const eb_garamond = EB_Garamond({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Penned pieces about everything",
  description: "A literature journal by T. D. Kamusoko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={eb_garamond.className}>{children}</body>
    </html>
  );
}
