const { faker } = require('@faker-js/faker');

// Import seed data
const storiesData = require('../../downloaded-project/frontend/src/data/stories.json');
const toursData = require('../../downloaded-project/frontend/src/data/tours.json');

async function seedDatabase() {
  const strapi = require('@strapi/strapi');

  try {
    console.log('🌱 Starting database seeding...');

    // Import stories data
    console.log('📚 Seeding stories...');
    for (const story of storiesData) {
      try {
        const createdStory = await strapi.query('api::stories.stories').create({
          data: {
            title: story.title,
            slug: story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            metaTitle: story.title,
            hero: {
              title: story.title,
              bgImage: null, // Will need to be set manually
            },
            contents: {
              content: story.contents
            },
            categories: [
              {
                name: 'Food Culture',
                color: '#ff6b35'
              }
            ],
            author: {
              name: 'Simply Enak Team',
              image: null
            },
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Created story: ${story.title}`);
      } catch (error) {
        console.error(`❌ Error creating story: ${story.title}`, error.message);
      }
    }

    // Create basic home page content
    console.log('🏠 Seeding home page...');
    try {
      await strapi.query('api::home-page.home-page').create({
        data: {
          metaTitle: 'Simply Enak – Food Tours and more',
          heroSection: {
            title: 'Experience Authentic Malaysian Food Tours',
            subtitle: 'Join us on a culinary adventure through Kuala Lumpur and beyond',
            bgImage: null,
            ctaButton: {
              text: 'Book Your Food Tour',
              url: '/contact'
            }
          },
          ourToursSection: {
            title: 'Our Popular Food Tours',
            subtitle: 'Discover the best of Malaysian cuisine with our expert guides',
            button: {
              text: 'View All Tours',
              url: '/tours'
            }
          },
          experienceTodaySection: {
            title: 'Ready for an unforgettable experience?',
            subtitle: 'Book your Malaysian food adventure today',
            button: {
              text: 'Get Started',
              url: '/contact'
            }
          },
          publishedAt: new Date().toISOString()
        }
      });
      console.log('✅ Created home page content');
    } catch (error) {
      console.error('❌ Error creating home page:', error.message);
    }

    // Create about page
    console.log('📖 Seeding about page...');
    try {
      await strapi.query('api::about.about').create({
        data: {
          metaTitle: 'About Simply Enak',
          aboutHero: {
            title: 'Your Gateway to Authentic Malaysian Cuisine',
            subtitle: 'We are passionate food lovers dedicated to sharing the best of Malaysian culinary experiences',
            bgImage: null
          },
          publishedAt: new Date().toISOString()
        }
      });
      console.log('✅ Created about page');
    } catch (error) {
      console.error('❌ Error creating about page:', error.message);
    }

    // Create contact page
    console.log('📞 Seeding contact page...');
    try {
      await strapi.query('api::contact.contact').create({
        data: {
          metaTitle: 'Contact – Simply Enak',
          heroSection: {
            title: 'Get in Touch',
            subtitle: 'Ready to embark on a culinary adventure? Contact us to book your food tour',
            bgImage: null
          },
          getInTouchSection: {
            title: 'Contact Us',
            subtitle: 'We\'d love to hear from you',
            buttonText: 'Send Message'
          },
          publishedAt: new Date().toISOString()
        }
      });
      console.log('✅ Created contact page');
    } catch (error) {
      console.error('❌ Error creating contact page:', error.message);
    }

    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();