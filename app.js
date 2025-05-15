/**
 * Express.js AI Search with Azure OpenAI and Azure AI Search on Azure App Service
 * Main application file
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { validateEnvironment } = require('./src/utils/validation');

// Validate environment variables
validateEnvironment();

// Import routes
const chatRoutes = require('./src/routes/chatRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/chat', chatRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle rate limit errors specially
  if (err.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: err.message,
      retryAfter: err.retryAfter || 5
    });
  }
  
  // Handle other types of errors
  res.status(500).json({ 
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
