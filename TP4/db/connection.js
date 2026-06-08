import mongoose from "mongoose"
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongoose || {conn: null, promise: null}

export const connectToDatabase = async ()=>{
    // Si existe la base de datos, la devuelve
    if (cached.conn) return cached.conn

    // Si no existe, la crea
    if (!MONGODB_URI) throw new Error('MONGODB is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'BaseMongoDB',
        bufferCommands: false
    })

    cached.conn = await cached.promise

    return cached.conn
}