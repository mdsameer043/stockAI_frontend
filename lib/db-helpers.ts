import { connectToDatabase } from "./mongodb"

// User operations
export async function createUser(email: string, password: string, name: string) {
  const { db } = await connectToDatabase()
  const users = db.collection("users")

  const user = {
    email,
    password, // In production, hash with bcrypt
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await users.insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function findUserByEmail(email: string) {
  const { db } = await connectToDatabase()
  const users = db.collection("users")
  return await users.findOne({ email })
}

// Watchlist operations
export async function addToWatchlist(userId: string, symbol: string) {
  const { db } = await connectToDatabase()
  const watchlist = db.collection("watchlist")

  const item = {
    userId,
    symbol,
    addedAt: new Date(),
  }

  await watchlist.insertOne(item)
  return item
}

export async function removeFromWatchlist(userId: string, symbol: string) {
  const { db } = await connectToDatabase()
  const watchlist = db.collection("watchlist")
  return await watchlist.deleteOne({ userId, symbol })
}

export async function getUserWatchlist(userId: string) {
  const { db } = await connectToDatabase()
  const watchlist = db.collection("watchlist")
  return await watchlist.find({ userId }).toArray()
}

// Portfolio operations
export async function addToPortfolio(userId: string, symbol: string, shares: number, avgPrice: number) {
  const { db } = await connectToDatabase()
  const portfolio = db.collection("portfolio")

  const holding = {
    userId,
    symbol,
    shares,
    avgPrice,
    addedAt: new Date(),
    updatedAt: new Date(),
  }

  await portfolio.insertOne(holding)
  return holding
}

export async function getUserPortfolio(userId: string) {
  const { db } = await connectToDatabase()
  const portfolio = db.collection("portfolio")
  return await portfolio.find({ userId }).toArray()
}

// Prediction operations
export async function savePrediction(
  userId: string,
  symbol: string,
  predictedPrice: number,
  confidence: number,
  direction: "UP" | "DOWN",
  changePercent: number,
  model: string,
) {
  const { db } = await connectToDatabase()
  const predictions = db.collection("predictions")

  const prediction = {
    userId,
    symbol,
    predictedPrice,
    confidence,
    direction,
    changePercent,
    model,
    createdAt: new Date(),
  }

  await predictions.insertOne(prediction)
  return prediction
}

export async function getUserPredictions(userId: string, symbol?: string) {
  const { db } = await connectToDatabase()
  const predictions = db.collection("predictions")

  const query: any = { userId }
  if (symbol) {
    query.symbol = symbol
  }

  return await predictions.find(query).toArray()
}

export async function updatePredictionResult(
  predictionId: string,
  actualPrice: number,
  actualDirection: "UP" | "DOWN",
  wasCorrect: boolean,
) {
  const { db } = await connectToDatabase()
  const predictions = db.collection("predictions")

  return await predictions.updateOne(
    { _id: predictionId },
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
