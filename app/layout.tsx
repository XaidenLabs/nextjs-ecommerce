import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ToastProvider } from "@/providers/toast-provider";

import { Urbanist, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { ModalProvider } from "@/providers/modal-provider";

const font = Urbanist({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Bluepetals",
  description: "Bluepetals Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.variable} ${serif.variable} font-sans antialiased`}>
        <AuthProvider>
          <ModalProvider />
          <ToastProvider />
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
