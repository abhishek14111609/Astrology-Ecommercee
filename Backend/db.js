import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI

let isConnecting = false;

export async function connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (isConnecting) return new Promise((resolve, reject) => {
        mongoose.connection.once('connected', () => resolve(mongoose.connection));
        mongoose.connection.once('error', reject);
    });
    isConnecting = true;
    await mongoose.connect(MONGO_URI, {
        autoIndex: true,
    });
    isConnecting = false;
    return mongoose.connection;
}

export { mongoose };
