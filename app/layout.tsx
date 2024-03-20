import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";

import ToastProvider from "@/lib/react-notify/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamJob",
  description: "Get your dream Job!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en" className="light">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body className={inter.className}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <Providers>
          <ToastProvider>
            <Web3ModalProvider initialState={initialState}>
              {children}
            </Web3ModalProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
