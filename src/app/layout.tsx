import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Dravo — Built Bit By Bit",
  description: "We're building a modern digital experience for the next generation of software, automation, and intelligent systems.",
  openGraph: {
    title: "Dravo — Something Powerful Is Coming",
    description: "Modern software, automation, and intelligent systems.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}