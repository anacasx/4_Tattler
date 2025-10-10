// Import required modules
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let restaurantsCollection;

// ================== DATABASE CONNECTION ==================
// Connect to MongoDB when the route file is loaded
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('tattler');
    restaurantsCollection = db.collection('restaurants');
    console.log('Connected to MongoDB (routes)');
  } catch (error) {
    console.error('MongoDB connection error (routes):', error);
  }
}

connectDB();

// ================== ROUTES ==================

// GET /restaurants → Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await restaurantsCollection.find().toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET /restaurants/:id → Get a single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// POST /restaurants → Add a new restaurant
router.post('/', async (req, res) => {
  try {
    const { name, cuisine, location, rating } = req.body;

    // Validate required fields
    if (!name || !cuisine || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new restaurant object
    const newRestaurant = { name, cuisine, location, rating: parseFloat(rating) || 0, comments: [] };

    // Insert into collection
    const result = await restaurantsCollection.insertOne(newRestaurant);
    res.status(201).json({ id: result.insertedId, ...newRestaurant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// POST /restaurants/:id/reviews → Add a review to a restaurant
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, comment } = req.body;

    // Validate required fields
    if (!userId || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create review object
    const review = { userId, comment, date: new Date() };

    // Add review to restaurant's comments array
    const result = await restaurantsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: review } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// PUT /restaurants/:id → Update a restaurant
router.put('/:id', async (req, res) => {
  try {
    const { name, cuisine, location, rating } = req.body;

    // Prepare fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (cuisine) updateFields.cuisine = cuisine;
    if (location) updateFields.location = location;
    if (rating) updateFields.rating = parseFloat(rating);

    // Update restaurant in collection
    const result = await restaurantsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

// DELETE /restaurants/:id → Delete a restaurant
router.delete('/:id', async (req, res) => {
  try {
    const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

// Export the router to be used in main server file
module.exports = router;
