'use client'
import { RiWifiOffLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import OfflineView from '@/components/OfflineView';

const OnlineStatus = ({ children }) => {
  const [onLineStatus, setOnLineStatus] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Set initial status
    const initialOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setOnLineStatus(initialOnline);

    const handleOnline = () => {
      setOnLineStatus(true);
      toast.success('You are back online!');
    };

    const handleOffline = () => {
      setOnLineStatus(false);
      toast.error('Connection lost. Switching to Offline Mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global click interceptor to prevent Next.js page chunk-fetch crashes while offline
    const handleLinkClick = (e) => {
      if (navigator.onLine) return;

      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Allow settings, downloads, DMCA or external links
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href === '/offline' ||
        href === '/Download' ||
        href === '/settings' ||
        href === '/dmca'
      ) {
        return;
      }

      // Block navigation to online pages to prevent browser crashing and music stopping
      e.preventDefault();
      toast.error('You are offline. Only offline downloads and settings are available.');
    };

    document.addEventListener('click', handleLinkClick, true); // Capture phase listener

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  return (
    <>
      {/* Red Warning Banner (floating at the top) */}
      {!onLineStatus && (
        <div 
          className="fixed top-16 left-0 right-0 z-[60] flex justify-center px-4 animate-fade-in-up"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="glass-card-flat flex items-center justify-between gap-4 p-3 rounded-2xl w-full max-w-md shadow-2xl border border-red-500/25"
            style={{ 
              background: 'rgba(239,68,68,0.92)', 
              backdropFilter: 'blur(20px)',
              pointerEvents: 'auto' 
            }}
          >
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <RiWifiOffLine size={20} className="animate-pulse" />
              <span>Offline Mode: showing downloads.</span>
            </div>
            <button 
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-2.5 rounded-lg transition-all" 
              onClick={() => {
                if (navigator.onLine) {
                  setOnLineStatus(true);
                  toast.success('You are back online!');
                } else {
                  toast.error('Still offline.');
                }
              }}
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {/* Render offline view overlay instead of main pages when disconnected */}
      {!onLineStatus ? (
        <OfflineView />
      ) : (
        children
      )}
    </>
  );
}

export default OnlineStatus;