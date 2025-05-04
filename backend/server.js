const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Load environment variables
dotenv.config();
console.log('Environment loaded, MongoDB URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI missing');

// Connect to MongoDB
try {
  connectDB();
  console.log('Database connection initiated');
} catch (error) {
  console.error('Failed to connect to database:', error);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/matches', matchRoutes);

// API Root route
app.get('/api', (req, res) => {
  res.send('Esports Tournament Management API is running...');
});

// Serve React frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
