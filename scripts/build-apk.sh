#!/bin/bash

# Help2Earn - APK Build Script
# This script builds the Android APK for Play Store deployment

echo "🚀 Building Help2Earn APK for Play Store..."
echo ""

# Step 1: Build Next.js static export
echo "📦 Step 1: Building Next.js app..."
bun run build
bun run export

# Step 2: Sync Capacitor
echo "🔄 Step 2: Syncing Capacitor..."
npx cap sync android

# Step 3: Build Android APK
echo "🤖 Step 3: Building Android APK..."
cd android
./gradlew assembleRelease

# Step 4: Sign APK (if keystore exists)
if [ -f "../keystore.jks" ]; then
    echo "✍️ Step 4: Signing APK..."
    ./gradlew signingReport
fi

echo ""
echo "✅ APK Build Complete!"
echo "📱 APK Location: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "📋 Next Steps:"
echo "1. Test the APK on multiple devices"
echo "2. Create screenshots for Play Store"
echo "3. Upload to Play Console"
echo "4. Fill in store listing details"
