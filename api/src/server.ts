// server.ts
import express from 'express';
import { connectToMongoDB, getPocketMortyCollection } from './mongo'; // Updated import
const cors = require('cors');
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Establish connection to MongoDB
connectToMongoDB();

app.get('/', (req, res) => {
    res.send('Hello from Express and TypeScript!');
});

app.get('/pocketmorties', async (req, res) => {
    try {
        const collection = getPocketMortyCollection();
        const pocketMorties = await collection.find({}).limit(12).toArray();
        const count = await collection.countDocuments();
        console.log("|-o-| Number of PocketMorties:", count);
        console.log("|-o-| First 12 PocketMorties:", pocketMorties);
        res.json(pocketMorties);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from MongoDB');
    }
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
