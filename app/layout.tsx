import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Interactions from "@/components/Interactions";
import Chiki from "@/components/Chiki";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sajjadhossaintalukder.com"),
  title: "Sajjad Hossain Talukder — Software Engineer & Researcher",
  description:
    "Full-stack software engineer and computer science researcher. ICPC Asia-West finalist building production software and research in AI & networking.",
  openGraph: {
    title: "Sajjad Hossain Talukder — Software Engineer & Researcher",
    description:
      "First-in-class CS graduate, ICPC Asia-West finalist, and published researcher in AI & networking.",
    url: "https://sajjadhossaintalukder.com",
    siteName: "Sajjad Hossain Talukder",
    images: ["/images/profile-cutout.png"],
    type: "website",
  },
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} ${caveat.variable}`}
    >
      <body>
        {children}
        <Chiki />
        <Interactions />
      </body>
    </html>
  );
}
