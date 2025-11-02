# Project Structure

```
eugeny_be/
│
├── chatbot/                    # Main chatbot application
│   ├── __init__.py
│   ├── admin.py               # Django admin configuration
│   ├── apps.py                # App configuration
│   ├── models.py              # Database models (Lead, Conversation, Message)
│   ├── serializers.py         # API serializers
│   ├── urls.py                # URL routing
│   ├── views.py               # API views/endpoints
│   │
│   └── services/              # Service layer
│       ├── __init__.py
│       ├── google_docs.py    # Google Docs API integration
│       ├── openai_service.py # OpenAI API integration
│       └── telegram_service.py # Telegram bot integration
│
├── config/                     # Django project configuration
│   ├── __init__.py
│   ├── asgi.py                # ASGI configuration
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL configuration
│   └── wsgi.py                # WSGI configuration
│
├── .gitignore                  # Git ignore rules
├── env.example                 # Environment variables template
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
│
├── API_EXAMPLES.md            # API usage examples
├── PROJECT_STRUCTURE.md       # This file
├── QUICKSTART.md              # Quick start guide
├── README.md                  # Main documentation
└── setup_instructions.md      # Detailed setup guide
```

## Key Components

### Models
- **Lead**: Stores user lead information (name, phone, email, message)
- **Conversation**: Manages chat sessions with unique session IDs
- **Message**: Stores individual chat messages with roles and content

### Services
- **GoogleDocsService**: Fetches system prompts from Google Docs
- **OpenAIService**: Handles AI chat completions via OpenAI API
- **TelegramService**: Sends lead notifications to Telegram channel

### API Endpoints

All endpoints are prefixed with `/api/`:

- `GET /api/health/` - Health check
- `POST /api/chat/` - Send chat message, get AI response
- `POST /api/leads/` - Submit lead information
- `GET /api/conversations/<session_id>/` - Get conversation history
- `POST /api/test/telegram/` - Test Telegram integration

### Environment Variables

Required:
- `SECRET_KEY` - Django secret key
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_DOCS_SYSTEM_PROMPT_ID` - Google Doc ID
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHANNEL_ID` - Telegram channel username

Optional:
- `DEBUG` - Debug mode (default: True)
- `GOOGLE_CREDENTIALS_FILE` - Path to Google OAuth credentials

## Data Flow

1. **User sends chat message** → Frontend → `POST /api/chat/`
2. **Backend fetches system prompt** → Google Docs API
3. **Backend prepares messages** → Conversation history + user message
4. **AI generates response** → OpenAI API
5. **Response returned** → Frontend displays response
6. **Lead submission** → Frontend → `POST /api/leads/`
7. **Lead stored** → Database
8. **Notification sent** → Telegram channel

## Technology Stack

- **Backend Framework**: Django 4.2
- **API Framework**: Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production)
- **AI Provider**: OpenAI GPT-4
- **Documentation**: Google Docs API
- **Messaging**: Telegram Bot API

## Development Workflow

1. Set up environment variables
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Start server: `python manage.py runserver`
5. Access admin: `http://localhost:8000/admin/`
6. Test endpoints via API_EXAMPLES.md

## Production Considerations

- Use PostgreSQL instead of SQLite
- Set `DEBUG=False`
- Configure `ALLOWED_HOSTS`
- Set up proper CORS origins
- Use environment-specific .env files
- Deploy with Gunicorn/uWSGI
- Set up SSL/TLS certificates
- Configure logging and monitoring
- Implement rate limiting
- Set up backup strategy

