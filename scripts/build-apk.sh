#!/bin/bash

# Help2Earn APK Build Script
# This script prepares and builds the Android APK

echo "🚀 Help2Earn APK Build Script"
echo "=============================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install JDK 17 or higher."
    exit 1
fi

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME is not set. Please install Android SDK."
    exit 1
fi

echo "✓ Environment check passed"

# Build the Next.js app for production
echo ""
echo "📦 Building Next.js app..."
bun run build

# Create static fallback for APK
echo ""
echo "📱 Creating static assets for APK..."
mkdir -p out

# Create a simple index.html that loads the app
cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#f97316">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Help2Earn</title>
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" href="/icons/icon-192x192.png">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f97316, #ea580c);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 20px;
        }
        .logo {
            width: 120px;
            height: 120px;
            margin-bottom: 24px;
            animation: pulse 2s infinite;
        }
        h1 { font-size: 28px; margin-bottom: 12px; }
        p { font-size: 16px; opacity: 0.9; margin-bottom: 24px; }
        .loader {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    </style>
</head>
<body>
    <div class="container">
        <img src="/icons/icon-192x192.png" alt="Help2Earn" class="logo">
        <h1>Help2Earn</h1>
        <p>Madad karke kamaayein</p>
        <div class="loader"></div>
    </div>
    <script>
        // Redirect to app or show install prompt
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
        
        // Check if running in Capacitor
        if (window.Capacitor) {
            console.log('Running in Capacitor');
        }
    </script>
</body>
</html>
EOF

# Copy public assets
cp -r public/* out/ 2>/dev/null || true

echo "✓ Static assets created"

# Sync with Capacitor
echo ""
echo "🔄 Syncing with Capacitor..."
bunx cap sync android

# Build APK
echo ""
echo "🔧 Building APK..."
cd android
./gradlew assembleDebug

echo ""
echo "✅ APK Build Complete!"
echo "📱 APK Location: android/app/build/outputs/apk/debug/app-debug.apk"
