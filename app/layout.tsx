import { GeistSans } from "geist/font/sans";
import "./globals_op.css";
import "./custom_tailwind.css";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

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

  const {
    data: { user },
  } = await createClient().auth.getUser();


  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel='icon' href="/Icon/favicon.ico" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        <Header />
        {children}
      </body>
    </html>
  );
}
