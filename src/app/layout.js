import Navbar from "@/components/Navbar";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import Providers from "@/redux/Providers";
import TopProgressBar from "@/components/topProgressBar/TopProgressBar";
import Favicon from "./favicon.ico";
import SongsHistory from "@/components/SongsHistory";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./AuthProvider";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import BottomNav from "@/components/BottomNav";
import ThemeProvider from "@/components/ThemeProvider";
import OnlineStatus from "@/components/Homepage/OnlineStatus";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin-ext"],
  display: "swap",
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "EchoPlay",
  description: "Music streaming app — Trending songs, create playlists, favourite songs.",
  image: "https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598011/logo-white_cdtrzl.png",
  url: "https://echoplay.vercel.app/",
  type: "website",
  icons: [{ rel: "icon", url: Favicon.src }],
  site_name: "EchoPlay",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EchoPlay</title>
        <meta name="description" content="Create your own Playlists and add songs to Favourite. Trending songs." />
        <meta property="og:title" content="EchoPlay | Music Streaming App" />
        <meta property="og:description" content="Create your own Playlists and add songs to Favourite. Trending songs." />
        <meta property="og:image" content="https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598011/logo-white_cdtrzl.png" />
        <meta property="og:url" content="https://echoplay.netlify.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:keywords" content="echoplay, echo play, music player, trending songs, 2024 best song platform, latest songs, top songs, Hindi Songs, Bollywood Music" />
        <link rel="canonical" href="https://echoplay.netlify.app/" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="echoplay, echo play, music player, trending songs, Hindi Songs Free Download, Bollywood Music" />
        <meta name="google-site-verification" content="vBxvC-ztGC2krNZlGJ43xlR6IeF63fYC3cW_0Hn4jy0" />
        <meta name="google-adsense-account" content="ca-pub-6828937410766897"></meta>
        <link rel="icon" href={Favicon.src} />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Z4FJ5T627Q"></Script>
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z4FJ5T627Q');
          `}
        </Script>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="62d42cd1-d6ec-4cf2-9588-c01ebd312689"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6828937410766897" crossOrigin="anonymous"></script>
        <script>
          {`
            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              window.deferredPrompt = e;
              window.dispatchEvent(new CustomEvent('pwa-install-promptable'));
            });
          `}
        </script>
      </head>
      <body className={poppins.className}>
        <Providers>
          <AuthProvider>
            <ThemeProvider>
              <TopProgressBar />
              <SongsHistory />
              <Navbar />
              <Toaster
                toastOptions={{
                  style: {
                    background: "rgba(15,15,30,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    color: "#f1f5f9",
                    borderRadius: "14px",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: { primary: "#a855f7", secondary: "#fff" },
                  },
                }}
              />
              <OnlineStatus>
                {children}
              </OnlineStatus>
              <Analytics />
              <SpeedInsights />
              {/* spacer for mini player + bottom nav */}
              <div className="h-36 lg:h-20"></div>
              {/* Fixed Bottom Player Container */}
              <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
                {/* Music player sits above bottom nav on mobile */}
                <div className="flex w-full pointer-events-auto">
                  <MusicPlayer />
                </div>
                {/* Bottom Nav (mobile only) */}
                <div className="w-full pointer-events-auto">
                  <BottomNav />
                </div>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
