import React, { createContext, useState, useContext } from 'react';

type MediaItem = {
  id: string;
  title: string;
  poster: string;
  availableOn: string[];
};

type WatchlistContextType = {
  watchlist: MediaItem[];
  toggleWatchlist: (item: MediaItem) => void;
};

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  toggleWatchlist: () => {},
});

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);

  const toggleWatchlist = (item: MediaItem) => {
    if (watchlist.some(w => w.id === item.id)) {
      setWatchlist(watchlist.filter(w => w.id !== item.id));
    } else {
      setWatchlist([...watchlist, item]);
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
