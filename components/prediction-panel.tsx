"use client"

import React, { useState } from "react"

interface PredictionPanelProps {
  symbol: string
  currentPrice: number
}

export default function PredictionPanel({ symbol, currentPrice }: PredictionPanelProps) {
  const [horizon, setHorizon] = useState(1)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const res = await fetch(`/api/predict?symbol=${symbol}&horizon=${horizon}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Prediction failed")
      setPrediction(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Stock Price Prediction for {symbol}
      </h2>

      {/* Horizon Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Forecast Days</label>
        <select
          value={horizon}
          onChange={(e) => setHorizon(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value={1}>1 Day</option>
          <option value={3}>3 Days</option>
          <option value={5}>5 Days</option>
          <option value={7}>7 Days</option>
        </select>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && <p className="mt-3 text-red-500 text-sm text-center">{error}</p>}

      {prediction && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-center">Prediction Result</h3>
          <p><strong>Symbol:</strong> {prediction.symbol}</p>
          <p><strong>Predicted Price:</strong> ₹{prediction.predicted_price.toFixed(2)}</p>
          <p><strong>Expected Change:</strong> {prediction.change_percent.toFixed(2)}%</p>
          <p><strong>Direction:</strong> {prediction.direction}</p>
          <p><strong>Model Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2 text-center">Model: {prediction.model}</p>
        </div>
      )}
    </div>
  )
}
