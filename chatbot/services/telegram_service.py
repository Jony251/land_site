"""
Service to send messages to Telegram channel
"""
from telegram import Bot
from django.conf import settings
import asyncio


class TelegramService:
    """Service to send messages to Telegram"""
    
    def __init__(self):
        token = getattr(settings, 'TELEGRAM_BOT_TOKEN')
        self.channel_id = getattr(settings, 'TELEGRAM_CHANNEL_ID')
        
        if not token:
            raise ValueError("TELEGRAM_BOT_TOKEN not configured in settings")
        if not self.channel_id:
            raise ValueError("TELEGRAM_CHANNEL_ID not configured in settings")
        
        self.bot = Bot(token=token)
    
    def _send_message_async(self, message, parse_mode='HTML'):
        """Internal async method to send message"""
        async def send():
            try:
                await self.bot.send_message(
                    chat_id=self.channel_id,
                    text=message,
                    parse_mode=parse_mode
                )
            except Exception as e:
                raise Exception(f"Error sending message to Telegram: {str(e)}")
        
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(send())
    
    def send_lead(self, lead_data, conversation_history=None, is_update=False):
        """
        Send lead information to Telegram channel with conversation history in chat format
        
        Args:
            lead_data: Dict with keys: name, phone, email, message
            conversation_history: List of conversation messages (optional)
            is_update: If True, indicates this is an update/edit (default: False)
        
        Returns:
            bool: True if successful
        """
        # Start with lead type indicator
        if is_update:
            header = "<b>🔄 Обновленная заявка</b>"
        else:
            header = "<b>📋 Новая заявка</b>"
        
        message = f"{header}\n\n"
        
        # Add contact information section
        message += "<b>📞 Контакты:</b>\n"
        message += f"👤 <b>Имя:</b> {lead_data['name']}\n"
        message += f"📱 <b>Телефон:</b> {lead_data['phone']}\n"
        
        if lead_data.get('email'):
            message += f"✉️ <b>Email:</b> {lead_data['email']}\n"
        
        message += "\n"
        
        # Add conversation history in chat format if provided
        if conversation_history:
            message += "<b>💬 История разговора:</b>\n"
            message += "─" * 30 + "\n"
            
            for msg in conversation_history:
                role = msg.get('role', '')
                content = msg.get('content', '').strip()
                
                if not content:
                    continue
                
                if role == 'user':
                    message += f"👤 <b>Клиент:</b> {content}\n\n"
                elif role == 'assistant':
                    message += f"🤖 <b>Бот:</b> {content}\n\n"
            
            message += "─" * 30 + "\n\n"
        
        # Add summary message if provided
        if lead_data.get('message'):
            message += f"<b>📝 Дополнительная информация:</b>\n{lead_data['message']}\n\n"
        
        message += f"🆔 <b>Session ID:</b> {lead_data.get('session_id', 'N/A')}"
        
        self._send_message_async(message)
        return True
    
    def send_lead_simple(self, lead_data):
        """
        Send lead information in simple format (backward compatibility)
        
        Args:
            lead_data: Dict with keys: name, phone, email, message
        
        Returns:
            bool: True if successful
        """
        return self.send_lead(lead_data, conversation_history=None, is_update=False)
    
    def send_test_message(self, test_text="Test message from AI chatbot backend"):
        """
        Send a test message to verify Telegram integration
        
        Args:
            test_text: Text to send
        """
        self._send_message_async(f"🧪 {test_text}")
        return True


# Singleton instance
_telegram_service = None

def get_telegram_service():
    """Get singleton instance of TelegramService"""
    global _telegram_service
    if _telegram_service is None:
        _telegram_service = TelegramService()
    return _telegram_service

