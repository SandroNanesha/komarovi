import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartSlideOver from "@/components/CartSlideOver";
import AccountSlideOver from "@/components/AccountSlideOver";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ATELIER | KOMAROVI MERCH",
  description:
    "Engineered for mathematical precision and refined for the street. The inaugural collection for the academic vanguard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;700;800;900&family=Noto+Sans+Georgian:wght@100;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 pt-24">{children}</main>
              <Footer />
              <CartSlideOver />
              <AccountSlideOver />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]">
          <div className="absolute inset-0 grid-overlay" />
        </div>
      </body>
    </html>
  );
}
