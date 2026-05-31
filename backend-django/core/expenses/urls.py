from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'savings-goals', views.SavingsGoalViewSet, basename='savings-goal')
router.register(r'feedbacks', views.FeedbackViewSet, basename='feedback')

urlpatterns = [
    # Auth
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard
    path('dashboard/', views.dashboard_summary, name='dashboard-summary'),
    
    # User Profile & Settings
    path('profile/', views.user_profile_view, name='user-profile'),
    path('change-password/', views.change_password_view, name='change-password'),
    
    # AI Chatbot
    path('chat/', views.ai_chatbot_view, name='ai_chat'),
    
    # API Router for Transactions and Goals
    path('', include(router.urls)),
]
