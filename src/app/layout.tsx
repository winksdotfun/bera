import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define base URL and player URL
const baseUrl = "https://stake-honey-bex.winks.fun";
const playerUrl = "https://stake-honey-bex.winks.fun"; 

export const metadata: Metadata = {
  title: " Unlock and leverage your HONEY",
  description: "Get the best yield in the Berachain ecosystem",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Unlock and leverage your HONEY",
    description: "Get the best yield in the Berachain ecosystem",
    images: ["https://res.cloudinary.com/dvddnptpi/image/upload/v1742994167/txit82q12lduhy6x6wsc.png"],
  },
  twitter: {
    card: "player",
    site: "@winksdotfun",
    title: "Unlock and leverage your HONEY",
    description: "Get the best yield in the Berachain ecosystem",
    images: ["https://res.cloudinary.com/dvddnptpi/image/upload/v1742994167/txit82q12lduhy6x6wsc.png"],
  },
  other: {
    "twitter:player": playerUrl,
    "twitter:player:width": "360",
    "twitter:player:height": "560",
  },
  icons: "https://res.cloudinary.com/dvddnptpi/image/upload/v1742994167/txit82q12lduhy6x6wsc.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <ClientBody className="min-h-screen bg-background">
        {children}
      </ClientBody>
    </html>
  );
}