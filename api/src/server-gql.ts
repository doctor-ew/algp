/*
import express from 'express';
const cors = require('cors');
import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';
import path from 'path';
import rickMortyResolvers from './graphql/rickmorty/resolvers';
import { generateGraphQLQuery, sendToGraphQLServer, assessGraphQLResponse } from './chat/chatHandler';
import { connectDB } from './mongo';  // Ensure this import is correct

const app: express.Application = express();
const PORT = 4001;

// Use express.json() to parse JSON payloads
app.use(cors());
app.use(express.json());
app.use(cors());

// Load type definitions for the GraphQL endpoint
const rickMortyTypeDefs = readFileSync(path.join(__dirname, 'graphql/rickmorty/schema.graphql'), 'utf-8');

const startApolloServer = async () => {
    // Establish connection to MongoDB before starting the server
    await connectDB();

    const server = new ApolloServer({
        typeDefs: rickMortyTypeDefs,
        resolvers: rickMortyResolvers,
        context: ({ req, res }) => ({ req, res }),
    });

    await server.start();
    server.applyMiddleware({ app, path: '/rickmorty' });

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};

startApolloServer().catch(error => {
    console.error('Failed to start the server:', error);
    process.exit(1);
});
*/
