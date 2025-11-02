from rest_framework import serializers
from .models import Lead, Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages"""
    class Meta:
        model = Message
        fields = ['role', 'content', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for conversations with messages"""
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['session_id', 'messages', 'created_at', 'updated_at']


class ChatMessageSerializer(serializers.Serializer):
    """Serializer for incoming chat messages"""
    session_id = serializers.CharField(required=True)
    message = serializers.CharField(required=True)
    model = serializers.CharField(required=False, default='gpt-4')


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for chat responses"""
    response = serializers.CharField()
    session_id = serializers.CharField()


class LeadSerializer(serializers.ModelSerializer):
    """Serializer for lead submission"""
    class Meta:
        model = Lead
        fields = ['name', 'phone', 'email', 'message']


class LeadSubmissionSerializer(serializers.Serializer):
    """Serializer for lead form submission"""
    name = serializers.CharField(max_length=200, required=True)
    phone = serializers.CharField(max_length=50, required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)

