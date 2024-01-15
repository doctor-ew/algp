import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'yourDatabase'; // Your database name

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
