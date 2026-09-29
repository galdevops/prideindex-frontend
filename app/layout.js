import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CountryProvider } from "./context/CountryContext";
import { ThemeProvider } from "./context/ThemeContext";
import { THEME_STORAGE_KEY } from "./lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrideAtlas | LGBTQ+ Changemakers Around the World",
  description:
    "Discover LGBTQ+ contributors across countries and fields. Explore their roles, work, and impact.",
  manifest: "/icons/favicon_io/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/favicon_io/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

// Runs before first paint so the saved (or system) theme is on <html> before
// the page is visible. Mirrors the resolution in ThemeContext.
const themeInitScript = `(function(){var c=null;try{c=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=c==="dark"||(c!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <CountryProvider>
          {children}
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
