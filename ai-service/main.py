from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

app = FastAPI(title="AI Microservice for Finance Tracker")

# 1. Simple Dummy Dataset for Category Prediction
# In a real scenario, this would be loaded from a DB or pre-trained model file.
train_data = {
    'description': [
        'uber ride', 'lyft', 'taxi', 'flight to nyc', 'train ticket', 'bus pass',
        'mcdonalds', 'burger king', 'pizza', 'grocery store', 'dinner', 'lunch',
        'monthly rent', 'electric bill', 'water bill', 'internet bill',
        'salary', 'freelance gig', 'bonus'
    ],
    'category': [
        'Travel', 'Travel', 'Travel', 'Travel', 'Travel', 'Travel',
        'Food', 'Food', 'Food', 'Food', 'Food', 'Food',
        'Bills', 'Bills', 'Bills', 'Bills',
        'Income', 'Income', 'Income'
    ]
}

# 2. Train the simple NLP model on startup
df = pd.DataFrame(train_data)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df['description'])
y = df['category']

model = MultinomialNB()
model.fit(X, y)

class CategoryPredictionRequest(BaseModel):
    description: str

class CategoryPredictionResponse(BaseModel):
    category: str

class SpendingPredictionRequest(BaseModel):
    # Expecting a list of daily or monthly spending totals
    historical_spending: list[float]

class SpendingPredictionResponse(BaseModel):
    predicted_spending: float

@app.get("/")
def read_root():
    return {"message": "AI Microservice is running"}

@app.post("/api/ai/predict-category", response_model=CategoryPredictionResponse)
def predict_category(request: CategoryPredictionRequest):
    if not request.description:
        return {"category": "Uncategorized"}
    
    # Vectorize the input description
    try:
        X_test = vectorizer.transform([request.description.lower()])
        prediction = model.predict(X_test)[0]
        return {"category": prediction}
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"category": "Uncategorized"}

@app.post("/api/ai/predict-spending", response_model=SpendingPredictionResponse)
def predict_spending(request: SpendingPredictionRequest):
    if not request.historical_spending or len(request.historical_spending) < 1:
        raise HTTPException(status_code=400, detail="Not enough historical data")
    
    # Very simple moving average for prediction
    # For a real implementation, we could use ARIMA, Linear Regression, etc.
    data = request.historical_spending
    
    # If we have at least 3 data points, use the average of the last 3.
    # Otherwise, average whatever we have.
    n = min(3, len(data))
    predicted = sum(data[-n:]) / n
    
    return {"predicted_spending": round(predicted, 2)}
