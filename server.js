// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware: allows the server to parse JSON request bodies
app.use(express.json());

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Create a new MongoDB client instance
const client = new MongoClient(uri);

// Asynchronous function to connect to MongoDB
async function connectDB() {
  try {
    // Attempt to connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log an error if the connection fails
    console.error('MongoDB connection error:', error);
  }
}

// Call the connection function
connectDB();

// Select the database and collection
const db = client.db('tattler');
const restaurantsCollection = db.collection('restaurants');

// Import restaurant routes
const restaurantRoutes = require('./api/routes/restaurants');

// Use the restaurant routes under the '/restaurants' path
app.use('/restaurants', restaurantRoutes);

// Test route to check if the API is running
app.get('/', (req, res) => {
  res.send('API running');
});

// Start the server on the port defined in the .env file
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
