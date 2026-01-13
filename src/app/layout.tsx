import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "أركيد زون - متجر الألعاب",
  description: "تصفح واكتشف الألعاب في متجرنا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} font-cairo antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
