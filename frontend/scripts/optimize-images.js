import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGES_DIR = join(__dirname, '../src/assets/images');
const QUALITY = 85;
const MIN_SAVINGS_PERCENT = 5; // Only keep WebP if it's at least 5% smaller

// Priority images to convert first (largest files)
const PRIORITY_IMAGES = [
  'bg3.jpg',
  'bg2.jpg',
  'kuala-lumpur-1641785_1920.jpg',
  'bg1.jpg',
  'background-for-hero.jpg',
  'bg5.jpg',
  'bg4.jpg',
  '7.jpg',
  '8.jpeg',
  '6.jpg'
];

async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await getImageFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function convertToWebP(inputPath) {
  const ext = extname(inputPath);
  const outputPath = inputPath.replace(ext, '.webp');
  const fileName = basename(inputPath);

  try {
    const stats = await stat(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);

    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const newStats = await stat(outputPath);
    const newSize = (newStats.size / 1024).toFixed(2);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);

    // Delete WebP if it's larger or not significantly smaller
    if (parseFloat(savings) < MIN_SAVINGS_PERCENT) {
      await unlink(outputPath);
      console.log(`⏭️  ${fileName}`);
      console.log(`   ${originalSize}KB → ${newSize}KB (${savings}% smaller) - SKIPPED (not enough savings)`);
      return null;
    }

    console.log(`✅ ${fileName}`);
    console.log(`   ${originalSize}KB → ${newSize}KB (${savings}% smaller)`);

    return {
      file: fileName,
      original: originalSize,
      optimized: newSize,
      savings: savings
    };
  } catch (error) {
    console.error(`❌ Error converting ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`📁 Scanning directory: ${IMAGES_DIR}\n`);

  const allImageFiles = await getImageFiles(IMAGES_DIR);

  // Sort by priority first, then alphabetically
  const sortedFiles = allImageFiles.sort((a, b) => {
    const aName = basename(a);
    const bName = basename(b);
    const aPriority = PRIORITY_IMAGES.indexOf(aName);
    const bPriority = PRIORITY_IMAGES.indexOf(bName);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return aName.localeCompare(bName);
  });

  console.log(`📊 Found ${sortedFiles.length} JPG/JPEG images to convert\n`);
  console.log('🔄 Converting images to WebP...\n');

  const results = [];
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of sortedFiles) {
    const result = await convertToWebP(file);
    if (result) {
      results.push(result);
      totalOriginal += parseFloat(result.original);
      totalOptimized += parseFloat(result.optimized);
    }
    console.log(''); // Empty line between files
  }

  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📈 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files converted: ${results.length}`);
  console.log(`Total original size: ${totalOriginal.toFixed(2)}KB`);
  console.log(`Total optimized size: ${totalOptimized.toFixed(2)}KB`);
  console.log(`Total savings: ${(totalOriginal - totalOptimized).toFixed(2)}KB (${totalSavings}%)`);
  console.log('='.repeat(60));
  console.log('\n✅ Image optimization complete!');
  console.log('\n⚠️  Next steps:');
  console.log('1. Update image imports to use .webp files');
  console.log('2. Keep .jpg files as fallback for older browsers');
  console.log('3. Test the build with: npm run build');
}

main().catch(console.error);
