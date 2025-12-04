const fs = require('fs');
const path = require('path');

console.log('🎭 Creating mock API responses for frontend testing...');

try {
  const mockData = {
    // Mock home page data that frontend expects
    homePage: {
      data: {
        id: 1,
        attributes: {
          metaTitle: 'Simply Enak – Food Tours and more',
          ourToursSection: {
            title: 'Our Popular Food Tours',
            button: {
              text: 'View All Tours',
              url: '/tours'
            }
          },
          experienceTodaySection: {
            title: 'Experience Today',
            button: {
              text: 'Get Started',
              url: '/contact'
            }
          },
          mediaSection: {
            title: 'Experience Malaysian Food Culture',
            videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          SEO: {
            title: 'Simply Enak – Food Tours and more',
            description: 'Experience authentic Malaysian food tours with Simply Enak',
            image: null
          }
        }
      }
    },

    // Mock tours data
    tours: {
      data: [
        {
          id: 1,
          attributes: {
            title: 'Kuala Lumpur Street Food Adventure',
            slug: 'kuala-lumpur-street-food-adventure',
            hero: {
              title: 'Kuala Lumpur Street Food Adventure',
              price: 150,
              duration: '4 hours',
              location: 'Kuala Lumpur',
              image: null
            }
          }
        },
        {
          id: 2,
          attributes: {
            title: 'Penang Heritage Food Tour',
            slug: 'penang-heritage-food-tour',
            hero: {
              title: 'Penang Heritage Food Tour',
              price: 180,
              duration: '5 hours',
              location: 'Penang',
              image: null
            }
          }
        },
        {
          id: 3,
          attributes: {
            title: 'Malacca Cultural Cuisine Experience',
            slug: 'malacca-cultural-cuisine-experience',
            hero: {
              title: 'Malacca Cultural Cuisine Experience',
              price: 160,
              duration: '4.5 hours',
              location: 'Malacca',
              image: null
            }
          }
        },
        {
          id: 4,
          attributes: {
            title: 'Ipoh Local Delights Tour',
            slug: 'ipoh-local-delights-tour',
            hero: {
              title: 'Ipoh Local Delights Tour',
              price: 140,
              duration: '4 hours',
              location: 'Ipoh',
              image: null
            }
          }
        },
        {
          id: 5,
          attributes: {
            title: 'Kota Kinabalu Seafood Adventure',
            slug: 'kota-kinabalu-seafood-adventure',
            hero: {
              title: 'Kota Kinabalu Seafood Adventure',
              price: 200,
              duration: '5 hours',
              location: 'Kota Kinabalu',
              image: null
            }
          }
        },
        {
          id: 6,
          attributes: {
            title: 'Johor Bahru Heritage Food Trail',
            slug: 'johor-bahru-heritage-food-trail',
            hero: {
              title: 'Johor Bahru Heritage Food Trail',
              price: 170,
              duration: '4.5 hours',
              location: 'Johor Bahru',
              image: null
            }
          }
        }
      ]
    },

    // Mock stories data
    stories: {
      data: [
        {
          id: 1,
          attributes: {
            title: '11 Foods To Try During Hari Raya',
            slug: '11-foods-to-try-during-hari-raya',
            hero: {
              title: '11 Foods To Try During Hari Raya',
              bgImage: null
            },
            excerpt: 'Discover the delicious traditional foods enjoyed during Hari Raya celebrations in Malaysia.',
            publishedAt: new Date().toISOString()
          }
        },
        {
          id: 2,
          attributes: {
            title: 'A Guide to Malaysian Street Food',
            slug: 'guide-to-malaysian-street-food',
            hero: {
              title: 'A Guide to Malaysian Street Food',
              bgImage: null
            },
            excerpt: 'Everything you need to know about exploring Malaysia\'s vibrant street food scene.',
            publishedAt: new Date().toISOString()
          }
        },
        {
          id: 3,
          attributes: {
            title: 'The History of Nyonya Cuisine',
            slug: 'history-of-nyonya-cuisine',
            hero: {
              title: 'The History of Nyonya Cuisine',
              bgImage: null
            },
            excerpt: 'Explore the rich cultural heritage behind Nyonya Peranakan cuisine.',
            publishedAt: new Date().toISOString()
          }
        }
      ]
    }
  };

  // Create mock API files
  const apiDir = path.join(__dirname, '..', 'public', 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  // Write home page mock API
  fs.writeFileSync(
    path.join(apiDir, 'home-pages.json'),
    JSON.stringify(mockData.homePage, null, 2)
  );
  console.log('✅ Created mock API: /api/home-pages.json');

  // Write tours mock API
  fs.writeFileSync(
    path.join(apiDir, 'tours.json'),
    JSON.stringify(mockData.tours, null, 2)
  );
  console.log('✅ Created mock API: /api/tours.json');

  // Write stories mock API
  fs.writeFileSync(
    path.join(apiDir, 'stories.json'),
    JSON.stringify(mockData.stories, null, 2)
  );
  console.log('✅ Created mock API: /api/stories.json');

  console.log('');
  console.log('🎉 Mock API creation completed!');
  console.log('');
  console.log('📊 Created mock APIs for:');
  console.log(`- Home page: 1 entry with components`);
  console.log(`- Tours: ${mockData.tours.data.length} entries`);
  console.log(`- Stories: ${mockData.stories.data.length} entries`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Update frontend to fetch from mock APIs temporarily');
  console.log('2. Once Strapi API is fixed, switch back to real APIs');
  console.log('3. Start building the new content architecture with tagging system');

} catch (error) {
  console.error('❌ Error creating mock APIs:', error.message);
}