# IndieGamer Hub

A community and discovery platform for indie games. Built with React, Node.js, Express, and MongoDB.

## Project Structure

```
indiegamer-hub/
├── backend/
│   ├── models/          # User, Game, Review, Thread
│   ├── routes/          # auth, games, reviews, forum, admin
│   ├── services/
│   │   └── steamApi.js  # Steam Storefront + RAWG API integration
│   ├── middleware/
│   │   └── auth.js      # JWT protect + requireRole
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── common/        # Navbar
        │   ├── game/          # GameCard, ScreenshotGallery
        │   ├── review/        # ReviewSection
        │   ├── forum/         # ForumSection
        │   └── admin/
        ├── pages/             # Home, Browse, GameDetail, SubmitGame, Admin, Login, Register
        ├── context/           # AuthContext
        ├── hooks/             # useGames, useTrending
        └── styles/            # global.css (Roboto + Press Start 2P)
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Add your keys
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/indiegamer-hub
JWT_SECRET=your_secret
RAWG_API_KEY=get from rawg.io/apiv2
STEAM_API_KEY=get from steamcommunity.com/dev/apikey
```

## Tech Stack
- **Frontend**: React 18, React Router v6, React Player, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer
- **APIs**: Steam Storefront API, RAWG.io API
- **Fonts**: Google Fonts — Roboto + Press Start 2P

## Features by Phase
- **Phase 1**: Game schema, Steam API auto-fill, image upload
- **Phase 2**: Review system with aggregation-based rating, forum (Game→Thread→Posts)
- **Phase 3**: Dark-mode UI, screenshot gallery, React Player trailer embed, trending algorithm (most reviews in 7 days)
- **Phase 4**: Admin panel with isFeatured toggle, affiliate store links (Steam/Itch/Epic)
