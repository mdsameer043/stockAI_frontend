// lib/db-helpers.ts (updated parts)
import { connectToDatabase, DbUser } from "./mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function createUser(
  email: string,
  password: string,
  name: string,
  extra: Partial<Record<string, any>> = {}
): Promise<Omit<DbUser, "_id"> & { _id: string }> {
  const { db } = await connectToDatabase()
  const users = db.collection("users")

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: extra.emailVerified ?? false,
    verificationToken: extra.verificationToken ?? null,
    verificationExpires: extra.verificationExpires ?? null,
  }

  const result = await users.insertOne(user as any)
  return { ...user, _id: result.insertedId.toString() }
}

export async function setVerificationToken(userId: string, token: string, expires: Date) {
  const { db } = await connectToDatabase()
  const users = db.collection("users")
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        verificationToken: token,
        verificationExpires: expires,
        updatedAt: new Date(),
      },
    }
  )
}

export async function findUserByVerificationToken(token: string) {
  const { db } = await connectToDatabase()
  const users = db.collection<any>("users")
  // we store verificationToken and verificationExpires fields
  return await users.findOne({ verificationToken: token })
}

export async function verifyUserById(userId: string) {
  const { db } = await connectToDatabase()
  const users = db.collection("users")
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: { emailVerified: true, verificationToken: null, verificationExpires: null, updatedAt: new Date() },
    }
  )
}

// NOTE: keep your existing addToWatchlist, updatePredictionResult, findUserByEmail unchanged


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


export async function createVerificationEntry(email: string, otp: string, payload: Record<string, any>, expiresAt: Date) {
  const { db } = await connectToDatabase()
  const verifications = db.collection("verifications")

  // Upsert a verification entry for the email (overwrite previous OTPs)
  const doc = {
    email,
    otp,
    payload, // will hold { name, password } or any extra fields (we'll persist password hashed on user creation)
    expiresAt,
    createdAt: new Date(),
  }

  await verifications.updateOne(
    { email },
    { $set: doc },
    { upsert: true }
  )

  return doc
}

export async function findVerificationByEmail(email: string) {
  const { db } = await connectToDatabase()
  const verifications = db.collection("verifications")
  return await verifications.findOne({ email })
}

export async function deleteVerificationByEmail(email: string) {
  const { db } = await connectToDatabase()
  const verifications = db.collection("verifications")
  return await verifications.deleteOne({ email })
}