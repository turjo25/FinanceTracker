import requests
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Transaction, SavingsGoal, Feedback
from django.contrib.auth import update_session_auth_hash
from .serializers import TransactionSerializer, UserSerializer, SavingsGoalSerializer, UserProfileSerializer, FeedbackSerializer
from .ai_utils import get_category_prediction
import datetime

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": {"id": user.id, "username": user.username}
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_view(request):
    try:
        profile = request.user.profile
    except Exception:
        from .models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not user.check_password(old_password):
        return Response({'error': 'Old password is not correct.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user) # keep user logged in
    return Response({'message': 'Password updated successfully.'})

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        # Optional filtering by type or date could go here
        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)
        if month and year:
            queryset = queryset.filter(date__year=year, date__month=month)
        return queryset

    def perform_create(self, serializer):
        category = self.request.data.get('category', None)
        description = self.request.data.get('description', '')
        
        if not category:
            category = get_category_prediction(description)

        serializer.save(user=self.request.user, category=category)

class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    user = request.user
    
    # Parse month and year from query params, default to today
    today = datetime.date.today()
    month_str = request.query_params.get('month')
    year_str = request.query_params.get('year')
    
    try:
        target_month = int(month_str) if month_str else today.month
        target_year = int(year_str) if year_str else today.year
    except ValueError:
        target_month = today.month
        target_year = today.year

    # All time stats
    total_income = Transaction.objects.filter(user=user, transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expense = Transaction.objects.filter(user=user, transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = total_income - total_expense

    # Target month stats
    month_income = Transaction.objects.filter(
        user=user, transaction_type='income', date__year=target_year, date__month=target_month
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    month_expense = Transaction.objects.filter(
        user=user, transaction_type='expense', date__year=target_year, date__month=target_month
    ).aggregate(Sum('amount'))['amount__sum'] or 0

    # Expenses by category for the target month
    category_expenses = Transaction.objects.filter(
        user=user, transaction_type='expense', date__year=target_year, date__month=target_month
    ).values('category').annotate(total=Sum('amount')).order_by('-total')

    # Formatting for frontend chart
    category_chart_data = [{"name": cat['category'], "value": cat['total']} for cat in category_expenses]

    # Simple monthly trend (last 6 months)
    monthly_trend = []
    for i in range(5, -1, -1):
        m = today.month - i
        y = today.year
        if m <= 0:
            m += 12
            y -= 1
        
        inc = Transaction.objects.filter(user=user, transaction_type='income', date__year=y, date__month=m).aggregate(Sum('amount'))['amount__sum'] or 0
        exp = Transaction.objects.filter(user=user, transaction_type='expense', date__year=y, date__month=m).aggregate(Sum('amount'))['amount__sum'] or 0
        
        month_name = datetime.date(y, m, 1).strftime('%b')
        monthly_trend.append({
            "name": month_name,
            "income": inc,
            "expense": exp
        })

    # Recent activity
    recent_transactions = Transaction.objects.filter(user=user).order_by('-date', '-id')[:5]
    recent_activity = TransactionSerializer(recent_transactions, many=True).data

    # Savings goals
    savings_goals_qs = SavingsGoal.objects.filter(user=user)
    savings_goals = SavingsGoalSerializer(savings_goals_qs, many=True).data

    return Response({
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense,
        "month_income": month_income,
        "month_expense": month_expense,
        "category_data": category_chart_data,
        "monthly_trend": monthly_trend,
        "recent_activity": recent_activity,
        "savings_goals": savings_goals,
    })

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ai_chatbot_view(request):
    user = request.user
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Gather context
    total_income = Transaction.objects.filter(user=user, transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expense = Transaction.objects.filter(user=user, transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = total_income - total_expense
    
    context_msg = (
        f"You are an AI Financial Assistant for {user.username}. "
        f"Their current financial condition is: Total Income: ${total_income}, "
        f"Total Expenses: ${total_expense}, Balance: ${balance}. "
        f"Answer their questions concisely and helpfully based on this data."
    )

    api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
    
    if not api_key:
        return Response(
            {"error": "OpenRouter API Key is not configured. Please add OPENROUTER_API_KEY to your .env file."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {"role": "system", "content": context_msg},
                    {"role": "user", "content": user_message}
                ]
            },
            timeout=10
        )
        response.raise_for_status()
        ai_data = response.json()
        ai_reply = ai_data['choices'][0]['message']['content']
        return Response({"reply": ai_reply})
    except Exception as e:
        return Response({"error": f"Failed to connect to AI service: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
