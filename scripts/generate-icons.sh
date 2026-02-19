#!/bin/bash

# Help2Earn - Icon Generation Script
# This script generates all required PWA icons from the master SVG

# Prerequisites: 
# - ImageMagick installed
# - Or use an online SVG to PNG converter

# Master icon
MASTER="public/icons/icon.svg"
OUTPUT_DIR="public/icons"

# Required sizes
SIZES=(72 96 128 144 152 192 384 512)

echo "🎨 Generating Help2Earn icons..."

# Check if master icon exists
if [ ! -f "$MASTER" ]; then
    echo "❌ Master icon not found: $MASTER"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate icons for each size
for size in "${SIZES[@]}"; do
    echo "📦 Generating ${size}x${size}..."
    
    # Using ImageMagick (if available)
    if command -v convert &> /dev/null; then
        convert -background none -resize ${size}x${size} "$MASTER" "$OUTPUT_DIR/icon-${size}x${size}.png"
    else
        echo "⚠️ ImageMagick not found. Please convert manually:"
        echo "   $MASTER -> $OUTPUT_DIR/icon-${size}x${size}.png"
    fi
done

# Generate splash screens for iOS
echo "📱 Generating iOS splash screens..."

SPLASH_SIZES=(
    "640x1136"
    "750x1334"
    "1242x2208"
    "1125x2436"
    "1536x2048"
    "1668x2224"
    "2048x2732"
)

for splash in "${SPLASH_SIZES[@]}"; do
    width="${splash%x*}"
    height="${splash#*x}"
    echo "🖼️ Generating splash ${width}x${height}..."
    
    if command -v convert &> /dev/null; then
        convert -background "#f97316" -resize ${width}x${height} \
            -gravity center -extent ${width}x${height} \
            "$MASTER" "$OUTPUT_DIR/splash-${splash}.png"
    fi
done

# Generate shortcuts
echo "⚡ Generating shortcut icons..."

# Post shortcut
cat > "$OUTPUT_DIR/shortcut-post.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <circle cx="48" cy="48" r="44" fill="#f97316"/>
  <text x="48" y="62" text-anchor="middle" font-size="40">➕</text>
</svg>
EOF

# Nearby shortcut
cat > "$OUTPUT_DIR/shortcut-nearby.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <circle cx="48" cy="48" r="44" fill="#f97316"/>
  <text x="48" y="62" text-anchor="middle" font-size="40">📍</text>
</svg>
EOF

echo "✅ Icon generation complete!"
echo ""
echo "📋 Manual steps if ImageMagick not available:"
echo "1. Go to https://cloudconvert.com/svg-to-png"
echo "2. Upload $MASTER"
echo "3. Convert to all required sizes"
echo "4. Save to $OUTPUT_DIR"
