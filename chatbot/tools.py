"""
Tool definitions for OpenAI function calling
"""
import json


def get_lead_submission_tool():
    """
    Returns the tool definition for lead submission
    
    The AI can call this tool when it has collected enough information
    from the user to create a lead (name, phone, and optionally email/message).
    """
    return {
        "type": "function",
        "function": {
            "name": "submit_lead",
            "description": "Submit a lead when the user has provided their contact information (name and phone number are required, email and message are optional). Call this function when the conversation reaches the point where the user wants to submit their information or you have collected all necessary details (name and phone at minimum). IMPORTANT: If the user wants to edit or update their information, call this function again with the new details - it will create a new submission. The full conversation history will be included automatically.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The user's full name"
                    },
                    "phone": {
                        "type": "string",
                        "description": "The user's phone number. Can include country code, spaces, dashes, or other formatting."
                    },
                    "email": {
                        "type": "string",
                        "description": "The user's email address (optional, only include if provided)"
                    },
                    "message": {
                        "type": "string",
                        "description": "Any additional message or notes from the user (optional, only include if provided or relevant)"
                    }
                },
                "required": ["name", "phone"]
            }
        }
    }


def get_available_tools():
    """
    Returns list of all available tools for OpenAI function calling
    """
    return [get_lead_submission_tool()]

