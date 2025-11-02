"""
API views for the chatbot application
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lead, Conversation, Message
from .serializers import (
    ChatMessageSerializer, ChatResponseSerializer, 
    LeadSubmissionSerializer, ConversationSerializer
)
from .services.openai_service import get_openai_service
from .services.google_docs import get_google_docs_service
from .services.telegram_service import get_telegram_service
from .tools import get_available_tools
import json
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'ok', 'message': 'AI Chatbot backend is running'})


@api_view(['POST'])
def chat(request):
    """
    Handle chat messages from the frontend
    
    POST /api/chat/
    Body: {
        "session_id": "unique-session-id",
        "message": "user message",
        "model": "gpt-4" (optional)
    }
    """
    serializer = ChatMessageSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    session_id = serializer.validated_data['session_id']
    user_message = serializer.validated_data['message']
    model = serializer.validated_data.get('model', 'gpt-4')
    
    try:
        # Get or create conversation
        conversation, created = Conversation.objects.get_or_create(session_id=session_id)
        
        # Get system prompt from Google Docs
        google_docs_service = get_google_docs_service()
        system_prompt = google_docs_service.get_system_prompt()
        
        # Prepare messages for OpenAI
        messages = [{'role': 'system', 'content': system_prompt}]
        
        # Add conversation history
        for msg in conversation.messages.all():
            messages.append({
                'role': msg.role,
                'content': msg.content
            })
        
        # Add current user message
        messages.append({'role': 'user', 'content': user_message})
        
        # Save user message
        Message.objects.create(
            conversation=conversation,
            role='user',
            content=user_message
        )
        
        # Get available tools
        tools = get_available_tools()
        
        # Get response from OpenAI with function calling
        openai_service = get_openai_service()
        response = openai_service.get_chat_completion(messages, model=model, tools=tools)
        
        assistant_content = response.get('content', '')
        tool_calls = response.get('tool_calls', [])
        
        # Save assistant response (before tool execution)
        assistant_message = Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=assistant_content or "[Function call made]"
        )
        
        # Handle function calls
        lead_submitted = False
        if tool_calls:
            for tool_call in tool_calls:
                function_name = tool_call['function']['name']
                function_args = json.loads(tool_call['function']['arguments'])
                
                if function_name == 'submit_lead':
                    # Execute lead submission
                    try:
                        # Check if this is an update (user edited their details)
                        # Look for existing lead with same phone or session_id
                        existing_lead = Lead.objects.filter(
                            phone=function_args.get('phone', '')
                        ).first()
                        
                        is_update = existing_lead is not None
                        
                        # Create new lead (even if update - we want new entry)
                        lead = Lead.objects.create(
                            name=function_args.get('name', ''),
                            phone=function_args.get('phone', ''),
                            email=function_args.get('email') or None,
                            message=function_args.get('message') or None
                        )
                        
                        # Get full conversation history for Telegram message
                        conversation_messages = []
                        for msg in conversation.messages.all().order_by('created_at'):
                            conversation_messages.append({
                                'role': msg.role,
                                'content': msg.content,
                                'created_at': msg.created_at.isoformat()
                            })
                        
                        # Format and send to Telegram with conversation history
                        telegram_service = get_telegram_service()
                        telegram_service.send_lead(
                            lead_data={
                                'name': lead.name,
                                'phone': lead.phone,
                                'email': lead.email,
                                'message': lead.message,
                                'session_id': session_id
                            },
                            conversation_history=conversation_messages,
                            is_update=is_update
                        )
                        
                        lead.sent_to_telegram = True
                        lead.save()
                        
                        lead_submitted = True
                        if is_update:
                            function_result = "Lead information updated and submitted successfully!"
                        else:
                            function_result = "Lead successfully submitted!"
                        
                    except Exception as e:
                        logger.error(f"Error submitting lead: {str(e)}")
                        function_result = f"Error submitting lead: {str(e)}"
                    
                    # Add function result to messages for OpenAI
                    messages.append({
                        'role': 'tool',
                        'tool_call_id': tool_call['id'],
                        'name': function_name,
                        'content': function_result
                    })
            
            # If function was called, get final response from AI
            if tool_calls:
                final_response = openai_service.get_chat_completion(messages, model=model, tools=tools)
                assistant_content = final_response.get('content', assistant_content)
                
                # Update the assistant message with final response
                assistant_message.content = assistant_content
                assistant_message.save()
        
        # Build response
        response_data = {
            'response': assistant_content,
            'session_id': session_id
        }
        
        # Include lead submission status if applicable
        if lead_submitted:
            response_data['lead_submitted'] = True
            response_data['message'] = 'Lead has been submitted successfully!'
        
        return Response(response_data)
    
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        return Response(
            {'error': 'Configuration error. Please check your environment variables.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return Response(
            {'error': 'An error occurred while processing your message.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def submit_lead(request):
    """
    Handle lead submission from the frontend
    
    POST /api/leads/
    Body: {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com" (optional),
        "message": "Additional message" (optional)
    }
    """
    serializer = LeadSubmissionSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create lead
        lead = Lead.objects.create(**serializer.validated_data)
        
        # Send to Telegram (without conversation history for manual submissions)
        telegram_service = get_telegram_service()
        telegram_service.send_lead_simple({
            'name': lead.name,
            'phone': lead.phone,
            'email': lead.email,
            'message': lead.message
        })
        
        # Mark as sent
        lead.sent_to_telegram = True
        lead.save()
        
        return Response({
            'status': 'success',
            'message': 'Lead submitted successfully'
        }, status=status.HTTP_201_CREATED)
    
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        return Response(
            {'error': 'Configuration error. Please check your environment variables.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.error(f"Error submitting lead: {str(e)}")
        # Still save the lead even if Telegram fails
        if 'lead' in locals():
            return Response({
                'status': 'partial_success',
                'message': 'Lead saved but failed to send to Telegram'
            }, status=status.HTTP_201_CREATED)
        return Response(
            {'error': 'An error occurred while submitting the lead.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def conversation_history(request, session_id):
    """
    Get conversation history for a session
    
    GET /api/conversations/<session_id>/
    """
    try:
        conversation = Conversation.objects.get(session_id=session_id)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def test_telegram(request):
    """
    Test Telegram integration
    
    POST /api/test/telegram/
    Body: {
        "message": "Test message" (optional)
    }
    """
    try:
        telegram_service = get_telegram_service()
        test_message = request.data.get('message', 'Test message from AI chatbot backend')
        telegram_service.send_test_message(test_message)
        
        return Response({
            'status': 'success',
            'message': 'Test message sent to Telegram'
        })
    except Exception as e:
        logger.error(f"Error testing Telegram: {str(e)}")
        return Response(
            {'error': 'Failed to send test message to Telegram'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

