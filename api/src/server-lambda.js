"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const schema_1 = require("@graphql-tools/schema");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const resolvers_1 = __importDefault(require("./graphql/rickmorty/resolvers"));
// Load type definitions
const pocketMortyTypeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, 'graphql/rickmorty/schema.graphql'), 'utf-8');
// Create the executable schema
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: pocketMortyTypeDefs,
    resolvers: resolvers_1.default,
});
// Create ApolloServer instance with the executable schema
const server = new apollo_server_lambda_1.ApolloServer({
    schema,
    introspection: true,
});
// Lambda handler
exports.handler = (event, context, callback) => {
    const origin = event.headers.origin;
    let headers = {};
    // Check if the origin is a subdomain of doctorew.com or is local.doctorew.com
    if (/https:\/\/.*\.doctorew\.com$/.test(origin) || origin === 'http://local.doctorew.com:3000') {
        headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': true,
            // Add other headers as needed
        };
    }
    // Apollo Server handler
    const handler = server.createHandler({
        expressGetMiddlewareOptions: {
            cors: {
                origin: true,
                credentials: true,
            },
        },
    });
    // Check for OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return callback(null, {
            statusCode: 200,
            headers,
            body: '',
        });
    }
    // Pass the request to Apollo Server
    return handler(event, context, callback);
};
