import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nakano Room 🌸 | Quintessential Quintuplets Chat",
  description: "Chat with the Nakano quintuplets from The Quintessential Quintuplets anime!",
  keywords: ["anime", "chat", "quintessential quintuplets", "nakano", "ai chat"],
  authors: [{ name: "Nakano Room" }],
  openGraph: {
    title: "Nakano Room 🌸",
    description: "Chat with the Nakano quintuplets!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
