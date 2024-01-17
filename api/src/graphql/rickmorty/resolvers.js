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
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("../../mongo"); // Make sure this path is correct
// Update the resolvers
const resolvers = {
    Query: {
        // MongoDB implementation for pocketMorty
        pocketMorty: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch a single Morty by id
            return yield (0, mongo_1.fetchDocumentById)('pocketMorties', args.id);
        }),
        // MongoDB implementation for pocketMorties with pagination
        pocketMorties: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming 'after' is the string representation of the MongoDB ObjectId
            return yield (0, mongo_1.fetchPaginatedData)('pocketMorties', {}, 12, args.after);
        }),
        sortedMorties: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming args has 'sortBy' and 'limit' fields
            return yield (0, mongo_1.fetchSortedAndPaginatedData)('pocketMorties', args.sortBy, args.limit, args.after);
        }),
        topMortiesByStat: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // 'first' is analogous to 'limit'
            return yield (0, mongo_1.fetchSortedAndPaginatedData)('pocketMorties', args.stat, args.first);
        }),
    },
};
exports.default = resolvers;
