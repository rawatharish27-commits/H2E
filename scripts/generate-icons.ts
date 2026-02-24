import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = './public/icons/icon-512x512.png';
const outputDir = './public/icons';

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed: icon-${size}x${size}.png - ${error}`);
    }
  }

  // Generate maskable icon (with padding for safe area)
  const maskableSize = 512;
  const safeArea = 0.8; // 80% safe area
  const iconSize = Math.floor(maskableSize * safeArea);
  const padding = Math.floor((maskableSize - iconSize) / 2);

  try {
    await sharp(sourceIcon)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-maskable-512x512.png'));
    
    console.log('✓ Generated: icon-maskable-512x512.png');
  } catch (error) {
    console.error('✗ Failed: icon-maskable-512x512.png -', error);
  }

  // Generate favicon
  try {
    await sharp(sourceIcon)
      .resize(32, 32)
      .png()
      .toFile('./public/favicon.ico');
    console.log('✓ Generated: favicon.ico');
  } catch (error) {
    console.error('✗ Failed: favicon.ico -', error);
  }

  // Generate Apple Touch Icon
  try {
    await sharp(sourceIcon)
      .resize(180, 180)
      .png()
      .toFile('./public/apple-touch-icon.png');
    console.log('✓ Generated: apple-touch-icon.png');
  } catch (error) {
    console.error('✗ Failed: apple-touch-icon.png -', error);
  }

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons();
