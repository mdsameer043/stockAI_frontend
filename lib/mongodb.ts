// lib/mongodb.ts

import { MongoClient, Db, ObjectId } from "mongodb"

// Extend the global scope to hold our cached connection
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Setup URI and Options
const uri = process.env.MONGODB_URI
const options = {}

if (!uri) {
  throw new Error("❌ Missing MONGODB_URI environment variable in .env.local")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Implement global caching logic for Next.js
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Interface for User documents, ensuring _id is handled correctly
export interface DbUser {
  _id: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  emailVerified?: boolean
  verificationToken?: string | null
  verificationExpires?: Date | null
}


// Connect function implementation
export async function connectToDatabase() {
  const connectedClient = await clientPromise
  
  // Uses the database name specified in the connection string
  const dbName = new URL(uri!).pathname.substring(1) 
  
  if (!dbName) {
      throw new Error("MongoDB URI must include a database name.")
  }

  const db = connectedClient.db(dbName)
  
  // console.log("✅ Successfully connected to MongoDB via cached client")
  return { client: connectedClient, db }
}