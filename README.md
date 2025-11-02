# AI Chatbot Backend

Django-based backend for an AI chatbot that integrates with OpenAI, Google Docs, and Telegram.

## Features

- 🤖 **AI Chat**: Powered by OpenAI GPT-4 with custom system prompts
- 📄 **Google Docs Integration**: Fetches system prompts from Google Docs
- 📢 **Telegram Integration**: Sends collected leads to Telegram channel
- 💾 **Lead Collection**: Stores and manages leads from users
- 💬 **Conversation History**: Maintains chat history per session
- 🔌 **REST API**: RESTful API for frontend integration

## Tech Stack

- **Framework**: Django 4.2
- **API**: Django REST Framework
- **AI**: OpenAI GPT-4
- **Storage**: SQLite (can be switched to PostgreSQL)
- **Messaging**: Telegram Bot API
- **Documentation**: Google Docs API

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd eugeny_be
```

### 2. Set Up Virtual Environment

**Using Conda (if you have conda):**
```bash
# Environment 'eugeny_be' is already created
conda activate eugeny_be
```

**Or using Python venv:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

**If using conda:** Dependencies are already installed. Skip this step.

**If using venv:**
```bash
pip install -r requirements.txt
```

For conda setup details, see [CONDA_SETUP.md](CONDA_SETUP.md).

### 4. Configure environment variables

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Required environment variables:

- `SECRET_KEY`: Django secret key (generate a new one)
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_DOCS_SYSTEM_PROMPT_ID`: The document ID from Google Docs
- `GOOGLE_CREDENTIALS_FILE`: Path to Google OAuth credentials (default: `credentials.json`)
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TELEGRAM_CHANNEL_ID`: Your Telegram channel username (e.g., `@yourchannel`)

### 5. Google Docs Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Docs API
4. Create OAuth 2.0 credentials (Desktop application)
5. Download the credentials file and save it as `credentials.json` in the project root
6. **Important**: Add your Google account as a test user:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Scroll to **Test users** section
   - Click **+ ADD USERS** and add your email
   - See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for detailed instructions
7. Place your system prompt in a Google Doc and copy the document ID from the URL

**Troubleshooting**: If you see "Access denied" error, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### 6. Telegram Bot Setup

For detailed step-by-step instructions, see [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md).

Quick steps:
1. Create a bot by messaging [@BotFather](https://t.me/botfather) → `/newbot`
2. Get your bot token → add to `.env` as `TELEGRAM_BOT_TOKEN`
3. Create a Telegram channel (public or private)
4. **Get channel username**:
   - **Public**: Channel settings → Username (format: `@channelname`)
   - **Private**: Add bot as admin, then get channel ID from [@userinfobot](https://t.me/userinfobot)
5. Add your bot as administrator with "Post Messages" permission
6. Add to `.env`: `TELEGRAM_CHANNEL_ID=@your-channel` or `TELEGRAM_CHANNEL_ID=-1001234567890`

### 7. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Create a superuser (optional)

```bash
python manage.py createsuperuser
```

### 9. Run the development server

**Default port (8000):**
```bash
python manage.py runserver
```

**Custom port (e.g., 8234):**
```bash
python manage.py runserver 0.0.0.0:8234
```

The API will be available at `http://localhost:8234/api/` (or port 8000 if using default)

## API Endpoints

### Health Check
```
GET /api/health/
```
Check if the backend is running.

### Chat
```
POST /api/chat/
```
Send a message to the chatbot.

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "message": "Hello, how can you help me?",
  "model": "gpt-4"  // optional
}
```

**Response:**
```json
{
  "response": "Hello! I'm here to help...",
  "session_id": "unique-session-id"
}
```

### Submit Lead
```
POST /api/leads/
```
Submit a lead form.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",  // optional
  "message": "I'm interested in your product"  // optional
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Lead submitted successfully"
}
```

### Get Conversation History
```
GET /api/conversations/<session_id>/
```
Get all messages in a conversation.

**Response:**
```json
{
  "session_id": "unique-session-id",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "created_at": "2024-01-01T12:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Hi there!",
      "created_at": "2024-01-01T12:00:01Z"
    }
  ],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:01Z"
}
```

### Test Telegram
```
POST /api/test/telegram/
```
Send a test message to Telegram.

**Request Body:**
```json
{
  "message": "Test message"  // optional
}
```

## Frontend Integration

The API is designed to work with any frontend framework (React, Vue, Angular, etc.).

### Example using fetch:

```javascript
// Send a chat message
const response = await fetch('http://localhost:8000/api/chat/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session_id: 'user-session-123',
    message: 'Hello!'
  })
});
const data = await response.json();
console.log(data.response);

// Submit a lead
const leadResponse = await fetch('http://localhost:8000/api/leads/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com'
  })
});
const leadData = await leadResponse.json();
console.log(leadData);
```

## CORS Configuration

The backend is configured to accept requests from common frontend development ports. To add more origins, edit `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    # Add your frontend URL here
]
```

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` to:
- View and manage leads
- View conversation history
- Monitor messages

## Production Deployment

### AWS EC2 Deployment

For detailed AWS EC2 deployment instructions, see [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md)

Quick checklist for production deployment:

1. Set `DEBUG=False` in your environment variables
2. Configure `ALLOWED_HOSTS` in `settings.py`
3. Use a production database (PostgreSQL recommended)
4. Set up proper static file serving
5. Use environment-specific `.env` files
6. Configure proper CORS origins
7. Use a production WSGI server (Gunicorn, uWSGI)
8. Set up SSL/TLS certificates
9. Configure logging and monitoring
10. Set up systemd service for auto-restart
11. Configure Nginx as reverse proxy
12. Set up backup strategy

## Database

The project uses SQLite by default. For production, switch to PostgreSQL:

1. Install PostgreSQL
2. Update `DATABASES` in `config/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Troubleshooting

### Google Docs API authentication
On first run, the application will open a browser window for OAuth authentication. Make sure `credentials.json` is in the project root.

### Telegram errors
- Verify your bot token is correct
- Ensure the bot is added as an administrator to the channel
- Check that the channel username is correct (include the @ symbol)

### OpenAI API errors
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have access to the model you're using

## License

MIT

## Support

For issues or questions, please contact the development team.
