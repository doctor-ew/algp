import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const credentials = 'X509-cert-5359790680517600107.pem'; // Update with the correct path to your .pem file
const url = 'mongodb+srv://orc-p0-cluster0.o7eayvz.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority';
const client = new MongoClient(url, {
    tlsCertificateKeyFile: credentials,
    serverApi: ServerApiVersion.v1
});

let db:Db;

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB with X.509 authentication');
        db = client.db('pocketMorties'); // Replace with your database name
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    }
}

function getPocketMortyCollection() {
    return db.collection('pocketMortyCollection'); // Replace with your collection name
}

async function listCollections(dbName: string) {
    try {
        const collections = await db.listCollections().toArray();
        for (const collectionInfo of collections) {
            const collection = db.collection(collectionInfo.name);
            const count = await collection.countDocuments();
            const firstFiveRecords = await collection.find({}).limit(5).toArray();
            console.log(`Collection: ${collectionInfo.name}`);
            console.log(`  Number of Records: ${count}`);
            console.log(`  First 5 Records: `, firstFiveRecords);
        }
    } catch (err) {
        console.error("Error listing collections:", err);
    }
}

export { connectToMongoDB, getPocketMortyCollection, listCollections };
