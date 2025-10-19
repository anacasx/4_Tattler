const { MongoClient } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tattler';
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    const db = client.db('tattler');
    const collection = db.collection('restaurants');
    
    // Clear existing data (optional, comment out if you want to append)
    await collection.deleteMany({});
    
    const restaurants = [];

    fs.createReadStream('data/restaurants.csv')
      .pipe(csv())
      .on('data', (row) => {
        restaurants.push({
          name: row.name,
          borough: row.borough,
          cuisine: row.cuisine,
          location: {
            street: row.street,
            building: row.building,
            zipcode: row.zipcode,
            coordinates: [parseFloat(row.coord_longitude), parseFloat(row.coord_latitude)]
          },
          grades: [
            { date: new Date(row.grade1_date), score: parseInt(row.grade1_score) },
            { date: new Date(row.grade2_date), score: parseInt(row.grade2_score) }
          ],
          comments: [{ comment: row.comment }]
        });
      })
      .on('end', async () => {
        await collection.insertMany(restaurants);
        console.log('Data imported successfully');
        await client.close();
      });
  } catch (error) {
    console.error('Import error:', error);
  }
}

importData();