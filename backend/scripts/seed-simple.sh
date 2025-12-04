#!/bin/bash

# Simple seed script using curl and API token
API_TOKEN="***REMOVED***"
BASE_URL="http://localhost:1337/api"

echo "🌱 Starting database seeding..."

# Create home page content
echo "🏠 Creating home page..."
curl -X POST "$BASE_URL/home-pages" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "metaTitle": "Simply Enak – Food Tours and more",
      "heroSection": {
        "title": "Experience Authentic Malaysian Food Tours",
        "subtitle": "Join us on a culinary adventure through Kuala Lumpur and beyond"
      },
      "ourToursSection": {
        "title": "Our Popular Food Tours",
        "subtitle": "Discover the best of Malaysian cuisine with our expert guides",
        "button": {
          "text": "View All Tours",
          "url": "/tours"
        }
      },
      "experienceTodaySection": {
        "title": "Ready for an unforgettable experience?",
        "subtitle": "Book your Malaysian food adventure today",
        "button": {
          "text": "Get Started",
          "url": "/contact"
        }
      },
      "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'"
    }
  }'

# Create about page
echo "📖 Creating about page..."
curl -X POST "$BASE_URL/abouts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "metaTitle": "About Simply Enak",
      "aboutHero": {
        "title": "Your Gateway to Authentic Malaysian Cuisine",
        "subtitle": "We are passionate food lovers dedicated to sharing the best of Malaysian culinary experiences"
      },
      "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'"
    }
  }'

# Create contact page
echo "📞 Creating contact page..."
curl -X POST "$BASE_URL/contacts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "metaTitle": "Contact – Simply Enak",
      "heroSection": {
        "title": "Get in Touch",
        "subtitle": "Ready to embark on a culinary adventure? Contact us to book your food tour"
      },
      "getInTouchSection": {
        "title": "Contact Us",
        "subtitle": "We'\''d love to hear from you",
        "buttonText": "Send Message"
      },
      "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'"
    }
  }'

# Create sample story
echo "📚 Creating sample story..."
curl -X POST "$BASE_URL/stories" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "11 Foods To Try During Hari Raya",
      "slug": "11-foods-to-try-during-hari-raya",
      "metaTitle": "11 Foods To Try During Hari Raya",
      "hero": {
        "title": "11 Foods To Try During Hari Raya",
        "bgImage": null
      },
      "contents": {
        "content": "There\'s nothing in this world like the food you will find in Malaysia during Hari Raya. Don\'t get me wrong, we have amazing food all year round and for special occasions, but the delicacies served during Hari Raya are at the top of most of our tourists\' \"must-have\" lists. Hari Raya marks the end of Ramadan, or the fasting month, for Muslims worldwide, and especially here in Malaysia."
      },
      "categories": [
        {
          "name": "Food Culture",
          "color": "#ff6b35"
        }
      ],
      "author": {
        "name": "Simply Enak Team"
      },
      "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'"
    }
  }'

echo "✅ Database seeding completed!"