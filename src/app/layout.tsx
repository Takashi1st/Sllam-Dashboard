import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "لوحة تحكم سلّم | Sllam Admin",
  description: "لوحة التحكم الإدارية لمنصة سلّم اللوجستية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${readexPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-readex bg-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
