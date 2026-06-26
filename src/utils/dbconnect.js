import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URL environment variable in .env");
}

/**
 * Global connection cache — reused across hot Vercel function invocations.
 * The custom DNS lookup has been intentionally REMOVED because it breaks
 * mongodb+srv:// SRV record resolution, causing ReplicaSetNoPrimary errors.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
    // Return existing healthy connection
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Reset stale connection
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        cached.conn = null;
        cached.promise = null;
    }

    mongoose.set("bufferCommands", false);

    if (!cached.promise) {
        const opts = {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 10000, // 10s — enough for Vercel cold start
            connectTimeoutMS: 10000,
            socketTimeoutMS: 30000,
            // NO custom lookup — let mongoose handle SRV DNS natively
            // mongodb+srv:// requires SRV records which customLookup broke
            maxPoolSize: 10,
            minPoolSize: 1,
        };

        cached.promise = mongoose
            .connect(MONGODB_URL, opts)
            .then((mongooseInstance) => {
                console.log("MongoDB connected successfully");
                return mongooseInstance;
            })
            .catch((err) => {
                cached.promise = null;
                cached.conn = null;
                console.error("MongoDB connection error:", err.message);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default dbConnect;