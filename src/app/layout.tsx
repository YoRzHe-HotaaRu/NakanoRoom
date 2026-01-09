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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
