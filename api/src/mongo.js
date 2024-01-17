"use strict";
// api/src/mongo.ts
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
exports.fetchSortedAndPaginatedData = exports.fetchPaginatedData = exports.fetchDocumentById = exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const url = 'mongodb://mongo:27017';
const dbName = 'pocketMorties'; // Your database name
let dbInstance;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    console.log('Connected successfully to MongoDB');
    dbInstance = client.db(dbName);
});
exports.connectDB = connectDB;
const getDB = () => {
    if (!dbInstance)
        throw Error('Must connect to Database first!');
    return dbInstance;
};
exports.getDB = getDB;
const fetchDocumentById = (collectionName, id) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, exports.getDB)();
    const collection = db.collection(collectionName);
    const document = yield collection.findOne({ _id: new mongodb_1.ObjectId(id) });
    return document;
});
exports.fetchDocumentById = fetchDocumentById;
// Utility function for paginated data fetching
const fetchPaginatedData = (collectionName, query, pageSize, after) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, exports.getDB)();
    const collection = db.collection(collectionName);
    if (after) {
        query['_id'] = { $gt: new mongodb_1.ObjectId(after) };
    }
    const data = yield collection.find(query).limit(pageSize).toArray();
    const nextCursor = data.length > 0 ? data[data.length - 1]._id.toString() : null;
    return {
        edges: data.map((item) => ({
            node: item,
            cursor: item._id.toString(),
        })),
        pageInfo: {
            hasNextPage: data.length === pageSize,
            endCursor: nextCursor,
        },
    };
});
exports.fetchPaginatedData = fetchPaginatedData;
const fetchSortedAndPaginatedData = (collectionName, sortBy, limit, after, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, exports.getDB)();
    const collection = db.collection(collectionName);
    // Ensure limit is a valid integer, with a default value if necessary
    const numericLimit = parseInt(limit, 10) || 10; // Default to 10 if limit is invalid
    let query = {};
    if (after) {
        query['_id'] = { $gt: new mongodb_1.ObjectId(after) };
    }
    const options = {
        limit: numericLimit,
        sort: { [sortBy]: -1 },
        projection: projection
    };
    //    const data = await collection.find(query, options).toArray();
    const data = yield collection.find(query, {
        projection: {
            _id: 0,
            name: 1,
            baseatk: 1
        }
    }).sort({ [sortBy]: -1 }).limit(numericLimit).toArray();
    console.log("|-o-| collection: ", collection, "query: ", query, " data: ", data);
    return data;
});
exports.fetchSortedAndPaginatedData = fetchSortedAndPaginatedData;
