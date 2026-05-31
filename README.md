# 📈 Finance Tracker

A premium, full-stack Personal Finance Tracker with AI-driven insights, multi-currency support, and dynamic analytics. Built with a modern microservices architecture, it seamlessly blends elegant UI/UX with powerful data processing to help users manage their finances effectively.

## ✨ Features

- **📊 Comprehensive Dashboard**: Interactive analytics, real-time data flow, and visual trend charts using Recharts.
- **🤖 AI Financial Chatbot**: Integrated conversational AI (powered by OpenRouter & Llama 3.1) to provide personalized financial summaries and insights.
- **🔮 Smart Predictions**: A FastAPI microservice leveraging Machine Learning (scikit-learn) for expense categorization and spending predictions.
- **💱 Live Currency Conversion**: Dynamic multi-currency support using the Frankfurter API for real-time exchange rates.
- **🔐 Secure Authentication**: Seamless Google OAuth integration alongside standard email/password JWT authentication.
- **🎯 Savings Goals**: Track progress against customizable savings targets and timeframes.
- **📱 Premium UI/UX**: Responsive grid-based layout with high-fidelity glassmorphism, tailored dark/light themes (Tailwind CSS), and smooth skeleton loaders.

## 🏗 Architecture

The project is divided into three main components:

1. **Frontend (React + Vite)**
   - **Tech Stack**: React 19, Vite, Tailwind CSS, Recharts, Lucide React.
   - **Highlights**: Centralized state management, custom Contexts for Currency and Authentication, modular skeleton loaders.

2. **Backend API (Django)**
   - **Tech Stack**: Django, Django REST Framework, SQLite.
   - **Highlights**: Robust RESTful API handling user profiles, transactions, and authentication workflows.

3. **AI Microservice (FastAPI)**
   - **Tech Stack**: FastAPI, Pandas, Scikit-learn.
   - **Highlights**: Provides lightweight NLP categorization (Naive Bayes) and statistical spending predictions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Google Cloud Console account (for OAuth credentials)
- OpenRouter API key (for the AI Chatbot)

### Installation

#### 1. Frontend Setup
```bash
cd "frontend-react"
npm install
npm run dev
```

#### 2. Django Backend Setup
```bash
cd "backend-django/core"
python -m venv env
# On Windows: .\env\Scripts\activate
# On Mac/Linux: source env/bin/activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver 8000
```

#### 3. AI Microservice Setup
```bash
cd "ai-service"
python -m venv env
# On Windows: .\env\Scripts\activate
# On Mac/Linux: source env/bin/activate
pip install fastapi uvicorn pandas numpy scikit-learn
uvicorn main:app --reload --port 8001
```

## ⚙️ Environment Configuration

You will need to set up appropriate `.env` files for the services:

- **Frontend**: API base URLs.
- **Backend (Django)**: `SECRET_KEY`, `OPENROUTER_API_KEY`
- **AI Service**: Future integration keys if required.

## 👨‍💻 Development Status

This project actively integrates professional design aesthetics with backend reliability, pushing frequent updates to improve UI performance and feature density.

## 📄 License
This project is licensed under the MIT License.
