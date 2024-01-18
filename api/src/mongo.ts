import mongoose from 'mongoose';

const pocketMortySchema = new mongoose.Schema({
    name: String,
    baseatk: Number
});

const PocketMorty = mongoose.model('PocketMorty', pocketMortySchema, 'pocketMortyCollection');

export default PocketMorty;
