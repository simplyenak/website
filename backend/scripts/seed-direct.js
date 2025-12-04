const sqlite3 = require('better-sqlite3');
const path = require('path');

// Open the database
const db = new sqlite3(path.join(__dirname, '..', '.tmp', 'data.db'));

console.log('🌱 Starting direct database seeding...');

try {
  // Get current timestamp
  const now = new Date().toISOString();

  // Insert home page
  console.log('🏠 Creating home page...');
  const homePageResult = db.prepare(`
    INSERT INTO home_pages (meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    'Simply Enak – Food Tours and more',
    now, now, now,
    'home-page-' + Date.now(),
    'en'
  );
  console.log(`✅ Created home page with ID: ${homePageResult.lastInsertRowid}`);

  // Insert about page
  console.log('📖 Creating about page...');
  const aboutResult = db.prepare(`
    INSERT INTO abouts (meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    'About Simply Enak',
    now, now, now,
    'about-' + Date.now(),
    'en'
  );
  console.log(`✅ Created about page with ID: ${aboutResult.lastInsertRowid}`);

  // Insert contact page
  console.log('📞 Creating contact page...');
  const contactResult = db.prepare(`
    INSERT INTO contacts (meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    'Contact – Simply Enak',
    now, now, now,
    'contact-' + Date.now(),
    'en'
  );
  console.log(`✅ Created contact page with ID: ${contactResult.lastInsertRowid}`);

  // Insert a sample story
  console.log('📚 Creating sample story...');
  const storyResult = db.prepare(`
    INSERT INTO stories_mains (title, slug, meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    '11 Foods To Try During Hari Raya',
    '11-foods-to-try-during-hari-raya',
    '11 Foods To Try During Hari Raya',
    now, now, now,
    'story-' + Date.now(),
    'en'
  );
  console.log(`✅ Created story with ID: ${storyResult.lastInsertRowid}`);

  // Insert a sample tour
  console.log('🍽️ Creating sample tour...');
  const tourResult = db.prepare(`
    INSERT INTO tours_mains (title, slug, meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    'Kuala Lumpur Food Adventure',
    'kuala-lumpur-food-adventure',
    'Kuala Lumpur Food Adventure Tour',
    now, now, now,
    'tour-' + Date.now(),
    'en'
  );
  console.log(`✅ Created tour with ID: ${tourResult.lastInsertRowid}`);

  console.log('✅ Database seeding completed successfully!');

} catch (error) {
  console.error('❌ Error during seeding:', error.message);
} finally {
  db.close();
}