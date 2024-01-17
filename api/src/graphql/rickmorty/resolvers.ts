import {fetchSortedMorties, FetchSortedMortiesArgs} from '../../chat/chatHandler'; // Update the import path as needed
import { ObjectId } from 'mongodb';
import {getDB, fetchSortedAndPaginatedData, fetchPaginatedData, fetchDocumentById} from '../../mongo'; // Make sure this path is correct

// Interfaces for TypeScript type safety
interface PocketMorty {
    id: number;
    name: string;
    type: string;
    assetid: string;
    evolution: number[];
    evolutions: number[];
    rarity: string;
    basehp: number;
    baseatk: number;
    basedef: number;
    basespd: number;
    basexp: number;
    stattotal: number;
    dimensions: string;
    where_found: [string];
}

// Update the resolvers
const resolvers = {
    Query: {
        // MongoDB implementation for pocketMorty
        pocketMorty: async (_: any, args: { id: number }) => {
            // Fetch a single Morty by id
            return await fetchDocumentById('pocketMorties', args.id);
        },

        // MongoDB implementation for pocketMorties with pagination
        pocketMorties: async (_: any, args: any) => {
            // Assuming 'after' is the string representation of the MongoDB ObjectId
            return await fetchPaginatedData('pocketMorties', {}, 12, args.after);
        },


        sortedMorties: async (_: any, args: any) => {
            // Assuming args has 'sortBy' and 'limit' fields
            return await fetchSortedAndPaginatedData('pocketMorties', args.sortBy, args.limit, args.after);
        },

        topMortiesByStat: async (_: any, args: { stat: string, first: number }) => {
            // 'first' is analogous to 'limit'
            return await fetchSortedAndPaginatedData('pocketMorties', args.stat, args.first);
        },

    },
};

export default resolvers;
