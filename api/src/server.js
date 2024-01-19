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
// server.ts
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./mongo"); // Update the import path
const cors = require('cors');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express_1.default.json());
// Establish connection to MongoDB
(0, mongo_1.connectToMongoDB)();
app.get('/', (req, res) => {
    res.send('Hello from Express and TypeScript!');
});
app.get('/pocketmorties', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pocketMorties = yield mongo_1.PocketMorty.find().limit(12);
        const count = yield mongo_1.PocketMorty.countDocuments(); // Await the count
        console.log("|-o-| Number of PocketMorties:", count);
        console.log("|-o-| First 12 PocketMorties:", pocketMorties);
        res.json(pocketMorties);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from MongoDB');
    }
}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
