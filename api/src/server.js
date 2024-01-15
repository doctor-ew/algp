"use strict";
// /packages/backend/src/server.ts
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
const chatHandler_1 = require("./chat/chatHandler");
const app = (0, express_1.default)();
const PORT = 4000;
// Use express.json() to parse JSON payloads
app.use(cors());
app.use(express_1.default.json());
// Load type definitions for the GraphQL endpoint
const rickMortyTypeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, 'graphql/rickmorty/schema.graphql'), 'utf-8');
function fetchMorties() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://local.doctorew.com:4000/rickmorty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query GetPocketMorties($first: Int, $after: String, $type: [String], $sortBy: String) {
        pocketMorties(first: $first, after: $after, type: $type, sortBy: $sortBy) {
          edges {
            node {
              id
              name
              type
              assetid
              evolution
              evolutions
              rarity
              basehp
              baseatk
              basedef
              basespd
              basexp
              stattotal
              dimensions
              where_found
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`,
                variables: {
                    first: 10,
                    after: null, // Adjust this as needed for pagination
                    type: null, // Adjust this based on user selection
                    sortBy: null, // Adjust this based on user selection
                },
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}
// Create ApolloServer instance for the GraphQL endpoint
const rickMortyServer = new apollo_server_express_1.ApolloServer({
    typeDefs: rickMortyTypeDefs,
    resolvers: resolvers_1.default,
    context: ({ req, res }) => ({
        req,
        res,
    })
});
// Start Apollo Server
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield rickMortyServer.start();
        rickMortyServer.applyMiddleware({ app: app, path: '/rickmorty' });
    });
}
// Call the asynchronous function to start the server
startApolloServer().then(() => {
    // New endpoint for handling user queries
    app.post('/api/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("|-00-| 00 calling handleChatRequest query: ", req.body);
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).send('User query not provided');
            }
            // Step 1: Generate a GraphQL query using OpenAI
            const generatedGqlQuery = yield (0, chatHandler_1.generateGraphQLQuery)(query);
            // Step 2: Send the GraphQL query to your GraphQL server
            const graphqlResponse = yield (0, chatHandler_1.sendToGraphQLServer)(generatedGqlQuery);
            // Step 3: Receive and process the GraphQL response
            const assessedResponse = (0, chatHandler_1.assessGraphQLResponse)(graphqlResponse);
            // Step 4: Respond with the assessed result
            res.json(assessedResponse);
        }
        catch (error) {
            console.error('Error handling user query:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    // Chat API Route for handling JSON analysis
    // Health Check Endpoint
    app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Update this endpoint to check the health of other services if necessary
        res.status(200).send('OK');
    }));
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error(error);
    process.exit(1);
});
