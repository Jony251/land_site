"""
URL configuration for chatbot app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('chat/', views.chat, name='chat'),
    path('leads/', views.submit_lead, name='submit_lead'),
    path('conversations/<str:session_id>/', views.conversation_history, name='conversation_history'),
    path('test/telegram/', views.test_telegram, name='test_telegram'),
]

