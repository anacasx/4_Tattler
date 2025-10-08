Tattler Restaurant DirectoryProject DescriptionTattler is a nationwide restaurant directory platform designed to provide users with personalized and dynamic culinary experiences. This project transforms Tattler's outdated system by leveraging MongoDB for storing restaurant data in JSON format and developing a RESTful API using Express.js to enable seamless interaction with the database. The platform supports features like adding restaurants, posting reviews, and searching/filtering by criteria such as cuisine, location, or rating. The goal is to enhance user engagement by offering up-to-date and personalized restaurant recommendations.This repository contains the code, scripts, and documentation for the Non-Relational Databases for Storing JSON Data challenge as part of the Digital NAO program.Installation InstructionsPrerequisitesNode.js (v16 or higher)
MongoDB (local installation or MongoDB Atlas)
Git (for cloning the repository)
Postman or Insomnia (for API testing)

SetupClone the Repository:bash

git clone https://github.com/your-username/tattler-restaurant-directory.git
cd tattler-restaurant-directory

Install Dependencies:bash

npm install

Set Up MongoDB:For local MongoDB:Ensure MongoDB is running on mongodb://localhost:27017.
Create a database named tattlerDB.

For MongoDB Atlas:Create a cluster and obtain the connection string.
Update the .env file with your MongoDB URI:env

MONGODB_URI=your-mongodb-atlas-connection-string

Import Sample Data:Place CSV files (e.g., restaurants.csv) in the /data folder.
Run the import script to populate the MongoDB database:bash

node scripts/importData.js

Start the Server:bash

node server.js

The API will be available at http://localhost:3000.

Usage InstructionsAccess the API endpoints using tools like Postman or Insomnia.
Available endpoints (as of Sprint 3):GET /restaurants: Retrieve all restaurants.
GET /restaurants/:id: Retrieve a specific restaurant by ID.
POST /restaurants: Add a new restaurant.
POST /restaurants/:id/reviews: Add a review to a restaurant.
PUT /restaurants/:id: Update restaurant details.
DELETE /restaurants/:id: Delete a restaurant.
GET /restaurants/search?q=query: Search restaurants by name or cuisine.
GET /restaurants/filter?city=CityName&rating=4: Filter restaurants by city and rating.
GET /restaurants?sort=rating: Sort restaurants by rating or name.

Test the API using the provided Postman/Insomnia screenshots in the /tests folder.
Refer to the /screenshots folder for MongoDB database and collection visuals.

Repository Structure

tattler-restaurant-directory/
├── /api/                    # API source code
│   ├── /routes/             # Express route handlers
│   └── server.js            # Main Express server
├── /data/                   # Database backup files and sample CSV files
├── /scripts/                # Data import scripts (e.g., importData.js)
├── /screenshots/            # Screenshots of MongoDB and API tests
├── /tests/                  # Postman/Insomnia test results
├── .env                     # Environment variables (not tracked)
├── README.md                # Project documentation
└── package.json             # Node.js dependencies and scripts

VersioningThis project follows the XXX Versioning Guidelines:Major (X.0.0): Significant changes (e.g., database schema changes).
Minor (0.X.0): New features (e.g., API endpoints, search functionality).
Patch (0.0.X): Bug fixes or minor updates.

Version History1.0.0: Initial setup with MongoDB database, collections, and CSV import scripts (Sprint 1).
1.1.0: Added RESTful API with CRUD endpoints using Express.js (Sprint 2).
1.2.0: Implemented search and filtering functionality for the API (Sprint 3).
