// src/app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientOnly from "../components/ClientOnly"; // we'll create this next

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ You can keep metadata here now
export const metadata = {
  title: "Time Capsule DApp",
  description: "Decentralized time capsule using Ethereum and IPFS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientOnly>{children}</ClientOnly>
      </body>
    </html>
  );
}
