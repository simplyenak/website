const fs = require('fs');
const path = require('path');

console.log('🎭 Creating enhanced mock data for new content architecture...');

try {
  const enhancedMockData = {
    // Enhanced home page data
    homePage: {
      data: {
        id: 1,
        attributes: {
          metaTitle: 'Simply Enak – Malaysian Food Tours and Culinary Experiences',
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
            title: 'Simply Enak – Malaysian Food Tours and Culinary Experiences',
            description: 'Experience authentic Malaysian food tours with Simply Enak. Discover street food, heritage cuisine, and cultural culinary experiences.',
            image: null
          }
        }
      }
    },

    // Enhanced tours data with tags for segmentation
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
            },
            tags: [
              { name: 'kl', category: 'destination' },
              { name: 'street-food', category: 'type' },
              { name: 'vegetarian-friendly', category: 'dietary' },
              { name: 'family-friendly', category: 'group' }
            ],
            shortDescription: 'Explore the vibrant street food scene of Malaysia\'s capital',
            duration: '4 hours',
            difficulty: 'Easy',
            maxGroupSize: 12
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
            },
            tags: [
              { name: 'penang', category: 'destination' },
              { name: 'heritage', category: 'type' },
              { name: 'non-vegetarian', category: 'dietary' },
              { name: 'couples', category: 'group' }
            ],
            shortDescription: 'Discover Peranakan cuisine and colonial heritage foods',
            duration: '5 hours',
            difficulty: 'Medium',
            maxGroupSize: 8
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
            },
            tags: [
              { name: 'malacca', category: 'destination' },
              { name: 'heritage', category: 'type' },
              { name: 'halal-certified', category: 'dietary' },
              { name: 'family-friendly', category: 'group' }
            ],
            shortDescription: 'Explore UNESCO World Heritage sites through food',
            duration: '4.5 hours',
            difficulty: 'Easy',
            maxGroupSize: 10
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
            },
            tags: [
              { name: 'ipoh', category: 'destination' },
              { name: 'street-food', category: 'type' },
              { name: 'vegetarian-friendly', category: 'dietary' },
              { name: 'solo-travelers', category: 'group' }
            ],
            shortDescription: 'Taste the famous Ipoh cuisine and local delicacies',
            duration: '4 hours',
            difficulty: 'Easy',
            maxGroupSize: 6
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
            },
            tags: [
              { name: 'east-malaysia', category: 'destination' },
              { name: 'seafood', category: 'type' },
              { name: 'non-vegetarian', category: 'dietary' },
              { name: 'couples', category: 'group' }
            ],
            shortDescription: 'Fresh seafood and Borneo specialties by the sea',
            duration: '5 hours',
            difficulty: 'Medium',
            maxGroupSize: 8
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
            },
            tags: [
              { name: 'johor-bahru', category: 'destination' },
              { name: 'heritage', category: 'type' },
              { name: 'halal-certified', category: 'dietary' },
              { name: 'corporate-teams', category: 'group' }
            ],
            shortDescription: 'Royal cuisine and traditional Malay heritage foods',
            duration: '4.5 hours',
            difficulty: 'Medium',
            maxGroupSize: 15
          }
        },
        {
          id: 7,
          attributes: {
            title: 'Vegetarian Kuala Lumpur Food Tour',
            slug: 'vegetarian-kuala-lumpur-food-tour',
            hero: {
              title: 'Vegetarian Kuala Lumpur Food Tour',
              price: 120,
              duration: '3.5 hours',
              location: 'Kuala Lumpur',
              image: null
            },
            tags: [
              { name: 'kl', category: 'destination' },
              { name: 'vegetarian', category: 'dietary' },
              { name: 'vegan-options', category: 'dietary' },
              { name: 'family-friendly', category: 'group' }
            ],
            shortDescription: 'Plant-based Malaysian cuisine and vegetarian street food',
            duration: '3.5 hours',
            difficulty: 'Easy',
            maxGroupSize: 10
          }
        },
        {
          id: 8,
          attributes: {
            title: 'Fine Dining Malaysian Cuisine',
            slug: 'fine-dining-malaysian-cuisine',
            hero: {
              title: 'Fine Dining Malaysian Cuisine',
              price: 300,
              duration: '3 hours',
              location: 'Kuala Lumpur',
              image: null
            },
            tags: [
              { name: 'kl', category: 'destination' },
              { name: 'fine-dining', category: 'type' },
              { name: 'vegetarian-friendly', category: 'dietary' },
              { name: 'couples', category: 'group' }
            ],
            shortDescription: 'Upscale Malaysian cuisine with modern presentation',
            duration: '3 hours',
            difficulty: 'Easy',
            maxGroupSize: 4
          }
        },
        {
          id: 9,
          attributes: {
            title: 'Corporate Team Building Food Tour',
            slug: 'corporate-team-building-food-tour',
            hero: {
              title: 'Corporate Team Building Food Tour',
              price: 250,
              duration: '4 hours',
              location: 'Kuala Lumpur',
              image: null
            },
            tags: [
              { name: 'kl', category: 'destination' },
              { name: 'team-building', category: 'type' },
              { name: 'family-friendly', category: 'dietary' },
              { name: 'corporate-teams', category: 'group' }
            ],
            shortDescription: 'Interactive food experiences for team building',
            duration: '4 hours',
            difficulty: 'Easy',
            maxGroupSize: 20
          }
        }
      ]
    },

    // Enhanced stories data with categories
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
            content: "There's nothing in this world like the food you will find in Malaysia during Hari Raya. Don't get me wrong, we have amazing food all year round and for special occasions, but the delicacies served during Hari Raya are at the top of most of our tourists' 'must-have' lists. Hari Raya marks the end of Ramadan, or the fasting month, for Muslims worldwide, and especially here in Malaysia.",
            categories: [
              { name: 'Food Culture', slug: 'food-culture' },
              { name: 'Festivals', slug: 'festivals' }
            ],
            publishedAt: new Date().toISOString(),
            readTime: '5 min read'
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
            content: 'Malaysia\'s street food scene is one of the most diverse and exciting in the world. From hawker centers to night markets, there\'s something for every taste and budget.',
            categories: [
              { name: 'Food Culture', slug: 'food-culture' },
              { name: 'Travel Guides', slug: 'travel-guides' }
            ],
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            readTime: '8 min read'
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
            content: 'Nyonya cuisine represents the beautiful fusion of Chinese and Malay culinary traditions, developed by the Peranakan community in Malaysia and Singapore.',
            categories: [
              { name: 'Food Culture', slug: 'food-culture' },
              { name: 'Heritage', slug: 'heritage' }
            ],
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            readTime: '6 min read'
          }
        },
        {
          id: 4,
          attributes: {
            title: 'Best Hawker Centers in Kuala Lumpur',
            slug: 'best-hawker-centres-kuala-lumpur',
            hero: {
              title: 'Best Hawker Centers in Kuala Lumpur',
              bgImage: null
            },
            excerpt: 'Your ultimate guide to the must-visit hawker centers in Kuala Lumpur.',
            categories: [
              { name: 'Restaurant Reviews', slug: 'restaurant-reviews' },
              { name: 'Travel Guides', slug: 'travel-guides' }
            ],
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            readTime: '7 min read'
          }
        },
        {
          id: 5,
          attributes: {
            title: 'Malaysian Breakfast Culture',
            slug: 'malaysian-breakfast-culture',
            hero: {
              title: 'Malaysian Breakfast Culture',
              bgImage: null
            },
            excerpt: 'Discover why breakfast is the most important meal of the day in Malaysia.',
            content: 'From nasi lemak to roti canai, Malaysian breakfast culture is rich and diverse, reflecting the multicultural heritage of the nation.',
            categories: [
              { name: 'Food Culture', slug: 'food-culture' },
              { name: 'Daily Life', slug: 'daily-life' }
            ],
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            readTime: '4 min read'
          }
        },
        {
          id: 6,
          attributes: {
            title: 'Traditional Malay Cooking Methods',
            slug: 'traditional-malay-cooking-methods',
            hero: {
              title: 'Traditional Malay Cooking Methods',
              bgImage: null
            },
            excerpt: 'Learn about the traditional techniques used in Malay cuisine.',
            content: 'Traditional Malay cooking methods emphasize the use of fresh ingredients, aromatic spices, and time-honored techniques passed down through generations.',
            categories: [
              { name: 'Food Culture', slug: 'food-culture' },
              { name: 'Heritage', slug: 'heritage' }
            ],
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
            readTime: '9 min read'
          }
        },
        {
          id: 7,
          attributes: {
            title: 'Chinese New Year Food Traditions',
            slug: 'chinese-new-year-food-traditions',
            hero: {
              title: 'Chinese New Year Food Traditions',
              bgImage: null
            },
            excerpt: 'Discover the symbolic foods and traditions during Chinese New Year in Malaysia.',
            content: 'Chinese New Year celebrations in Malaysia are filled with symbolic foods that represent prosperity, longevity, and good fortune for the coming year.',
            categories: [
              { name: 'Festivals', slug: 'festivals' },
              { name: 'Food Culture', slug: 'food-culture' }
            ],
            publishedAt: new Date(Date.now() - 518400000).toISOString(),
            readTime: '6 min read'
          }
        },
        {
          id: 8,
            attributes: {
            title: 'Vegan Options in Malaysian Cuisine',
              slug: 'vegan-options-malaysian-cuisine',
              hero: {
                title: 'Vegan Options in Malaysian Cuisine',
                bgImage: null
              },
              excerpt: 'Finding vegan food in Malaysia is easier than you might think.',
              content: 'Malaysian cuisine traditionally uses a lot of plant-based ingredients, making it surprisingly vegan-friendly when you know what to look for.',
              categories: [
                { name: 'Food Culture', slug: 'food-culture' },
                { name: 'Lifestyle', slug: 'lifestyle' }
              ],
              publishedAt: new Date(Date.now() - 604800000).toISOString(),
              readTime: '5 min read'
            }
        }
      ]
    },

    // New tour categories for segmentation
    tourCategories: {
      destinations: [
        {
          name: 'Kuala Lumpur',
          slug: 'kl',
          description: 'Explore the vibrant capital city\'s diverse food scene',
          tourCount: 4,
          image: null
        },
        {
          name: 'Penang',
          slug: 'penang',
          description: 'UNESCO heritage sites and Peranakan cuisine',
          tourCount: 1,
          image: null
        },
        {
          name: 'Malacca',
          slug: 'malacca',
          description: 'Historical colonial architecture and local delicacies',
          tourCount: 1,
          image: null
        },
        {
          name: 'East Malaysia',
          slug: 'east-malaysia',
          description: 'Seafood specialties and Borneo cuisine',
          tourCount: 1,
          image: null
        }
      ],
      dietary: [
        {
          name: 'Vegetarian',
          slug: 'vegetarian',
          description: 'Plant-based Malaysian cuisine and vegetarian options',
          tourCount: 2,
          image: null
        },
        {
          name: 'Vegan',
          slug: 'vegan',
          description: 'Purely plant-based Malaysian dishes',
          tourCount: 1,
          image: null
        },
        {
          name: 'Non-Vegetarian',
          slug: 'non-vegetarian',
          description: 'Traditional meat and seafood dishes',
          tourCount: 2,
          image: null
        },
        {
          name: 'Halal Certified',
          slug: 'halal-certified',
          description: 'Halal-compliant dining experiences',
          tourCount: 2,
          image: null
        }
      ],
      groups: [
        {
          name: 'Family Friendly',
          slug: 'family-friendly',
          description: 'Suitable for families with children',
          tourCount: 4,
          image: null
        },
        {
          name: 'Couples',
          slug: 'couples',
          description: 'Romantic dining experiences for two',
          tourCount: 3,
          image: null
        },
        {
          name: 'Solo Travelers',
          slug: 'solo-travelers',
          description: 'Perfect for individual food exploration',
          tourCount: 1,
          image: null
        },
        {
          name: 'Corporate Teams',
          slug: 'corporate-teams',
          description: 'Team building and group dining experiences',
          tourCount: 2,
          image: null
        }
      ],
      types: [
        {
          name: 'Street Food',
          slug: 'street-food',
          description: 'Authentic hawker stall and market food experiences',
          tourCount: 2,
          image: null
        },
        {
          name: 'Heritage',
          slug: 'heritage',
          description: 'Cultural and historical food traditions',
          tourCount: 2,
          image: null
        },
        {
          name: 'Fine Dining',
          slug: 'fine-dining',
          description: 'Upscale restaurant experiences',
          tourCount: 1,
          image: null
        },
        {
          name: 'Team Building',
          slug: 'team-building',
          description: 'Interactive food experiences for groups',
          tourCount: 1,
          image: null
        },
        {
          name: 'Seafood',
          slug: 'seafood',
          description: 'Fresh seafood and ocean cuisine',
          tourCount: 1,
          image: null
        }
      ]
    },

    // Story categories
    storyCategories: [
      {
        name: 'Food Culture',
        slug: 'food-culture',
        description: 'Exploring Malaysian food traditions and culture',
        storyCount: 8,
        color: '#ff6b35',
        icon: '🍜'
      },
      {
        name: 'Festivals',
        slug: 'festivals',
        description: 'Celebratory foods and festival traditions',
        storyCount: 2,
        color: '#4ecdc4',
        icon: '🎉'
      },
      {
        name: 'Restaurant Reviews',
        slug: 'restaurant-reviews',
        description: 'Reviews of restaurants and dining experiences',
        storyCount: 1,
        color: '#45b7d1',
        icon: '🍽️'
      },
      {
        name: 'Travel Guides',
        slug: 'travel-guides',
        description: 'Food travel guides and recommendations',
        storyCount: 2,
        color: '#96ceb4',
        icon: '🗺️'
      },
      {
        name: 'Heritage',
        slug: 'heritage',
        description: 'Historical and traditional food practices',
        storyCount: 2,
        color: '#dda0dd',
        icon: '🏛️'
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Food-related lifestyle content',
        storyCount: 1,
        color: '#f4d03f',
        icon: '🌿'
      }
    ]
  };

  // Update mock API files
  const apiDir = path.join(__dirname, '..', 'public', 'api');

  fs.writeFileSync(
    path.join(apiDir, 'home-pages.json'),
    JSON.stringify(enhancedMockData.homePage, null, 2)
  );

  fs.writeFileSync(
    path.join(apiDir, 'tours.json'),
    JSON.stringify(enhancedMockData.tours, null, 2)
  );

  fs.writeFileSync(
    path.join(apiDir, 'stories.json'),
    JSON.stringify(enhancedMockData.stories, null, 2)
  );

  // Add new category endpoints
  fs.writeFileSync(
    path.join(apiDir, 'tour-categories.json'),
    JSON.stringify({ data: enhancedMockData.tourCategories }, null, 2)
  );

  fs.writeFileSync(
    path.join(apiDir, 'story-categories.json'),
    JSON.stringify({ data: enhancedMockData.storyCategories }, null, 2)
  );

  console.log('✅ Enhanced mock API created: /api/home-pages.json');
  console.log('✅ Enhanced mock API created: /api/tours.json');
  console.log('✅ Enhanced mock API created: /api/stories.json');
  console.log('✅ New category API created: /api/tour-categories.json');
  console.log('✅ New category API created: /api/story-categories.json');

  console.log('');
  console.log('🎉 Enhanced mock data creation completed!');
  console.log('');
  console.log('📊 Enhanced data structure:');
  console.log(`- Tours: ${enhancedMockData.tours.data.length} entries with tags`);
  console.log(`- Stories: ${enhancedMockData.stories.data.length} entries with categories`);
  console.log(`- Tour categories: ${Object.keys(enhancedMockData.tourCategories).length} categories`);
  console.log(`- Story categories: ${enhancedMockData.storyCategories.length} categories`);
  console.log('');
  console.log('🔧 Ready for frontend development of new content architecture!');

} catch (error) {
  console.error('❌ Error creating enhanced mock data:', error.message);
}