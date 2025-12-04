const sqlite3 = require('better-sqlite3');
const path = require('path');

// Open the database
const db = new sqlite3(path.join(__dirname, '..', '.tmp', 'data.db'));

console.log('🌱 Starting ultra-minimal database seeding...');

try {
  const now = new Date().toISOString();

  // Insert minimal home page content
  console.log('🏠 Creating minimal home page...');
  const homePageResult = db.prepare(`
    INSERT INTO home_pages (meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    'Simply Enak – Food Tours and more',
    now, now, now,
    'home-page-' + Date.now(),
    'en'
  );
  const homePageId = homePageResult.lastInsertRowid;
  console.log('✅ Created home page with ID:', homePageId);

  // Add basic component data for home page (only using available columns)
  console.log('📝 Adding home page components...');

  // Insert ourToursSection component (only title column available)
  const ourToursResult = db.prepare(`
    INSERT INTO components_home_page_our_tours_sections (title, created_at, updated_at, published_at, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, 1, 1)
  `).run(
    'Our Popular Food Tours',
    now, now, now
  );
  console.log('✅ Created our tours section component');

  // Insert mediaSection component (check what columns it has)
  db.prepare(`
    INSERT INTO components_home_page_media_sections (title, created_at, updated_at, published_at, created_by_id, updated_by_id)
    VALUES (?, ?, ?, ?, 1, 1)
  `).run(
    'Experience Malaysian Food Culture',
    now, now, now
  );
  console.log('✅ Created media section component');

  // Insert basic tour data
  console.log('🍽️ Creating sample tours...');
  const tours = [
    {
      title: 'Kuala Lumpur Street Food Adventure',
      slug: 'kuala-lumpur-street-food-adventure',
      location: 'Kuala Lumpur',
      price: 150,
      duration: '4 hours'
    },
    {
      title: 'Penang Heritage Food Tour',
      slug: 'penang-heritage-food-tour',
      location: 'Penang',
      price: 180,
      duration: '5 hours'
    },
    {
      title: 'Malacca Cultural Cuisine Experience',
      slug: 'malacca-cultural-cuisine-experience',
      location: 'Malacca',
      price: 160,
      duration: '4.5 hours'
    }
  ];

  for (const tour of tours) {
    const tourResult = db.prepare(`
      INSERT INTO tours_mains (title, slug, meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
    `).run(
      tour.title,
      tour.slug,
      tour.title,
      now, now, now,
      'tour-' + Date.now() + '-' + Math.random(),
      'en'
    );

    // Add hero section for this tour (check available columns)
    db.prepare(`
      INSERT INTO components_tour_details_tour_heroes (title, created_at, updated_at, published_at, created_by_id, updated_by_id)
      VALUES (?, ?, ?, ?, 1, 1)
    `).run(
      tour.title,
      now, now, now
    );

    console.log(`✅ Created tour: ${tour.title}`);
  }

  // Insert basic story data
  console.log('📚 Creating sample stories...');
  const stories = [
    {
      title: '11 Foods To Try During Hari Raya',
      slug: '11-foods-to-try-during-hari-raya'
    },
    {
      title: 'A Guide to Malaysian Street Food',
      slug: 'guide-to-malaysian-street-food'
    },
    {
      title: 'The History of Nyonya Cuisine',
      slug: 'history-of-nyonya-cuisine'
    }
  ];

  for (const story of stories) {
    const storyResult = db.prepare(`
      INSERT INTO stories_mains (title, slug, meta_title, created_at, updated_at, published_at, document_id, locale, created_by_id, updated_by_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
    `).run(
      story.title,
      story.slug,
      story.title,
      now, now, now,
      'story-' + Date.now() + '-' + Math.random(),
      'en'
    );

    console.log(`✅ Created story: ${story.title}`);
  }

  console.log('🎉 Ultra-minimal database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`- Home page: 1 entry`);
  console.log(`- Tours: ${tours.length} entries`);
  console.log(`- Stories: ${stories.length} entries`);
  console.log('');
  console.log('🌐 You can now test the frontend at: http://localhost:4322/');

} catch (error) {
  console.error('❌ Error during seeding:', error.message);
} finally {
  db.close();
}