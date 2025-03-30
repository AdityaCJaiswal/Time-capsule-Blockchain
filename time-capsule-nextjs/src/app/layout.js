// src/app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientOnly from "../components/ClientOnly"; // we'll create this next
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Time Capsule DApp",
  description: "Decentralized time capsule using Ethereum and IPFS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientOnly>
          {children}
          <Analytics />
        </ClientOnly>
        
      </body>
    </html>
  );
}
