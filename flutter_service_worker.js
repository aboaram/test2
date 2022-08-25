'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "87e2fed8cc92fc6c24175f6fd6ff5ebe",
"manifest.json": "e371dc6f2f53f7e27142f32ecb0754d7",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "e81e1c0bb540cb5ad41a40365a6bc5da",
"/": "e81e1c0bb540cb5ad41a40365a6bc5da",
"assets/asset/fonts/FontsFree-Net-SF-Compact-Rounded-Bold.ttf": "f947d32fff39e8f82a6f39443d0bf1c6",
"assets/asset/fonts/Cardo-Italic.ttf": "36276bf672f94c08cc5a57966cb49641",
"assets/asset/fonts/Cardo-Regular.ttf": "9818302bde1c74eaa2f0331c0b0b1189",
"assets/asset/fonts/FontsFree-Net-SF-Compact-Rounded-Semibold.ttf": "b42f18dcae008327043d2b2293dcd7c8",
"assets/asset/fonts/Cardo-Bold.ttf": "ca58f66af4a608b85fe97fa49bdf1770",
"assets/asset/fonts/FontsFree-Net-SF-Compact-Rounded-Regular.ttf": "08f9ed5260f2f87be1abdafc7942dcd2",
"assets/asset/fonts/FontsFree-Net-SF-Compact-Rounded-Light.ttf": "556ac2391be9a14d21edd323d34d9aa7",
"assets/asset/fonts/Product-Sans-Bold.ttf": "dba0c688b8d5ee09a1e214aebd5d25e4",
"assets/asset/placeholder.jpg": "81abc0d9b59a9aba9191102834f2d978",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "e7eecf556b9d1e280a8e88c35188971d",
"assets/icons/CustomIcons.ttf": "45cfc4a752b817e628abf72c2bb36313",
"assets/FontManifest.json": "845acb1612730b8a1733ca65eeb77dd7",
"assets/AssetManifest.json": "256373cd1b4dd7b8d9e9cf3228a4557f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/icon/playstore.png": "77a41cef88e89ea05aea0a0a68d55caa",
"assets/icon/playe.png": "135ec7ec1e8eaea4df30eea79e7fe518",
"assets/icon/jordan.png": "5fff4338d1922a4caf21bb183a5a0ccf",
"assets/icon/elians.png": "c52b3de312af185ff418ed133e9c29cb",
"assets/icon/spark.svg": "57e008d122cd703b4f034dc66af1b8ab",
"assets/icon/report.png": "0c713832774211a100022816fa8a7213",
"assets/icon/balance.png": "bc07821952ff77454071c68bb25a5279",
"assets/icon/lightning.png": "decd489d15391f4f64b581650afcd4ab",
"assets/icon/rewarddd.png": "cc538dd3a49a35488cc7f167401fb95f",
"assets/icon/invite.png": "2f9ddf467cce1a8ead068d583b2ed9e9",
"assets/icon/help.png": "d0f30f85cd696b820e62006d0da751b7",
"assets/icon/team.png": "5f7d12858b63df55daeb43c700bffc37",
"assets/icon/giphy.gif": "591a5236cacded54720f2460868338c2",
"assets/icon/fc.png": "4fe77be544f31ed7c793d32a4b981125",
"assets/icon/spark.png": "2b9cc38f4feaf43ef030e7b42160c428",
"assets/icon/support.png": "1f0788eb66bea13d7f5031460d067d8b",
"assets/icon/reward.png": "be0397356b8b559077c6b650e31258be",
"assets/icon/wallet15.jpg": "38bf33d0b9e0eab39244290f35eb5ec9",
"assets/icon/spaceman.png": "3fbad0742f3b778b08b3f4f2e57176e8",
"assets/icon/profilesircal.png": "59883a5d5029698ccf829b97407931af",
"assets/icon/youtube.png": "004b50b9851ce9243996aed009ada349",
"version.json": "e11731e98a30a186480ed5b2067ae1de"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
