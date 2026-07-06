import type { Metadata } from "next";
import { AuthProvider } from "@/src/features/auth/authProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidekik",
  description: "The creative sidekik behind every great video.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
