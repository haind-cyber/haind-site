// service-worker.js - COMPLETE VERSION WITH AUDIO CACHING
const CACHE_VERSION = '3.0.0';
const CACHE_NAME = `ndh-site-v${CACHE_VERSION}`;
const urlsToCache = [
    // Core files
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/audio-config.js',
    '/thank-you.html',
    
    // Audio files (critical for Android)
    '/audio/one-love.mp3',
    '/audio/cosmic-ambient.mp3',
    
    // Fallback audio (optional)
    '/audio/one-love.ogg',
    '/audio/cosmic-ambient.ogg',
    
    // Fonts (cache for offline use)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600&display=swap',
    
    // Images
    '/images/mc-banner.png',
    
    // Fallback offline page
    '/offline.html'
];

// === CACHE HELPER FUNCTIONS ===
async function cacheResponse(request, response) {
    if (!response || !response.ok) return;
    
    try {
        const cache = await caches.open(CACHE_NAME);
        const clonedResponse = response.clone();
        await cache.put(request, clonedResponse);
        console.log('💾 Cached:', request.url);
    } catch (error) {
        console.log('⚠️ Cache put error:', error.message);
    }
}

// === INSTALL EVENT ===
self.addEventListener('install', event => {
    console.log('🛠️ Service Worker: Installing version', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Opened cache:', CACHE_NAME);
                
                // Pre-cache critical resources
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.log(`⚠️ Failed to cache ${url}:`, error.message);
                        });
                    })
                );
            })
            .then(() => {
                console.log('✅ All resources pre-cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker installation failed:', error);
            })
    );
});

