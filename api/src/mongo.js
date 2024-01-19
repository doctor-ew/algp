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
exports.listCollections = exports.getPocketMortyCollection = exports.connectToMongoDB = void 0;
const mongodb_1 = require("mongodb");
const credentials = 'X509-cert-5359790680517600107.pem'; // Update with the correct path to your .pem file
const url = 'mongodb+srv://orc-p0-cluster0.o7eayvz.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority';
const client = new mongodb_1.MongoClient(url, {
    tlsCertificateKeyFile: credentials,
    serverApi: mongodb_1.ServerApiVersion.v1
});
let db;
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected to MongoDB with X.509 authentication');
            db = client.db('pocketMorties'); // Replace with your database name
        }
        catch (err) {
            console.error('Error connecting to MongoDB', err);
            process.exit(1);
        }
    });
}
exports.connectToMongoDB = connectToMongoDB;
function getPocketMortyCollection() {
    return db.collection('pocketMortyCollection'); // Replace with your collection name
}
exports.getPocketMortyCollection = getPocketMortyCollection;
function listCollections(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collections = yield db.listCollections().toArray();
            for (const collectionInfo of collections) {
                const collection = db.collection(collectionInfo.name);
                const count = yield collection.countDocuments();
                const firstFiveRecords = yield collection.find({}).limit(5).toArray();
                console.log(`Collection: ${collectionInfo.name}`);
                console.log(`  Number of Records: ${count}`);
                console.log(`  First 5 Records: `, firstFiveRecords);
            }
        }
        catch (err) {
            console.error("Error listing collections:", err);
        }
    });
}
exports.listCollections = listCollections;
