import mongoose from "mongoose"
import dns from "dns"

// Set public DNS servers to resolve MongoDB SRV cluster address successfully (fixes ECONNREFUSED/srv query errors)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn("Could not override DNS servers:", e);
}

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URL) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}


const customLookup = (hostname, options, callback) => {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
            return dns.lookup(hostname, options, callback);
        }
        callback(null, addresses[0], 4);
    });
};

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    // Disable buffering of commands when database is not connected
    mongoose.set('bufferCommands', false);
    
    if (!cached.promise) {
        const opts = {
            dbName: DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 8000, // 8 seconds timeout
            lookup: customLookup,
        };

        cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongooseInstance) => {
            console.log("Connected to MongoDB (cached connection)");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        console.error("Database connection failed:", err);
        throw err;
    }

    return cached.conn;
}

export default dbConnect;