"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const mongo_1 = require("./mongo"); // Ensure this import is correct
const app = (0, express_1.default)();
const PORT = 4000;
// Use express.json() to parse JSON payloads
app.use(cors());
app.use(express_1.default.json());
// Establish connection to MongoDB before starting the server
(0, mongo_1.connectDB)().then(() => {
    console.log('Connected to MongoDB');
    // Define RESTful endpoints
    // Define RESTful endpoints
    app.get('/sorted-morties', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'baseatk';
            const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '3';
            const after = typeof req.query.after === 'string' ? req.query.after : undefined;
            const limit = parseInt(limitStr, 10);
            if (isNaN(limit)) {
                return res.status(400).send('Invalid limit value');
            }
            const data = yield (0, mongo_1.fetchSortedAndPaginatedData)('pocketMorties', sortBy, limit, after);
            res.json(data);
        }
        catch (error) {
            console.error('Error fetching sorted Morties:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
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
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
