"""
Service to interact with OpenAI API
"""
from openai import OpenAI
from django.conf import settings


class OpenAIService:
    """Service to interact with OpenAI Chat API"""
    
    def __init__(self):
        api_key = getattr(settings, 'OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not configured in settings")
        self.client = OpenAI(api_key=api_key)
    
    def get_chat_completion(self, messages, model="gpt-4", temperature=0.7, tools=None):
        """
        Get chat completion from OpenAI
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (default: gpt-4)
            temperature: Sampling temperature (default: 0.7)
            tools: List of tool definitions for function calling (optional)
        
        Returns:
            dict: Response with 'content' and optionally 'tool_calls'
        """
        try:
            kwargs = {
                'model': model,
                'messages': messages,
                'temperature': temperature
            }
            
            if tools:
                kwargs['tools'] = tools
                kwargs['tool_choice'] = 'auto'
            
            response = self.client.chat.completions.create(**kwargs)
            
            message = response.choices[0].message
            
            result = {
                'content': message.content,
                'tool_calls': []
            }
            
            # Check if there are function calls
            if hasattr(message, 'tool_calls') and message.tool_calls:
                for tool_call in message.tool_calls:
                    if tool_call.type == 'function':
                        result['tool_calls'].append({
                            'id': tool_call.id,
                            'function': {
                                'name': tool_call.function.name,
                                'arguments': tool_call.function.arguments
                            }
                        })
            
            return result
        except Exception as e:
            raise Exception(f"Error getting OpenAI completion: {str(e)}")


# Singleton instance
_openai_service = None

def get_openai_service():
    """Get singleton instance of OpenAIService"""
    global _openai_service
    if _openai_service is None:
        _openai_service = OpenAIService()
    return _openai_service

