import "@/styles/globals.css";
import Providers from "@/components/Provider";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Ayoni - Home",
  description:
    "Discover and share hidden gems with breathtaking photos and precise locations, powered by the community. ",
  openGraph: {
    images: ["/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayoni - Home",
    description: " ",
    images: ["/og.webp"],
    creator: "@ronitrajfr",
  },
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <Providers>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
        <Script
          defer
          src="/tracker.js"
          data-website-id="cm929wv7j000fglzr0psa0tp5"
        />
      </Providers>
    </html>
  );
}
