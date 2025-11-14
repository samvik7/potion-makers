import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js'; 

dotenv.config({ path: './backend/.env' }); 

const items = [
  // Basic Ingredients
  { name: 'Water Vial', type: 'Ingredient', description: 'A vial of clean water.', basePrice: 5 },
  { name: 'Herb', type: 'Ingredient', description: 'A herb with magical properties.', basePrice: 10 },
  { name: 'Crystal', type: 'Ingredient', description: 'A quartz crystal.', basePrice: 15 },
  { name: 'Spider Silk', type: 'Ingredient', description: 'A sticky resilient fiber.', basePrice: 12 },
  { name: 'Roots', type: 'Ingredient', description: 'Earthy roots used for creating salves and pastes.', basePrice: 8 },

  // Uncommon Ingredients
  { name: 'Fire Flower', type: 'Ingredient', description: 'A flower that is warm to the touch.', basePrice: 30 },
  { name: 'Glow Flower', type: 'Ingredient', description: 'A flower that glows in the dark.', basePrice: 45 },
  { name: 'Bat Wing', type: 'Ingredient', description: 'The wing of a cave-dwelling bat.', basePrice: 25 },
  { name: 'Slime', type: 'Ingredient', description: 'A gelatinous blob.', basePrice: 20 },
  { name: 'Iron Ore', type: 'Ingredient', description: 'A heavy, metallic rock.', basePrice: 35 },

  // Rare Ingredients
  { name: 'Dragon Scale', type: 'Ingredient', description: 'A scale shimmering with power.', basePrice: 250 },
  { name: 'Griffin Feather', type: 'Ingredient', description: 'A large feather.', basePrice: 200 },
  { name: 'Sun Stone', type: 'Ingredient', description: 'A crystal that shines with the captured light of the sun.', basePrice: 180 },

  // Potions & Items
  { name: 'Small Health Potion', type: 'Potion', description: 'Restores a small amount of health.', basePrice: 50 },
  { name: 'Focus Potion', type: 'Potion', description: 'Improves focus for a short time.', basePrice: 75 },
  { name: 'Sticky Paste', type: 'Potion', description: 'Used to bind things together.', basePrice: 40 },
  { name: 'Sludge (Failed Potion)', type: 'Potion', description: 'A failed experiment.', basePrice: 1 },
  { name: 'Night Vision Potion', type: 'Potion', description: 'Grants the ability to see in darkness.', basePrice: 150 },
  { name: 'Strength Potion', type: 'Potion', description: 'Temporarily enhances physical strength.', basePrice: 120 },
  { name: 'Acid Vial', type: 'Potion', description: 'A concoction that can dissolve metals.', basePrice: 100 },
  { name: 'Large Health Potion', type: 'Potion', description: 'Restores a large amount of health.', basePrice: 200 },
  { name: 'Life Elixir', type: 'Potion', description: 'Able to bring one back from the brink of death.', basePrice: 1000 },
  { name: 'Flight Potion', type: 'Potion', description: 'Grants the ability to fly for a limited time.', basePrice: 850 },
];

const seedDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found! Make sure your .env file is set up correctly in the /backend folder.');
    process.exit(1);
  }

  let connection;
  try {
    //Store the connection object 
    connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Delete existing data
    await Item.deleteMany({});
    console.log('Existing items cleared.');

    // Insert new data
    await Item.insertMany(items);
    console.log('Full list of starter items and potions has been added!');
    
    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);

  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('MongoDB connection closed.');
    }
  }
};

seedDB();
