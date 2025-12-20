import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "./contexts/profileContext";
import Header from "./components/commons/Header";
import Footer from "./components/commons/Footer";
import { validateEnv } from "./lib/env";

// Validate environment variables at build/startup time
// This will throw an error if required variables are missing
if (process.env.NODE_ENV !== 'development') {
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samson Olusola | Data Engineer | Software Developer",
  description: "The personal website of Samson Olusola, a Data Engineer and Software Developer. Explore his projects, blog posts, and get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scrollbar-none`}
      >
        <ProfileProvider>
          <Header />
          {children}
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
