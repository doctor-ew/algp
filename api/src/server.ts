// /src/server.ts

import express from 'express';
import mongoose from 'mongoose';
const cors = require('cors');
import dotenv from 'dotenv';
import PocketMorty from './mongo'; // Update the path accordingly
// Load environment variables
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 4000; // Use port from environment or default to 4000

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/pocketMorties')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello from Express and TypeScript!');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/pocketmorties', async (req, res) => {
    try {
        const pocketMorties = await PocketMorty.find().limit(12);
        res.json(pocketMorties);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from MongoDB');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
