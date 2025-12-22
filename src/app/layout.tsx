import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { ConvexClientProvider } from "./convex-client-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
export const metadata: Metadata = {
  title: "Skill Diggers",
  description:
    "Welcome to the Malawian home of open source and everything programming",
  icons: [{ rel: "icon", url: "/images/logo/logo.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <NuqsAdapter>
          <ConvexClientProvider> {children}</ConvexClientProvider>
          <Toaster richColors position="top-center" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
