// /api/routes/restaurants.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Asumimos que restaurantsCollection se inyecta al iniciar el servidor.
// Si tu proyecto obtiene la colección de otra forma, adapta la referencia.
let restaurantsCollection;

// Función para inyectar la colección desde donde montes las rutas (server.js/app.js)
function setRestaurantsCollection(collection) {
  restaurantsCollection = collection;
}

/**
 * GET /restaurants
 * Obtener todos los restaurantes con opcional sorting:
 * ?sort=name|rating&order=asc|desc
 */
router.get('/', async (req, res) => {
  try {
    const sortField = req.query.sort || 'name';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const validSortFields = ['name', 'rating'];

    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    const restaurants = await restaurantsCollection
      .find()
      .sort({ [sortField]: sortOrder })
      .toArray();

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

/**
 * GET /restaurants/search?q=term
 * Búsqueda por name o cuisine (case-insensitive, partial match)
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const regex = { $regex: query, $options: 'i' };
    const restaurants = await restaurantsCollection.find({
      $or: [
        { name: regex },
        { cuisine: regex }
      ]
    }).toArray();

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
});

/**
 * GET /restaurants/filter?city=...&rating=...
 * Filtra por city (location.city) y/o rating mínimo
 */
router.get('/filter', async (req, res) => {
  try {
    const { city, rating } = req.query;
    const query = {};

    if (city && city.trim()) {
      query['location.city'] = { $regex: city, $options: 'i' }; // case-insensitive
    }
    if (rating && !Number.isNaN(parseFloat(rating))) {
      query.rating = { $gte: parseFloat(rating) };
    }

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

module.exports = { router, setRestaurantsCollection };
