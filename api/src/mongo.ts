// api/src/mongo.ts

import {MongoClient, ObjectId} from 'mongodb';

const url = 'mongodb://mongo:27017';
const dbName = 'pocketMorties'; // Your database name

let dbInstance: any;

export const connectDB = async () => {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    dbInstance = client.db(dbName);
};

export const getDB = () => {
    if (!dbInstance) throw Error('Must connect to Database first!');
    return dbInstance;
};

export const fetchDocumentById = async (collectionName: string, id: number) => {
    const db = getDB();
    const collection = db.collection(collectionName);
    const document = await collection.findOne({_id: new ObjectId(id)});
    return document;
};

// Utility function for paginated data fetching
export const fetchPaginatedData = async (collectionName: string, query: any, pageSize: number, after?: string) => {
    const db = getDB();
    const collection = db.collection(collectionName);

    if (after) {
        query['_id'] = {$gt: new ObjectId(after)};
    }

    const data = await collection.find(query).limit(pageSize).toArray();

    const hasNextPage = data.length === pageSize;
    const endCursor = hasNextPage ? data[data.length - 1]._id.toString() : null;

    return {
        edges: data.map((item: any) => ({
            node: item,
            cursor: item._id.toString(),
        })),
        pageInfo: {
            hasNextPage,
            endCursor,
        },
    };
};

export const fetchSortedAndPaginatedData = async (
    collectionName: string,
    sortBy: string,
    limit: number | string,
    after?: string,
    projection?: { [key: string]: number }
) => {
    const db = getDB();
    const collection = db.collection(collectionName);

    // Ensure limit is a valid integer, with a default value if necessary
    const numericLimit = parseInt(limit as string, 10) || 10; // Default to 10 if limit is invalid

    let query: any = {};
    if (after) {
        query['_id'] = {$gt: new ObjectId(after)};
    }

    const options = {
        limit: numericLimit,
        sort: {[sortBy]: -1},
        projection: projection
    };

//    const data = await collection.find(query, options).toArray();
    const data = await collection.find(query, {
        projection: {
            _id: 0,
            name: 1,
            baseatk: 1
        }
    }).sort({[sortBy]: -1}).limit(numericLimit).toArray();

    console.log("|-o-| collection: ", collection, "query: ", query, " data: ", data);

    return data;
};
