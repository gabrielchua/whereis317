'use client';

import { useState, useEffect } from 'react';
import { BusArrivalResponse } from '@/types/bus';

const LoadIndicator = ({ load }: { load: string }) => {
  const getLoadInfo = (load: string) => {
    switch (load) {
      case 'SEA':
        return {
          text: 'Seats Available',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        };
      case 'SDA':
        return {
          text: 'Standing Available',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        };
      case 'LSD':
        return {
          text: 'Limited Standing',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
      default:
        return {
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        };
    }
  };

  const { text, color } = getLoadInfo(load);
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};

export default function Home() {
  const [busStop, setBusStop] = useState('66291');
  const [data, setData] = useState<BusArrivalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/bus-arrival?busStop=${busStop}`);
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
    const interval = setInterval(fetchBusData, 30000);
    return () => clearInterval(interval);
  }, [busStop]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round((date.getTime() - now.getTime()) / (1000 * 60));
    return diffMinutes <= 0 ? 'Arriving' : `${diffMinutes} min`;
  };

  const filtered317Data = data?.Services?.filter(service => service.ServiceNo === '317') || [];

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <ThemeToggle />
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Where is 317?</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Real-time bus arrival information for service 317</p>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={busStop}
              onChange={(e) => setBusStop(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter bus stop number"
            />
            <button
              onClick={fetchBusData}
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                loading 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="text-center py-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 dark:text-gray-300">
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
                <div key={service.ServiceNo} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Bus 317</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{service.Operator}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Bus</div>
                      <div className="font-semibold text-lg mb-2 dark:text-white">{formatTime(service.NextBus.EstimatedArrival)}</div>
                      <LoadIndicator load={service.NextBus.Load} />
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">2nd Bus</div>
                      <div className="font-semibold text-lg mb-2 dark:text-white">{formatTime(service.NextBus2.EstimatedArrival)}</div>
                      <LoadIndicator load={service.NextBus2.Load} />
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">3rd Bus</div>
                      <div className="font-semibold text-lg mb-2 dark:text-white">{formatTime(service.NextBus3.EstimatedArrival)}</div>
                      <LoadIndicator load={service.NextBus3.Load} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 