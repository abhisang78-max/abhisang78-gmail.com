import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, openLegalPage } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementActive || dismissed) return null;

  return (
    <aside aria-label="Announcement" className="bg-stone-900 text-stone-300 text-xs tracking-wide py-2 px-4 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <p className="font-medium text-stone-200">
            {settings.announcementText}
          </p>
          <span className="hidden md:inline text-stone-500">·</span>
          <button 
            onClick={() => openLegalPage('shipping')}
            className="hidden md:inline text-amber-400/90 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
          >
            Delivery Details
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-stone-100 p-0.5 cursor-pointer shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
