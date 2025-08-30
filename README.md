# Esports Tournament Management Platform

A comprehensive platform for managing esports tournaments, supporting multiple games, user roles, and tournament formats.

## 🚀 Features

### Common Features
- User authentication (signup/login) with JWT
- Role-based access control (Admin, Organizer, Player)
- Game catalog with tournament listings
- Public pages for tournaments, brackets, and match results
- Image upload support for profiles, games, and tournaments

### Admin Features
- Approve or block organizers
- Monitor all games and tournaments
- View all user accounts
- View tournament statistics

### Organizer Features
- Create and manage tournaments
- Create new games if not listed
- Add/edit match schedules and results
- View participants and filter by game/tournament

### Player Features
- View and filter tournaments by game
- Register for tournaments (solo or team)
- View joined tournaments
- View results and leaderboards

## 💻 Tech Stack

- **Frontend**: React.js with styled-components
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas or local MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## 📦 Project Structure

```
/esports(3)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── organizer/
│   │   │   └── player/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── organizer/
│   │   │   ├── player/
│   │   │   └── public/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── .env
    ├── package.json
    └── server.js
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd esports(3)
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

- Create a `.env` file in the `backend` directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```
- If you want to use a local MongoDB instance, your `MONGODB_URI` might look like:
```
mongodb://localhost:27017/esports_tournament
```
- For MongoDB Atlas, use the connection string provided by your Atlas cluster, replacing username, password, and cluster info accordingly.

### Running the Application

1. Start the backend server
```bash
cd ../backend
npm start
```

2. Start the frontend development server
```bash
cd ../frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Installing MongoDB Locally (Optional)

If you prefer to run MongoDB locally instead of using MongoDB Atlas:

- Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Follow the installation instructions for your OS
- Start the MongoDB server (mongod)
- Use the connection string `mongodb://localhost:27017/esports_tournament` in your `.env` file

## 🎮 Pre-loaded Games

The platform comes with several pre-loaded games:

1. **Valorant**
   - TEC Showdown Cup
   - TEC Elite Valorant Invitational
   - Aim King Arena

2. **BGMI (Battlegrounds Mobile India)**
   - TEC Royale Battle
   - India Squad Clash
   - BGMI Pro Scrims

3. **Free Fire**
   - TEC Firestorm Series
   - South Asia FF Clash
   - Free Fire Street Cup

4. **Call of Duty: Mobile**
   - TEC CODM Open League
   - Ranked Warriors Cup
   - Mobile Combat Masters

5. **Rocket League**
   - Rocket Surge Arena
   - TEC Boost Championship
   - 3v3 Drift League

## 🔐 User Roles

- **Admin**: Manages users, verifies organizers, handles disputes
- **Organizer**: Creates/edits games and tournaments, manages participants
- **Player**: Registers for tournaments, joins matches, views results

## 📝 API Routes

### Authentication Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/status` - Update user status (admin only)

### Game Routes
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games` - Create a new game (organizer only)
- `PUT /api/games/:id` - Update game (organizer only)
- `DELETE /api/games/:id` - Delete game (admin only)
- `GET /api/games/:id/tournaments` - Get tournaments by game ID

### Tournament Routes
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create a new tournament (organizer only)
- `PUT /api/tournaments/:id` - Update tournament (organizer only)
- `DELETE /api/tournaments/:id` - Delete tournament (organizer only)
- `GET /api/tournaments/organizer/mytournaments` - Get organizer's tournaments
- `GET /api/tournaments/admin/stats` - Get tournament statistics (admin only)

### Registration Routes
- `POST /api/registrations` - Register for a tournament
- `GET /api/registrations/myregistrations` - Get user's registrations
- `GET /api/registrations/tournament/:id` - Get tournament registrations (organizer only)
- `PUT /api/registrations/:id` - Update registration status (organizer only)
- `DELETE /api/registrations/:id` - Cancel registration

### Match Routes
- `POST /api/matches` - Create a new match (organizer only)
- `GET /api/matches/tournament/:id` - Get tournament matches
- `GET /api/matches/:id` - Get match by ID
- `PUT /api/matches/:id` - Update match results (organizer only)
- `DELETE /api/matches/:id` - Delete match (organizer only)
- `GET /api/matches/player/mymatches` - Get player's matches

## 📱 Page Routes

- `/login` - Login page
- `/register` - Signup page
- `/dashboard/admin` - Admin dashboard
- `/dashboard/organizer` - Organizer dashboard
- `/dashboard/player` - Player dashboard
- `/games` - List of all games
- `/tournaments/:gameId` - List tournaments for a specific game
- `/tournament/:tournamentId` - View tournament details
- `/register-tournament/:tournamentId` - Register as a participant

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


