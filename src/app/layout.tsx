import "@/styles/globals.css";
import Providers from "@/components/Provider";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Ayoni - Home",
  description:
    "Open-source web analytics built for modern websites — simple, fast, and easy to use. ",
  openGraph: {
    images: ["/ogayoni.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayoni - Home",
    description:
      " Open-source web analytics built for modern websites — simple, fast, and easy to use.",
    images: ["/ogayoni.png"],
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
        <script
          async
          src="https://ayoni.vercel.app/tracker.js"
          data-website-id="cm92ne3d60001js049lik22be"
        ></script>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="7149a334-f8c2-4e2e-b891-3a7c6dd7bcd4"
        />
      </Providers>
    </html>
  );
}
