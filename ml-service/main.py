from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf

app = FastAPI(title="Stock Prediction ML Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    symbol: str
    days: int = 1

class PredictionResponse(BaseModel):
    symbol: str
    predicted_price: float
    confidence: float
    direction: str
    change_percent: float
    model: str
    timestamp: str

@app.get("/")
async def root():
    return {"message": "Stock Prediction ML Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/predict")
async def predict(symbol: str):
    """
    Predict next-day stock price using AttCLX model
    In production, this would load the trained model and make predictions
    """
    try:
        # Fetch historical data
        stock = yf.Ticker(symbol)
        hist = stock.history(period="30d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock data not found")
        
        current_price = float(hist['Close'].iloc[-1])
        
        # Mock prediction (in production, use trained AttCLX model)
        # This simulates the model's prediction
        volatility = hist['Close'].pct_change().std()
        trend = (hist['Close'].iloc[-1] - hist['Close'].iloc[0]) / hist['Close'].iloc[0]
        
        # Simple prediction logic (replace with actual model)
        predicted_change = trend * 0.3 + np.random.normal(0, volatility * 0.5)
        predicted_price = current_price * (1 + predicted_change)
        
        direction = "UP" if predicted_change > 0 else "DOWN"
        change_percent = predicted_change * 100
        confidence = min(0.95, max(0.65, 0.8 - abs(predicted_change) * 2))
        
        return PredictionResponse(
            symbol=symbol,
            predicted_price=round(predicted_price, 2),
            confidence=round(confidence, 3),
            direction=direction,
            change_percent=round(change_percent, 2),
            model="AttCLX",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical")
async def get_historical(symbol: str, period: str = "30d"):
    """
    Fetch historical stock data
    """
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock data not found")
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.isoformat(),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
        
        return {"symbol": symbol, "data": data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
