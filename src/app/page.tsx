'use client';

import { useState, useEffect } from 'react';
import { BusArrivalResponse } from '@/types/bus';

const LoadIndicator = ({ load }: { load: string }) => {
  const getLoadInfo = (load: string) => {
    switch (load) {
      case 'SEA':
        return {
          text: 'Seats Available',
          bars: 3,
          color: 'bg-green-500'
        };
      case 'SDA':
        return {
          text: 'Some Seats',
          bars: 2,
          color: 'bg-yellow-500'
        };
      case 'LSD':
        return {
          text: 'Standing Only',
          bars: 1,
          color: 'bg-red-500'
        };
      default:
        return {
          text: 'Unknown',
          bars: 0,
          color: 'bg-gray-500'
        };
    }
  };

  const { text, bars, color } = getLoadInfo(load);
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm text-gray-600 dark:text-gray-400">{text}</div>
      <div className="flex gap-1 items-center">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`w-3 h-6 rounded-sm ${
              level <= bars ? color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set initial theme based on system preference
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-6 right-6 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};

const BUS_STOPS = [
  ['66291', 'Aft Medway Drive'],
  ['66009', 'NEX']
] as const;

type BusStopCode = keyof typeof BUS_STOPS[number];

const BusStopCard = ({ code, name }: { code: BusStopCode, name: string }) => {
  const [data, setData] = useState<BusArrivalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/bus-arrival?busStop=${code}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      }
      setData(data);
    } catch (error) {
      console.error('Error fetching bus data:', error);
      setError('Failed to fetch bus arrival data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();
    const interval = setInterval(fetchBusData, 60000); // Refresh every 1 minute
    return () => clearInterval(interval);
  }, [code]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round((date.getTime() - now.getTime()) / (1000 * 60));
    return diffMinutes <= 0 ? 'Arriving' : `${diffMinutes} min`;
  };

  const isNearby = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round((date.getTime() - now.getTime()) / (1000 * 60));
    return diffMinutes <= 2 && diffMinutes >= 0;
  };

  const filtered317Data = data?.Services?.filter(service => service.ServiceNo === '317') || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Bus Stop {code}</p>

      {loading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <div>Loading...</div>
        </div>
      ) : filtered317Data.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No data available for Bus 317 at this stop
        </div>
      ) : (
        <div className="space-y-4">
          {filtered317Data.map((service) => (
            <div key={service.ServiceNo} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-3">
                <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  isNearby(service.NextBus.EstimatedArrival)
                    ? 'bg-green-50 dark:bg-green-900/50 ring-1 ring-green-500 dark:ring-2 dark:ring-green-500/50'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Bus</div>
                  <div className={`font-semibold text-xl mb-3 ${
                    isNearby(service.NextBus.EstimatedArrival)
                      ? 'text-green-600 dark:text-green-400 animate-pulse-fast'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatTime(service.NextBus.EstimatedArrival)}
                  </div>
                  <LoadIndicator load={service.NextBus.Load} />
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  isNearby(service.NextBus2.EstimatedArrival)
                    ? 'bg-green-50 dark:bg-green-900/50 ring-1 ring-green-500 dark:ring-2 dark:ring-green-500/50'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">2nd Bus</div>
                  <div className={`font-semibold text-xl mb-3 ${
                    isNearby(service.NextBus2.EstimatedArrival)
                      ? 'text-green-600 dark:text-green-400 animate-pulse-fast'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatTime(service.NextBus2.EstimatedArrival)}
                  </div>
                  <LoadIndicator load={service.NextBus2.Load} />
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  isNearby(service.NextBus3.EstimatedArrival)
                    ? 'bg-green-50 dark:bg-green-900/50 ring-1 ring-green-500 dark:ring-2 dark:ring-green-500/50'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">3rd Bus</div>
                  <div className={`font-semibold text-xl mb-3 ${
                    isNearby(service.NextBus3.EstimatedArrival)
                      ? 'text-green-600 dark:text-green-400 animate-pulse-fast'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatTime(service.NextBus3.EstimatedArrival)}
                  </div>
                  <LoadIndicator load={service.NextBus3.Load} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    setLastRefresh(new Date());
    const interval = setInterval(() => setLastRefresh(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">
      <ThemeToggle />
      <div className="max-w-lg mx-auto pt-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Where is 317? 🚌</h1>
          {lastRefresh && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Last updated: {lastRefresh.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {BUS_STOPS.map(([code, name]) => (
            <BusStopCard key={code} code={code as keyof typeof BUS_STOPS[number]} name={name} />
          ))}
        </div>
      </div>
    </main>
  );
} 