import { GeistSans } from "geist/font/sans";
import "./globals_op.css";
import "./custom_tailwind.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from 'next/script'
import Analytics from "@/components/Analytics";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


const GA_MEASUREMENT_ID = "G-867TL3WQGR"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Read like Reels",
  description: "Website for smooth reading.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel='icon' href="/Icon/favicon.ico" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap" rel="stylesheet" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="bg-background text-foreground">
        <Analytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
