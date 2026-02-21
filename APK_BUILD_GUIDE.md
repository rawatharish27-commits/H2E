# Help2Earn - APK Build Guide

## 🚀 Quick Options to Get the App on Your Phone

### Option 1: PWA (Progressive Web App) - Install NOW! ⚡

**Easiest way - No APK needed!**

1. Open the app in Chrome on your phone
2. Tap the menu (3 dots) → "Add to Home Screen"
3. Or tap the "Install" banner that appears
4. The app icon will appear on your home screen!

**Benefits:**
- Works offline (cached pages)
- Push notifications supported
- Auto-updates when you visit
- No app store needed

---

### Option 2: Build APK on Your Computer 📱

**Prerequisites:**
- Node.js 18+ & Bun installed
- Java JDK 17+
- Android Studio with SDK
- ANDROID_HOME environment variable set

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/rawatharish27-commits/H2E.git
cd H2E

# 2. Install dependencies
bun install

# 3. Set up environment
cp .env.example .env
# Add your DATABASE_URL

# 4. Build the APK
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

**APK Location:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Option 3: Deploy & Connect APK 🌐

**For production deployment:**

1. Deploy your app to Vercel/Railway:
   ```bash
   bun run build
   # Deploy to your preferred hosting
   ```

2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'https://your-app.vercel.app',
     cleartext: true,
     androidScheme: 'https'
   }
   ```

3. Build APK:
   ```bash
   bunx cap sync android
   cd android && ./gradlew assembleDebug
   ```

---

## 📋 Current Project Structure

```
├── android/               # Android native project (Capacitor)
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   └── icons/            # App icons (all sizes)
├── capacitor.config.ts   # Capacitor configuration
└── scripts/
    └── build-apk.sh      # APK build script
```

## 🔑 Signing APK for Release

For Play Store distribution:

```bash
# Generate keystore
keytool -genkey -v -keystore help2earn.keystore -alias help2earn -keyalg RSA -keysize 2048 -validity 10000

# Build signed APK
cd android
./gradlew assembleRelease
```

## 📱 Capacitor Plugins Included

- **Geolocation** - GPS for nearby help
- **Push Notifications** - Task alerts
- **Splash Screen** - App launch screen
- **Status Bar** - Native status bar color
- **Keyboard** - Better form input handling

---

## ⚡ Fastest Way: PWA Installation

**Just open the app in your phone browser and tap "Add to Home Screen"!**

The app will work like a native app with:
- Offline support
- Push notifications
- Home screen icon
- Full screen mode
