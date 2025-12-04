const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 1338; // Different from Strapi port

// Middleware
app.use(cors());
app.use(express.json());

// Serve mock API responses
app.get('/api/home-pages', (req, res) => {
  try {
    const mockData = require('../public/api/home-pages.json');
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

app.get('/api/tours', (req, res) => {
  try {
    const mockData = require('../public/api/tours.json');
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

app.get('/api/stories', (req, res) => {
  try {
    const mockData = require('../public/api/stories.json');
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Mock API server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log('');
  console.log('📡 Available endpoints:');
  console.log(`- GET http://localhost:${PORT}/api/home-pages`);
  console.log(`- GET http://localhost:${PORT}/api/tours`);
  console.log(`- GET http://localhost:${PORT}/api/stories`);
  console.log(`- GET http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🔧 Update your frontend .env to use:');
  console.log(`PUBLIC_STRAPI_URL=http://localhost:${PORT}`);
});