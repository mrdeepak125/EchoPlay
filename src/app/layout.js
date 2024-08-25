import Navbar from "@/components/Navbar";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import Providers from "@/redux/Providers";
import TopProgressBar from "@/components/topProgressBar/TopProgressBar";
import Favicon from "./favicon.ico";
import SongsHistory from "@/components/SongsHistory";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./AuthProvider";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  weight: "500",
  subsets: ["latin-ext"],
  display: "swap",
});

export const metadata = {
  title: "EchoPlay",
  description: "Music streaming app",
  image:
    "https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598011/logo-white_cdtrzl.png",
  url: "https://echoplay.netlify.app/",
  type: "website",
  icons: [{ rel: "icon", url: Favicon.src }],
  site_name: "EchoPlay",
  manifest: "/manifest.json",
  name :"google-site-verification",
  content :"vBxvC-ztGC2krNZlGJ43xlR6IeF63fYC3cW_0Hn4jy0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
        <link rel="canonical" href="https://echoplay.netlify.app/" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="vBxvC-ztGC2krNZlGJ43xlR6IeF63fYC3cW_0Hn4jy0" />
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
      </head>
      <body className={poppins.className}>
        <Providers>
          <AuthProvider>
            <TopProgressBar />
            <SongsHistory />
            <Navbar />
            <Toaster />
            {children}
            <Analytics />
            <SpeedInsights />
            <div className="h-20"></div>
            <div className="fixed bottom-0 left-0 right-0 flex backdrop-blur-lg rounded-t-3 z-50">
              <MusicPlayer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}