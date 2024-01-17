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
const apollo_server_express_1 = require("apollo-server-express");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const resolvers_1 = __importDefault(require("./graphql/rickmorty/resolvers"));
const mongo_1 = require("./mongo"); // Ensure this import is correct
const app = (0, express_1.default)();
const PORT = 4000;
// Use express.json() to parse JSON payloads
app.use(cors());
app.use(express_1.default.json());
app.use(cors());
// Load type definitions for the GraphQL endpoint
const rickMortyTypeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, 'graphql/rickmorty/schema.graphql'), 'utf-8');
const startApolloServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // Establish connection to MongoDB before starting the server
    yield (0, mongo_1.connectDB)();
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: rickMortyTypeDefs,
        resolvers: resolvers_1.default,
        context: ({ req, res }) => ({ req, res }),
    });
    yield server.start();
    server.applyMiddleware({ app, path: '/rickmorty' });
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
startApolloServer().catch(error => {
    console.error('Failed to start the server:', error);
    process.exit(1);
});
