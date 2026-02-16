# Quick Setup Guide

Follow these steps to get your AI chatbot backend running:

## 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

## 2. Configure Environment Variables

Create a `.env` file in the project root with these variables:

```bash
# Django
SECRET_KEY=your-strong-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key

# Google Docs - Get the document ID from the URL
GOOGLE_DOCS_SYSTEM_PROMPT_ID=your-document-id-from-url
GOOGLE_CREDENTIALS_FILE=credentials.json

# Telegram - Get from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHANNEL_ID=@your-channel-username
```

## 3. Google Docs Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable "Google Docs API"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Desktop app"
   - Download credentials JSON file
5. Save it as `credentials.json` in project root (or copy `credentials.example.json` and fill values)
6. Never commit `credentials.json` to git
7. Create a Google Doc with your system prompt
8. Copy the document ID from the URL (the long string of characters)
9. Put that ID in `GOOGLE_DOCS_SYSTEM_PROMPT_ID` in your `.env`

## 4. Telegram Bot Setup

**📖 For detailed step-by-step guide, see [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)**

Quick steps:
1. Message [@BotFather](https://t.me/botfather) → `/newbot`
2. Get bot token → `TELEGRAM_BOT_TOKEN` in `.env`
3. Create a Telegram channel
4. **Get channel username:**
   - **Public channel**: Channel info → Username → Copy with `@` (e.g., `@mychannel`)
   - **Private channel**: Get channel ID from [@userinfobot](https://t.me/userinfobot) (negative number like `-1001234567890`)
5. Add bot as administrator with "Post Messages" permission
6. Add to `.env`: `TELEGRAM_CHANNEL_ID=@your-channel` or `TELEGRAM_CHANNEL_ID=-1001234567890`

## 5. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 6. Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

## 7. Run the Server

```bash
python manage.py runserver
```

Your API will be at: `http://localhost:8000/api/`

## Testing the Setup

### Test Health Check
```bash
curl http://localhost:8000/api/health/
```

### Test Telegram Integration
```bash
curl -X POST http://localhost:8000/api/test/telegram/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Test from backend"}'
```

You should receive a test message in your Telegram channel!

### Test Chat (requires OpenAI API key)
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Hello, can you help me?"
  }'
```

## Troubleshooting

### "Credentials file not found"
- Make sure `credentials.json` is in the project root
- On first run, a browser window will open for Google OAuth

### "OPENAI_API_KEY not configured"
- Check your `.env` file has the correct variable
- Make sure `.env` file is in the project root

### "Telegram bot token invalid"
- Verify you copied the full token from @BotFather
- Ensure no extra spaces in `.env` file

### "Telegram channel not found"
- Make sure bot is admin in the channel
- Use the channel username (e.g., `@mychannel`) not ID
- Include the @ symbol

## Next Steps

- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `config/settings.py`
- Customize system prompt in your Google Doc
- Access admin panel at `http://localhost:8000/admin/`
- Start building your frontend integration!

