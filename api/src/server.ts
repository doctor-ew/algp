import express from 'express';
const cors = require('cors');
import { connectDB, fetchSortedAndPaginatedData } from './mongo'; // Ensure this import is correct

const app = express();
const PORT = 4000;

// Use express.json() to parse JSON payloads
app.use(cors());
app.use(express.json());

// Establish connection to MongoDB before starting the server
connectDB().then(() => {
    console.log('Connected to MongoDB');

    // Define RESTful endpoints
    // Define RESTful endpoints
    app.get('/sorted-morties', async (req, res) => {
        try {
            const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'baseatk';
            const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '3';
            const after = typeof req.query.after === 'string' ? req.query.after : undefined;

            const limit = parseInt(limitStr, 10);
            if (isNaN(limit)) {
                return res.status(400).send('Invalid limit value');
            }

            const data = await fetchSortedAndPaginatedData('pocketMorties', sortBy, limit, after);
            res.json(data);
        } catch (error) {
            console.error('Error fetching sorted Morties:', error);
            res.status(500).send('Internal Server Error');
        }
    });

// Additional endpoints can be defined here

// Start the server
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});

// Additional endpoints can be defined here

