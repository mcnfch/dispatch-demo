import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/header";

// Google Fonts configuration for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata for the application
export const metadata: Metadata = {
  title: "Dispatch App",
  description: "Hybrid scheduling & dispatch application",
};

/**
 * Root Layout Component
 * 
 * The main layout wrapper for the entire dispatch application.
 * Provides:
 * - Global font configurations (Geist Sans and Geist Mono)
 * - Session and authentication providers
 * - Common header component with branding
 * - Global CSS styles and Tailwind CSS
 * 
 * All pages are wrapped in this layout with consistent styling and providers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Providers wrapper for NextAuth session and other context */}
        <Providers>
          {/* Global header with dispatch branding */}
          <Header />
          {/* Page-specific content */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
