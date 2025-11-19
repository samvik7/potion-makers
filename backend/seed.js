import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import Recipe from './models/Recipe.js';

dotenv.config({ path: './backend/.env' });

const items = [
  // --- Basic Ingredients ---
  { name: 'Water Vial', type: 'Ingredient', description: 'A vial of clean water.', basePrice: 5, image: 'Potion02_GlassVile.png' },
  { name: 'Herb', type: 'Ingredient', description: 'A herb with magical properties.', basePrice: 10, image: 'Potion03_Herb.png' },
  { name: 'Crystal', type: 'Ingredient', description: 'A quartz crystal.', basePrice: 15, image: 'Potion04_Crystal.png' },
  { name: 'Spider Silk', type: 'Ingredient', description: 'A sticky resilient fiber.', basePrice: 12, image: 'Potion05_Silk.png' },
  { name: 'Roots', type: 'Ingredient', description: 'Earthy roots.', basePrice: 8, image: 'Potion01_Roots.png' },

  // --- Uncommon Ingredients ---
  { name: 'Fire Flower', type: 'Ingredient', description: 'A flower that is warm to the touch.', basePrice: 30, image: 'Potion09_FireFlower.png' },
  { name: 'Glow Flower', type: 'Ingredient', description: 'A flower that glows in the dark.', basePrice: 45, image: 'Potion10_GlowFlower.png' },
  { name: 'Bat Wing', type: 'Ingredient', description: 'The wing of a cave-dwelling bat.', basePrice: 25, image: 'Potion08_Bat Wing.png' }, // Note the space in filename
  { name: 'Slime', type: 'Ingredient', description: 'A gelatinous blob.', basePrice: 20, image: 'Potion06_Slime.png' },
  { name: 'Iron Ore', type: 'Ingredient', description: 'A heavy, metallic rock.', basePrice: 35, image: 'Potion07_Ore.png' },

  // --- Rare Ingredients ---
  { name: 'Dragon Scale', type: 'Ingredient', description: 'A scale shimmering with power.', basePrice: 250, image: 'Potion11_DragonScales.png' },
  { name: 'Griffin Feather', type: 'Ingredient', description: 'A large feather.', basePrice: 200, image: 'Potion12_GriffinFeather.png' },
  { name: 'Sun Stone', type: 'Ingredient', description: 'A crystal that shines with light.', basePrice: 180, image: 'Potion13_SunStone.png' },

  // --- Potions ---
  { name: 'Small Health Potion', type: 'Potion', description: 'Restores a small amount of health.', basePrice: 50, image: 'Potion14_SmallHealth.png' },
  { name: 'Focus Potion', type: 'Potion', description: 'Improves focus.', basePrice: 75, image: 'Potion15_Focus.png' },
  { name: 'Sticky Paste', type: 'Potion', description: 'Used to bind things.', basePrice: 40, image: 'Potion16_StickyPaste.png' },
  { name: 'Sludge (Failed Potion)', type: 'Potion', description: 'A failed experiment.', basePrice: 1, image: 'Potion17_Slodge.png' }, 
  { name: 'Night Vision Potion', type: 'Potion', description: 'See in darkness.', basePrice: 150, image: 'Potion18_NightVision.png' },
  { name: 'Strength Potion', type: 'Potion', description: 'Enhances physical strength.', basePrice: 120, image: 'Potion19_Strength.png' },
  { name: 'Acid Vial', type: 'Potion', description: 'Dissolves metals.', basePrice: 100, image: 'Potion20_Acid.png' },
  { name: 'Large Health Potion', type: 'Potion', description: 'Restores a large amount of health.', basePrice: 200, image: 'Potion21_LargeHealth.png' },
  { name: 'Life Elixir', type: 'Potion', description: 'Brings one back from the brink.', basePrice: 1000, image: 'Potion22_Life.png' },
  { name: 'Flight Potion', type: 'Potion', description: 'Grants flight.', basePrice: 850, image: 'Potion23_Flight.png' },
];

const recipeDefinitions = [
    { name: 'Small Health Potion', result: 'Small Health Potion', ingredients: ['Water Vial', 'Herb'] },
    { name: 'Focus Potion', result: 'Focus Potion', ingredients: ['Water Vial', 'Crystal'] },
    { name: 'Sticky Paste', result: 'Sticky Paste', ingredients: ['Roots', 'Spider Silk'] },
    { name: 'Sludge (Failed Potion)', result: 'Sludge (Failed Potion)', ingredients: ['Water Vial', 'Roots'] },
    
    { name: 'Strength Potion', result: 'Strength Potion', ingredients: ['Iron Ore', 'Roots'] },
    { name: 'Night Vision Potion', result: 'Night Vision Potion', ingredients: ['Glow Flower', 'Bat Wing'] },
    { name: 'Acid Vial', result: 'Acid Vial', ingredients: ['Slime', 'Fire Flower'] },
    
    { name: 'Large Health Potion', result: 'Large Health Potion', ingredients: ['Small Health Potion', 'Glow Flower'] },
    
    { name: 'Life Elixir', result: 'Life Elixir', ingredients: ['Dragon Scale', 'Large Health Potion'] },
    { name: 'Flight Potion', result: 'Flight Potion', ingredients: ['Griffin Feather', 'Sun Stone'] },
];

const seedDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found!');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    await Item.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Existing data cleared.');

    const createdItems = await Item.insertMany(items);
    console.log('Items added.');

    const itemMap = {};
    createdItems.forEach(item => {
        itemMap[item.name] = item._id;
    });

    const recipes = recipeDefinitions.map(def => {
        const ingredients = def.ingredients.map(name => {
            if (!itemMap[name]) console.error(`❌ Error: Ingredient '${name}' not found!`);
            return {
                item: itemMap[name],
                quantity: 1
            };
        });

        const signature = ingredients.map(i => `${i.item}:${i.quantity}`).sort().join('|');

        return {
            name: def.name,
            ingredients: ingredients,
            resultItem: itemMap[def.result],
            signature: signature,
            chance: 1,
            sellValue: 0 
        };
    });

    await Recipe.insertMany(recipes);
    console.log('Recipes added.');

    console.log('✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedDB();
