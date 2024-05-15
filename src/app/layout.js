import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Delta Twin"></meta>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
