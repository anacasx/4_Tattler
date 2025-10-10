const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'tattler';

async function importRestaurants() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('restaurants');
    const results = [];

    fs.createReadStream('../data/restaurants.csv')
      .pipe(csv())
      .on('data', (data) => {
        try {
          // Parse grades safely
          const grades = data.grades ? JSON.parse(data.grades).map(grade => ({
            date: grade.date ? new Date(grade.date) : null,
            score: grade.score ? parseInt(grade.score) : null
          })) : [];

          // Parse comments safely
          const comments = data.comments ? JSON.parse(data.comments).map(comment => ({
            date: comment.date ? new Date(comment.date) : null,
            comment: comment.comment || '',
            _id: new ObjectId()
          })) : [];

          // Object construction
          results.push({
            restaurant_id: data.restaurant_id || '',
            name: data.name || '',
            cuisine: data.cuisine || '',
            borough: data.borough || '',
            address: {
              building: data.building || '',
              street: data.street || '',
              zipcode: data.zipcode || '',
              coord: [
                data.coord_lon ? parseFloat(data.coord_lon) : 0,
                data.coord_lat ? parseFloat(data.coord_lat) : 0
              ]
            },
            grades,
            comments
          });
        } catch (parseErr) {
          console.error('Error parsing row:', data, parseErr);
        }
      })
      .on('end', async () => {
        try {
          if (results.length > 0) {
            await collection.insertMany(results);
            console.log('Restaurants imported successfully');
          } else {
            console.log('No valid restaurants to import');
          }
        } catch (dbErr) {
          console.error('Error inserting into MongoDB:', dbErr);
        } finally {
          await client.close();
        }
      });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

importRestaurants();
