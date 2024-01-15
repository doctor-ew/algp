"use strict";
// apps/graphql/packages/graphql/rickmorty/resolvers.ts
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
const axios_1 = __importDefault(require("axios"));
const chatHandler_1 = require("../../chat/chatHandler"); // Update the import path as needed
// Utility function to fetch data from a URL
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url);
        return response.data.results || response.data; // Accommodate different response structures
    }
    catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
});
// Filtering utility for PocketMorties
const filterPocketMorties = (data, args) => {
    return data.filter(morty => {
        return (!args.type || args.type.includes(morty.type)) &&
            (!args.rarity || args.rarity.includes(morty.rarity)) &&
            (args.basexp === undefined || morty.basexp === args.basexp) &&
            (args.basehp === undefined || morty.basehp === args.basehp) &&
            (args.baseatk === undefined || morty.baseatk === args.baseatk) &&
            (args.basedef === undefined || morty.basedef === args.basedef) &&
            (args.basespd === undefined || morty.basespd === args.basespd) &&
            (args.stattotal === undefined || morty.stattotal === args.stattotal) &&
            (args.assetid === undefined || morty.assetid === args.assetid) &&
            (!args.dimensions || args.dimensions.includes(morty.dimensions)) &&
            (!args.where_found || args.where_found.some((location) => morty.where_found.includes(location)));
    });
};
// Utility function for sorting and limiting
const sortData = (data, sortBy) => {
    if (sortBy) {
        return [...data].sort((a, b) => b[sortBy] - a[sortBy]);
    }
    return data;
};
// Update the resolvers
const resolvers = {
    Query: {
        pocketMorty: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield fetchData('https://www.doctorew.com/shuttlebay/cleaned_pocket_morties.json');
            // Find the specific Morty by ID
            const morty = data.find((morty) => morty.id === args.id);
            console.log('|-o-| morty', morty);
            return morty || null; // Return the found Morty or null if not found
        }),
        pocketMorties: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield fetchData('https://www.doctorew.com/shuttlebay/cleaned_pocket_morties.json');
            let filteredData = filterPocketMorties(data, args);
            console.log('|-ofo-| filteredData', filteredData);
            // Sort the filtered data
            filteredData = sortData(filteredData, args.sortBy);
            // Create edges with cursors
            const edges = filteredData.map(morty => ({
                node: morty,
                cursor: `cursor-${morty.id}` // Simple cursor example
            }));
            // Apply cursor-based pagination
            const afterIndex = args.after ? edges.findIndex(edge => edge.cursor === args.after) : -1;
            const paginatedEdges = edges.slice(afterIndex + 1, afterIndex + 1 + args.first);
            return {
                edges: paginatedEdges,
                pageInfo: {
                    hasNextPage: afterIndex + 1 + (args.first || filteredData.length) < edges.length,
                    endCursor: paginatedEdges.length ? paginatedEdges[paginatedEdges.length - 1].cursor : null
                }
            };
        }),
        sortedMorties: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, chatHandler_1.fetchSortedMorties)(args);
        }),
        topMortiesByStat: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield fetchData('https://www.doctorew.com/shuttlebay/cleaned_pocket_morties.json');
            // Sort the data by the specified stat (e.g., baseatk) in descending order
            const sortedData = sortData(data, args.stat).slice(0, args.first);
            return sortedData;
        }),
    },
};
exports.default = resolvers;
