const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/Game');
const Tournament = require('./models/Tournament');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample games data
const games = [
  {
    name: 'League of Legends',
    description: 'A popular multiplayer online battle arena (MOBA) game developed by Riot Games.',
    imageUrl: 'https://static.wikia.nocookie.net/leagueoflegends/images/8/86/League_of_legends_logo_transparent.png'
  },
  {
    name: 'Counter-Strike 2',
    description: 'A first-person shooter game developed by Valve Corporation.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'
  },
  {
    name: 'Valorant',
    description: 'A free-to-play first-person tactical shooter developed by Riot Games.',
    imageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f072336e3f3ade4/63096d7be4a8c30e088e7720/Valorant_2022_E5A2_PlayVALORANT_ContentStackThumbnail_1200x625_MB01.png'
  },
  {
    name: 'Dota 2',
    description: 'A multiplayer online battle arena (MOBA) game developed by Valve Corporation.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg'
  }
];

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@esports.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return adminExists;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@esports.com',
      password: hashedPassword,
      role: 'admin',
      username: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created');
    return admin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Seed games
const seedGames = async () => {
  try {
    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared games collection');
    
    // Insert new games
    const createdGames = await Game.insertMany(games);
    console.log(`${createdGames.length} games inserted`);
    return createdGames;
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

// Seed tournaments
const seedTournaments = async (games, admin) => {
  try {
    // Clear existing tournaments
    await Tournament.deleteMany({});
    console.log('Cleared tournaments collection');
    
    // Create tournaments for each game
    const tournaments = [];
    
    for (const game of games) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start in 7 days
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2); // 2-day tournament
      
      tournaments.push({
        name: `${game.name} Championship 2025`,
        gameId: game._id,
        organizerId: admin._id,
        format: 'Single Elimination',
        dates: {
          start: startDate,
          end: endDate
        },
        rules: `# ${game.name} Tournament Rules\n\n1. All matches are best of 3\n2. Finals are best of 5\n3. Standard competitive settings apply`,
        status: 'upcoming',
        registrationOpen: true
      });
    }
    
    const createdTournaments = await Tournament.insertMany(tournaments);
    console.log(`${createdTournaments.length} tournaments inserted`);
  } catch (error) {
    console.error('Error seeding tournaments:', error);
    process.exit(1);
  }
};

// Run the seeding
const seedDatabase = async () => {
  try {
    const admin = await createAdminUser();
    const games = await seedGames();
    await seedTournaments(games, admin);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
