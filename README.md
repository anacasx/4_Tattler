# Tattler Restaurant Directory
A platform to provide personalized restaurant recommendations using MongoDB to store data in a schema with address, cuisine, grades, and comments, and Express.js for a RESTful API.

## Installation
1. Clone the repository: `git clone https://github.com/anacasx/4_Tattler.git`
2. Install dependencies: `npm install`
3. Set up MongoDB (local or Atlas) and update `.env` with your connection string.
4. Run the server: `npm start`

## Repository Structure
```bash
tattler-api/
├── api/
│   ├── routes/
│   │   └── restaurants.js
├── data/
│   ├── backup/ (from Sprint 1)
│   │   └── restaurants.bson
├── scripts/
│   └── import.js (from Sprint 1)
├── tests/
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
└── peer_review.md
```

## Version
Current version: 1.2.2 
