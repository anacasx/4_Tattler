# Tattler Restaurant Directory
A platform to provide personalized restaurant recommendations using MongoDB to store data in a schema with address, cuisine, grades, and comments, and Express.js for a RESTful API.

## Installation
1. Clone the repository: `git clone https://github.com/anacasx/4_Tattler.git`
2. Install dependencies: `npm install`
3. Set up MongoDB (local or Atlas) and update `.env` with your connection string.
4. Run the server: `npm start`

## Repository Structure
```bash
4_Tattler/
├── api/
│   ├── routes/
│   │   └── restaurants.js
├── data/
│   ├── backup/ (from Sprint 1)
│   │   └── restaurants.bson
├── scripts/
│   └── import.js (from Sprint 1)
├── tests/
│   ├── delete.png
│   ├── get_all.png
│   ├── get_borough.png
│   ├── get_cuisine.png
│   └── get_fieldValidation.png
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
└── peer_review.md
```

## API Endpoints
### Sprint 3
- GET /restaurants/search?q=query: Search restaurants by name or cuisine.
- GET /restaurants/filter?city=CityName&rating=4: Filter by city and minimum rating.
- GET /restaurants?sort=rating: Sort restaurants by rating or name.

## Version
- 1.2.0 (Sprint 3): Added search, filtering, and sorting endpoints.
- 1.1.0 (Sprint 2): Implemented RESTful API with CRUD endpoints.
- 1.0.0 (Sprint 1): Initial database setup and data import.
