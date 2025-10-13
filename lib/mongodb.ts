// MongoDB connection utility
// This uses the MongoDB Node.js driver for database operations

let cachedClient: any = null
let cachedDb: any = null

export async function connectToDatabase() {
  // In development, use cached connection
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Mock MongoDB connection for demo
  // In production, use: const client = await MongoClient.connect(process.env.MONGODB_URI!)
  const mockClient = {
    db: (name: string) => ({
      collection: (collectionName: string) => ({
        find: () => ({ toArray: async () => [] }),
        findOne: async () => null,
        insertOne: async (doc: any) => ({ insertedId: "mock-id" }),
        updateOne: async () => ({ modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 }),
      }),
    }),
  }

  cachedClient = mockClient
  cachedDb = mockClient.db("stock_prediction")

  return { client: cachedClient, db: cachedDb }
}

// Database models and schemas
export interface User {
  _id?: string
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Watchlist {
  _id?: string
  userId: string
  symbol: string
  addedAt: Date
}

export interface Portfolio {
  _id?: string
  userId: string
  symbol: string
  shares: number
  avgPrice: number
  addedAt: Date
  updatedAt: Date
}

export interface Prediction {
  _id?: string
  userId: string
  symbol: string
  predictedPrice: number
  confidence: number
  direction: "UP" | "DOWN"
  changePercent: number
  model: string
  createdAt: Date
  actualPrice?: number
  actualDirection?: "UP" | "DOWN"
  wasCorrect?: boolean
}
