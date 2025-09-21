const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

var planetModel = mongoose.model('planets', dataSchema);

// Test data for planets (the same data the tests expect)
const testPlanets = [
    { id: 1, name: 'Mercury', description: 'Closest planet to the Sun', image: 'mercury.png', velocity: '47.87 km/s', distance: '57.9 million km' },
    { id: 2, name: 'Venus', description: 'Second planet from the Sun', image: 'venus.png', velocity: '35.02 km/s', distance: '108.2 million km' },
    { id: 3, name: 'Earth', description: 'Our home planet', image: 'earth.png', velocity: '29.78 km/s', distance: '149.6 million km' },
    { id: 4, name: 'Mars', description: 'The red planet', image: 'mars.png', velocity: '24.07 km/s', distance: '227.9 million km' },
    { id: 5, name: 'Jupiter', description: 'Largest planet in our solar system', image: 'jupiter.png', velocity: '13.07 km/s', distance: '778.5 million km' },
    { id: 6, name: 'Saturn', description: 'Known for its prominent rings', image: 'saturn.png', velocity: '9.69 km/s', distance: '1.432 billion km' },
    { id: 7, name: 'Uranus', description: 'An ice giant planet', image: 'uranus.png', velocity: '6.81 km/s', distance: '2.867 billion km' },
    { id: 8, name: 'Neptune', description: 'The windiest planet', image: 'neptune.png', velocity: '5.43 km/s', distance: '4.515 billion km' }
];

async function setupAtlasData() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        
        // Check existing data
        const existingPlanets = await planetModel.find({});
        console.log('Existing planets in database:', existingPlanets.length);
        
        if (existingPlanets.length > 0) {
            console.log('Existing planet IDs:', existingPlanets.map(p => `${p.id}: ${p.name}`));
        }
        
        // Check if we need to add test data
        const missingPlanets = [];
        for (let i = 1; i <= 8; i++) {
            const exists = existingPlanets.find(p => p.id === i);
            if (!exists) {
                const planetToAdd = testPlanets.find(p => p.id === i);
                if (planetToAdd) {
                    missingPlanets.push(planetToAdd);
                }
            }
        }
        
        if (missingPlanets.length > 0) {
            console.log('Adding missing planets:', missingPlanets.map(p => `${p.id}: ${p.name}`));
            await planetModel.insertMany(missingPlanets);
            console.log('Missing planets added successfully');
        } else {
            console.log('All required planets already exist in database');
        }
        
        // Verify final state
        const finalPlanets = await planetModel.find({}).sort({id: 1});
        console.log('Final planet list:');
        finalPlanets.forEach(p => {
            console.log(`  ${p.id}: ${p.name}`);
        });
        
        console.log('Setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up Atlas data:', error);
        process.exit(1);
    }
}

setupAtlasData();
