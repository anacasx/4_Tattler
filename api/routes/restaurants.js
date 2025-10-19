// Import required modules
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let restaurantsCollection;

// Connect to MongoDB when the route file is loaded
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('tattler');
    restaurantsCollection = db.collection('restaurants');
    console.log('Connected to MongoDB (routes)');
  } catch (error) {
    console.error('MongoDB connection error (routes):', error);
    process.exit(1);
  }
}

connectDB();

// GET /restaurants → Get all restaurants with optional sorting
router.get('/', async (req, res) => {
  try {
    const sortField = req.query.sort || null;
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const validSortFields = ['name', 'grades.0.score'];

    let query = restaurantsCollection.find();

    if (sortField) {
      if (!validSortFields.includes(sortField)) {
        return res.status(400).json({ error: 'Invalid sort field' });
      }
      query = query.sort({ [sortField]: sortOrder });
    }

    const restaurants = await query.toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET /restaurants/search → Search restaurants by name or cuisine
router.get('/search', async (req, res) => {
  try {
    console.log('Search request received with query:', req.query.q); // Debug log
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const restaurants = await restaurantsCollection.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { cuisine: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
});

// GET /restaurants/filter → Filter restaurants by borough and/or minimum rating
router.get('/filter', async (req, res) => {
  try {
    console.log('Filter request received with params:', req.query); // Debug log
    const { city, rating } = req.query;
    const query = {};
    if (city) query.borough = { $regex: city, $options: 'i' };
    if (rating) query['grades.0.score'] = { $gte: parseFloat(rating) };
    if (!city && !rating) {
      return res.status(400).json({ error: 'At least one filter (city or rating) is required' });
    }
    const restaurants = await restaurantsCollection.find(query).toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error filtering restaurants:', error);
    res.status(500).json({ error: 'Failed to filter restaurants' });
  }
});

// GET /restaurants/:id → Get a single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching restaurant with ID:', req.params.id); // Debug log
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// POST /restaurants → Add a new restaurant
router.post('/', async (req, res) => {
  try {
    const { name, cuisine, borough, street, building, zipcode, coord_longitude, coord_latitude } = req.body;

    // Validate required fields
    if (!name || !cuisine || !borough || !street || !building || !zipcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new restaurant object
    const newRestaurant = {
      name,
      cuisine,
      borough,
      location: {
        street,
        building,
        zipcode,
        coordinates: [parseFloat(coord_longitude) || 0, parseFloat(coord_latitude) || 0]
      },
      grades: [],
      comments: []
    };

    // Insert into collection
    const result = await restaurantsCollection.insertOne(newRestaurant);
    res.status(201).json({ id: result.insertedId, ...newRestaurant });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// POST /restaurants/:id/reviews → Add a review to a restaurant
router.post('/:id/reviews', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
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
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// PUT /restaurants/:id → Update a restaurant
router.post('/:id/reviews', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
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
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// DELETE /restaurants/:id → Delete a restaurant
router.delete('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

// Export the router to be used in main server file
module.exports = router;