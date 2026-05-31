import os
import requests
import logging

logger = logging.getLogger(__name__)

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:8001/api/ai")

def get_category_prediction(description: str) -> str:
    """
    Calls the FastAPI microservice to predict the category for a given description.
    Fallback to 'Uncategorized' if the service is unavailable.
    """
    if not description:
        return "Uncategorized"

    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/predict-category",
            json={"description": description},
            timeout=3
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("category", "Uncategorized")
    except Exception as e:
        logger.error(f"Error calling AI service for category prediction: {e}")
    
    # Simple fallback rule-based mapping if AI service is down
    description_lower = description.lower()
    if any(keyword in description_lower for keyword in ["food", "burger", "pizza", "restaurant", "lunch", "dinner", "grocery"]):
        return "Food"
    if any(keyword in description_lower for keyword in ["uber", "lyft", "taxi", "bus", "train", "flight", "gas"]):
        return "Travel"
    if any(keyword in description_lower for keyword in ["rent", "electricity", "water", "internet", "bill"]):
        return "Bills"
    if any(keyword in description_lower for keyword in ["salary", "wage", "bonus", "freelance"]):
        return "Salary"

    return "Uncategorized"
