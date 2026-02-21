import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Help2Earn - Madad karke kamaayein | Local Help & Earn",
  description: "Madad karke roz ₹1000-₹2000 tak kamaayein. Emergency help (puncture, charging), Time/Access (queue, errands), Resource rent (bike, tools) - sab ek app me. ₹49/month subscription. Help karo, Earn karo!",
  keywords: [
    "Help2Earn", "Help2Earn App", "Local Help", "Nearby Help", "Local Income", 
    "Emergency Help", "Puncture Help", "Bike Rent", "Queue Standing",
    "Local Marketplace", "India", "Ghar baithe kamao", "Side income",
    "Part time job", "Local services", "Helper app", "Earn money online"
  ],
  authors: [{ name: "Help2Earn Team", url: "https://help2earn.app" }],
  creator: "Help2Earn",
  publisher: "Help2Earn",
  manifest: "/manifest.json",
  applicationName: "Help2Earn",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Help2Earn",
    startupImage: [
      { url: "/icons/splash-640x1136.png", media: "(device-width: 320px)" },
      { url: "/icons/splash-750x1334.png", media: "(device-width: 375px)" },
      { url: "/icons/splash-1242x2208.png", media: "(device-width: 414px)" },
    ],
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  openGraph: {
    title: "Help2Earn - Madad karke kamaayein",
    description: "Local help, local income, local trust. Emergency, Time/Access, Resource rent - sab ek app me. ₹49/month.",
    type: "website",
    locale: "en_IN",
    alternateLocale: "hi_IN",
    siteName: "Help2Earn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Help2Earn - Local Help & Earn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@help2earn",
    creator: "@help2earn",
    title: "Help2Earn - Local Help & Earn",
    description: "Madad karke roz ₹1000-₹2000 tak kamaayein. Local help marketplace.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://help2earn.app",
  },
  category: "lifestyle",
  classification: "Local Services Marketplace",
  rating: "4.5",
  appLinks: {
    web: { url: "https://help2earn.app", should_fallback: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#f97316" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Help2Earn" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Play Store / App Store */}
        <meta name="google-play-app" content="app-id=com.helppe.dailyearn" />
        
        {/* Safety & Trust Indicators */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-image-preview:large" />
        
        {/* Region & Language */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="Hindi, English" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration.scope);
                    },
                    function(err) {
                      console.log('SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
