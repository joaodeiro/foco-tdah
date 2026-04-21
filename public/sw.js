// Service Worker — Foco App PWA
// Cache strategy: Network-first para API, Cache-first para assets estáticos

const CACHE_NAME = 'foco-v2'
const STATIC_ASSETS = [
  '/',
  '/app',
  '/manifest.json',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Ignorar requests de extensões e não-http
  if (!event.request.url.startsWith('http')) return

  // API calls — network only (dados em tempo real)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    return
  }

  // Assets estáticos — cache first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    )
    return
  }

  // Páginas — network first, fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})

// Push notifications
self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Foco', {
      body: data.body || 'Hora de focar!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    })
  )
})
