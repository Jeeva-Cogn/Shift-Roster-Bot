// NPE ShiftBot Service Worker - Offline Support
const CACHE_NAME = 'npe-shiftbot-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install Service Worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('NPE ShiftBot: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('NPE ShiftBot: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline schedule generation
self.addEventListener('sync', event => {
  if (event.tag === 'generate-schedule') {
    event.waitUntil(
      // Process offline schedule requests when back online
      handleOfflineScheduleGeneration()
    );
  }
});

async function handleOfflineScheduleGeneration() {
  // Handle offline schedule generation logic
  console.log('NPE ShiftBot: Processing offline schedule generation');
}