// === ACTIVATE EVENT ===
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating version', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (cacheName !== CACHE_NAME) {
                        console.log(`🗑️ Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activated for version', CACHE_VERSION);
            return self.clients.claim();
        })
        .catch(error => {
            console.error('❌ Service Worker activation failed:', error);
        })
    );
});

// === FETCH EVENT - INTELLIGENT CACHING STRATEGY ===
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip non-GET requests and browser extensions
    if (event.request.method !== 'GET' || 
        url.protocol === 'chrome-extension:' ||
        url.hostname === 'chrome.google.com') {
        return;
    }
    
    // Skip cache for versioned files (let browser handle them)
    if (url.search.includes('?v=') || url.search.includes('?version=')) {
        return;
    }
    
    // Handle different resource types with appropriate strategies
    if (url.pathname.includes('/audio/')) {
        // Strategy 1: Audio files - Cache First, then Network
        event.respondWith(audioCacheStrategy(event));
        return;
    }
    
    if (url.pathname.includes('/images/')) {
        // Strategy 2: Images - Cache First, Stale While Revalidate
        event.respondWith(imageCacheStrategy(event));
        return;
    }
    
    if (url.hostname.includes('googleapis.com') || 
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com')) {
        // Strategy 3: External resources - Stale While Revalidate
        event.respondWith(externalResourceStrategy(event));
        return;
    }
    
    // Strategy 4: HTML/CSS/JS - Network First, Cache Fallback
    event.respondWith(networkFirstStrategy(event));
});

// === CACHING STRATEGIES ===

// Strategy 1: Audio files (critical for Android) - FIXED
function audioCacheStrategy(event) {
    return caches.match(event.request)
        .then(cachedResponse => {
            // Return cached audio immediately
            if (cachedResponse) {
                console.log('🎵 Audio served from cache:', event.request.url);
                return cachedResponse;
            }
            
            // If not in cache, fetch and cache it
            return fetch(event.request)
                .then(response => {
                    // Cache the audio file
                    if (response.ok) {
                        cacheResponse(event.request, response);
                    }
                    return response;
                })
                .catch(error => {
                    console.log('❌ Audio fetch failed:', error);
                    
                    // Provide silent audio fallback if real audio fails
                    if (event.request.url.includes('one-love')) {
                        return new Response('', {
                            status: 404,
                            headers: { 'Content-Type': 'audio/mpeg' }
                        });
                    }
                    
                    // Return error response
                    return new Response('Audio not available', {
                        status: 404,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
        });
}

// Strategy 2: Images - Cache First, Stale While Revalidate - FIXED
function imageCacheStrategy(event) {
    return caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(event.request)
                .then(response => {
                    // Cache response
                    if (response.ok) {
                        cacheResponse(event.request, response);
                    }
                    return response;
                })
                .catch(() => {
                    return new Response('', { status: 503 });
                });
        });
}

// Strategy 3: External resources - FIXED
function externalResourceStrategy(event) {
    return caches.match(event.request)
        .then(cachedResponse => {
            // Always try network for external resources
            const networkFetch = fetch(event.request)
                .then(response => {
                    // Cache the response
                    if (response.ok) {
                        cacheResponse(event.request, response);
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, return cached if available
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // No cache available, return offline fallback
                    return new Response('', {
                        status: 503,
                        statusText: 'Network Error'
                    });
                });
            
            return cachedResponse ? Promise.resolve(cachedResponse) : networkFetch;
        });
}

// Strategy 4: Network First for core files - FIXED
function networkFirstStrategy(event) {
    return fetch(event.request)
        .then(response => {
            // Cache the successful response
            if (response.ok) {
                cacheResponse(event.request, response);
            }
            return response;
        })
        .catch(() => {
            // Network failed, try cache
            return caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // For HTML requests, return offline page
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/offline.html');
                    }
                    
                    // For CSS/JS, return empty response
                    if (event.request.url.includes('.css')) {
                        return new Response('', {
                            status: 200,
                            headers: { 'Content-Type': 'text/css' }
                        });
                    }
                    
                    if (event.request.url.includes('.js')) {
                        return new Response('', {
                            status: 200,
                            headers: { 'Content-Type': 'application/javascript' }
                        });
                    }
                    
                    // Default fallback
                    return new Response('Resource not available offline', {
                        status: 404,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
        });
}

// === BACKGROUND SYNC FOR FORM SUBMISSIONS ===
self.addEventListener('sync', event => {
    if (event.tag === 'submit-contact-form') {
        console.log('📡 Background sync: Processing form submission');
        event.waitUntil(processPendingForms());
    }
});

async function processPendingForms() {
    try {
        const db = await openFormDatabase();
        const forms = await db.getAll('pendingForms');
        
        for (const form of forms) {
            const response = await fetch(form.url, {
                method: 'POST',
                headers: form.headers,
                body: form.body
            });
            
            if (response.ok) {
                await db.delete('pendingForms', form.id);
                console.log('✅ Form submitted successfully in background');
                
                // Send notification to user
                self.registration.showNotification('Thành công!', {
                    body: 'Tin nhắn của bạn đã được gửi',
                    icon: '/images/notification-icon.png'
                });
            }
        }
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// === PUSH NOTIFICATIONS ===
self.addEventListener('push', event => {
    console.log('📢 Push notification received');
    
    let data = {
        title: 'Nguyễn Đức Hải',
        body: 'Có tin nhắn mới từ khách hàng!',
        icon: '/images/notification-icon.png',
        badge: '/images/badge.png',
        tag: 'new-message'
    };
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            console.log('Push data is not JSON:', e);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            tag: data.tag,
            data: data.url || '/',
            actions: [
                {
                    action: 'open',
                    title: 'Mở'
                },
                {
                    action: 'close',
                    title: 'Đóng'
                }
            ]
        })
    );
});

self.addEventListener('notificationclick', event => {
    console.log('👆 Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'open' || event.action === '') {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                // Check if there's already a window/tab open
                for (const client of windowClients) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data || '/');
                }
            })
        );
    }
});

// === PERIODIC SYNC (for background updates) ===
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
        console.log('🔄 Periodic sync: Updating content');
        event.waitUntil(updateContentCache());
    }
});

async function updateContentCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Update critical resources
        const updatePromises = urlsToCache.map(url => {
            return fetch(url, { cache: 'no-store' })
                .then(response => {
                    if (response.ok) {
                        return cacheResponse({ url }, response);
                    }
                })
                .catch(error => {
                    console.log(`⚠️ Failed to update ${url}:`, error);
                });
        });
        
        await Promise.all(updatePromises);
        console.log('✅ Content cache updated');
    } catch (error) {
        console.error('❌ Periodic sync failed:', error);
    }
}

// === OFFLINE FALLBACK ===
async function getOfflineFallback(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Try to get from cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
        const offlinePage = await cache.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // Return generic offline response
    return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Offline</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: #f8f9fa;
                }
                h1 { color: #e91e63; }
            </style>
        </head>
        <body>
            <h1>📡 Bạn đang ngoại tuyến</h1>
            <p>Vui lòng kiểm tra kết nối internet và thử lại.</p>
            <button onclick="window.location.reload()">Thử lại</button>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// === DATABASE HELPER FOR OFFLINE FORMS ===
function openFormDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ContactFormDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = event => {
            const db = event.target.result;
            
            // Create object store for pending forms
            if (!db.objectStoreNames.contains('pendingForms')) {
                const store = db.createObjectStore('pendingForms', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

// === CACHE CLEANUP ===
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCache = CACHE_NAME;
    
    return Promise.all(
        cacheNames.map(cacheName => {
            if (cacheName !== currentCache) {
                console.log(`🗑️ Cleaning up old cache: ${cacheName}`);
                return caches.delete(cacheName);
            }
        })
    );
}

// === HEALTH CHECK ===
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'HEALTH_CHECK') {
        console.log('❤️ Health check received from client');
        event.ports[0].postMessage({
            type: 'HEALTH_CHECK_RESPONSE',
            status: 'healthy',
            version: CACHE_VERSION,
            cacheName: CACHE_NAME
        });
    }
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏩ Skip waiting requested');
        self.skipWaiting();
    }
});

// === ERROR HANDLING ===
self.addEventListener('error', event => {
    console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker Unhandled Rejection:', event.reason);
});

// === INITIALIZATION LOG ===
console.log('✅ Service Worker loaded successfully');
console.log('📊 Cache Name:', CACHE_NAME);
console.log('🔢 Version:', CACHE_VERSION);
console.log('📦 Resources to cache:', urlsToCache.length);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_NAME,
        CACHE_VERSION,
        urlsToCache,
        audioCacheStrategy,
        imageCacheStrategy,
        externalResourceStrategy,
        networkFirstStrategy
    };
}