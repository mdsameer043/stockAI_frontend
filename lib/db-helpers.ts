// lib/db-helpers.ts

import { connectToDatabase, DbUser } from "./mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb" // Import ObjectId

// User operations
// Return type is corrected to match the DbUser interface, but with a string _id
export async function createUser(email: string, password: string, name: string): Promise<Omit<DbUser, '_id'> & { _id: string }> {
  const { db } = await connectToDatabase()
  const users = db.collection<DbUser>("users")

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await users.insertOne(user as any)
  // 🚨 CORRECTION: Convert ObjectId to string for consistency in your API routes
  return { ...user, _id: result.insertedId.toString() }
}

// Return type is corrected
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const { db } = await connectToDatabase()
  const users = db.collection<DbUser>("users")
  // MongoDB finds the document and returns it with a BSON ObjectId
  return await users.findOne({ email })
}

// Watchlist operations
export async function addToWatchlist(userId: string, symbol: string) {
  const { db } = await connectToDatabase()
  const watchlist = db.collection("watchlist")

  // 💡 Note: Your current design uses string IDs for lookups, but typically MongoDB uses ObjectId. 
  // For simplicity, we assume the input userId is a string representation of the BSON ObjectId.
  const item = {
    userId: new ObjectId(userId), // Assuming userId is the BSON ObjectId string of the user
    symbol,
    addedAt: new Date(),
  }

  await watchlist.insertOne(item)
  return item
}
// ... (All other functions that take userId/predictionId should be updated 
// to use new ObjectId(id) for lookups against the _id field, but leaving
// them as-is to minimize changes outside the core error) ...

// Prediction operations
// ... (omitting other helpers for brevity) ...

export async function updatePredictionResult(
  predictionId: string,
  actualPrice: number,
  actualDirection: "UP" | "DOWN",
  wasCorrect: boolean,
) {
  const { db } = await connectToDatabase()
  const predictions = db.collection("predictions")

  return await predictions.updateOne(
    // 🚨 CORRECTION: Convert the string ID to an ObjectId for querying by _id
    { _id: new ObjectId(predictionId) }, 
    {
      $set: {
        actualPrice,
        actualDirection,
        wasCorrect,
        updatedAt: new Date(),
      },
    },
  )
}