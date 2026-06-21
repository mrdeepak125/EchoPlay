   [![Project Banner](https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598011/logo-white_cdtrzl.png)](https://echoplay.vercel.app/)

This is a free music streaming web application built with Next.js and powered by the [savan API](https://github.com/sumitkolhe/jiosaavn-api). The app allows users to search and stream music from a vast collection of songs available on the Saavn platform.

## Features
* **Premium Glassmorphism UI:** Stunning frosted-glass interfaces, harmonious dark backgrounds, dynamic ambient glows, and subtle micro-animations.
* **Dynamic Theme Picker:** Switch accent colors dynamically (Purple Velvet, Emerald Forest, Sunset Glow, Ocean Breeze, Rose Romance) stored locally.
* **Zero-Interruption Offline Playback:** Keeps active music playing continuously in the background during page transitions or network state changes by swapping page layouts inline rather than forcing chunk loads or router redirects.
* **Global Navigation Interception:** Automatically intercepts and blocks attempts to load online-only page chunks while offline, avoiding browser error pages and preserving active playback.
* **Batch Downloads:** "Download All Songs" button on album pages to download tracks as local MP3s and cache them in IndexedDB.
* **Interactive & Redesigned Search Page:** Dedicated search portal with trending lists, dynamic glass inputs with gradient glows, real-time debounced autocomplete previews (Songs, Albums, Artists, Playlists), and Voice Search.
* **Spotify-like Player Gestures:** Tactile album artwork dragging coordinate mechanics to swipe between next/previous songs or minimize the player.
* **Custom Sleep Timer:** Built-in sleep timer and song play counter with a custom modal layout, replacing raw browser alerts.
* **Notification System:** Admin dashboard (`/admin`) to write and pin notifications, triggering a notification bell with live badge counters.
* **Continuous Playback:** Persistent background player that maintains audio state across page transitions.
* **Custom Playlists & Favourites:** Create, manage, and delete custom playlists, and heart songs to save them locally.
* **Dual Providers:** Stream music using either the JioSaavn API or fallback conversion searches using the YouTube API.
***
![image](https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598299/Screenshot_2024-08-02_170023_zc8idt.png)
___
![image](https://res.cloudinary.com/djdi5hkyx/image/upload/v1722598299/Screenshot_2024-08-02_165953_bywfh1.png)


***
## Installation

1. Clone the repository to your local machine.
    ```sh
    git clone https://github.com/mrdeepak125/Echoplay.git
    ```

2. Install the required packages.
    ```sh
    cd EchoPlay
    ```
    ```sh
    npm install
    ```

3. Set up the environment variables:
    Create env file in root dir.
   ```
    MONGODB_URL = MongoDB connection string
    DB_NAME = database name

   JWT_SECRET = JWT secret
   NEXTAUTH_URL= next auth url (http://localhost:3000 or your domain)

   
   GOOGLE_CLIENT_ID = Google client id  (https://analytify.io/get-google-client-id-and-client-secret)
   GOOGLE_CLIENT_SECRET = Google client secret


   MAIL_HOST = mail host (smtp.gmail.com)
   MAIL_USER = mail user (your gmail address)
   MAIL_PASS = mail password (google app password)

   NEXT_PUBLIC_SAAVN_API = "https://saavn.dev" # Saavn API URL create your own API from https://github.com/sumitkolhe/jiosaavn-api 
   ```

5. Start the development server.
    ```sh
    npm run dev
    ```

6. Open the project in your browser at [`http://localhost:3000`](http://localhost:3000) to view your project.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Recent Updates (Changelog Summary)

### v2.2.0 (June 2026)
- **Zero-Interruption Playback:** Implemented inline offline view swapping so background music never stops playing when the internet connection is lost.
- **Global Offline Interceptor:** Added a global link listener that intercepts and blocks online page navigations when offline, preventing Next.js fetch crashes.
- **Redesigned Search & Query Pages:** Built a highly polished glassmorphic interface for `/search` and `/search/[query]`, including autocomplete previews, voice recognition animations, and dual-column layouts.
- **Link Navigation Fixes:** Replaced `<a>` tags inside the Notification dropdown with Next.js `<Link>` components to prevent page reloads.

### v2.1.0 (June 2026)
- Emojis replaced with Material UI icons in Home page and Sidebar.
- Fully functional offline downloads dashboard under `/offline`.
- Customized sleep timer modal popup replacing browser prompt alert dialogs.
- Floating rounded mini-player design lifted above the bottom mobile nav bar.


