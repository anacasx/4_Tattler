// server.js (o app.js)
const express = require('express');
const { MongoClient } = require('mongodb');
const { router: restaurantsRouter, setRestaurantsCollection } = require('./api/routes/restaurants');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'tattler';
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

async function start() {
  await client.connect();
  const db = client.db(dbName);
  const restaurantsCollection = db.collection('restaurants');

  // Inyecta la colección en el router
  setRestaurantsCollection(restaurantsCollection);

  app.use('/restaurants', restaurantsRouter);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
