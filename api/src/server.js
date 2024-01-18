"use strict";
// /src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors = require('cors');
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
const port = process.env.PORT || 4000; // Use port from environment or default to 4000
// Middlewares
app.use(cors());
app.use(express_1.default.json()); // for parsing application/json
// Connect to MongoDB
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/pocketMorties')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello from Express and TypeScript!');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
