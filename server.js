const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json()); // Allows ro read JSON

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}
connectDB();

const db = client.db('tattler');
const restaurantsCollection = db.collection('restaurants');


const restaurantRoutes = require('./api/routes/restaurants');
app.use('/restaurants', restaurantRoutes);



// Test route
app.get('/', (req, res) => {
  res.send('API running 🚀');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
