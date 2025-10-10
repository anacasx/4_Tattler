const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let restaurantsCollection;

// Conectamos a MongoDB al cargar la ruta
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('tattlerDB');
    restaurantsCollection = db.collection('restaurants');
    console.log('✅ Connected to MongoDB (routes)');
  } catch (error) {
    console.error('❌ MongoDB connection error (routes):', error);
  }
}

connectDB();

// ================== RUTAS ==================

// GET /restaurants → todos los restaurantes
router.get('/', async (req, res) => {
  try {
    const restaurants = await restaurantsCollection.find().toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET /restaurants/:id → restaurante por ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// POST /restaurants → agregar nuevo restaurante
router.post('/', async (req, res) => {
  try {
    const { name, cuisine, location, rating } = req.body;
    if (!name || !cuisine || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newRestaurant = { name, cuisine, location, rating: parseFloat(rating) || 0, comments: [] };
    const result = await restaurantsCollection.insertOne(newRestaurant);
    res.status(201).json({ id: result.insertedId, ...newRestaurant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// POST /restaurants/:id/reviews → agregar review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, comment } = req.body;
    if (!userId || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const review = { userId, comment, date: new Date() };
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

// PUT /restaurants/:id → actualizar restaurante
router.put('/:id', async (req, res) => {
  try {
    const { name, cuisine, location, rating } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (cuisine) updateFields.cuisine = cuisine;
    if (location) updateFields.location = location;
    if (rating) updateFields.rating = parseFloat(rating);

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

// DELETE /restaurants/:id → eliminar restaurante
router.delete('/:id', async (req, res) => {
  try {
    const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

module.exports = router;
