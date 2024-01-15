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
exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'yourDatabase'; // Your database name
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
