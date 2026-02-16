# Quick Start Guide

Get your AI chatbot backend running in 5 minutes!

## Prerequisites

- Python 3.8+
- OpenAI API key
- Google account
- Telegram account

## Step-by-Step Setup

### 1. Set Up Virtual Environment

**Using Conda (Recommended):**
```bash
# Environment already created as 'eugeny_be'
conda activate eugeny_be
```

**Or using Python venv:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Note:** If using conda, dependencies are already installed. If using venv, install them with `pip install -r requirements.txt`

### 2. Create .env File

Copy the example and add your credentials:

```bash
cp env.example .env
```

Then edit `.env` with your values:

```env
SECRET_KEY=your-strong-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
OPENAI_API_KEY=your-openai-api-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHANNEL_ID=@your-channel
```

### 3. Google Docs Setup

1. Create a Google Doc with your system prompt
2. Copy the document ID from URL (the long string between `/d/` and `/edit`)
3. Add to `.env`: `GOOGLE_DOCS_SYSTEM_PROMPT_ID=your-document-id`

**For OAuth setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Docs API
3. Create OAuth 2.0 credentials (Desktop app)
4. Download credentials JSON and save it as `credentials.json` in project root
5. Do **not** commit `credentials.json` to git (it's ignored by default)
6. Optional: copy `credentials.example.json` and fill your own values
7. **Add your Google account as test user:**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Scroll to **Test users** → Click **+ ADD USERS**
   - Add your email address
8. Run the app once - browser will open for authentication

**⚠️ If you see "Access denied" error:** See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for fix

### 4. Telegram Setup

1. Message [@BotFather](https://t.me/botfather) → `/newbot`
2. Get token → add to `.env` as `TELEGRAM_BOT_TOKEN`
3. Create a Telegram channel (public or private)
4. Get channel username:
   - **Public channel**: Open channel → Click channel name → Look for "Username" → Copy with `@` (e.g., `@mychannel`)
   - **Private channel**: Add bot as admin → Send message → Forward to [@userinfobot](https://t.me/userinfobot) → Get channel ID (negative number)
5. Add bot as administrator with "Post Messages" permission
6. Add to `.env`: `TELEGRAM_CHANNEL_ID=@your-channel` or `TELEGRAM_CHANNEL_ID=-1001234567890`

**📖 Detailed instructions:** See [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md) for step-by-step guide with screenshots and troubleshooting.

### 5. Run Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Start Server

**Important:** Make sure conda environment is activated:
```bash
conda activate eugeny_be
```

**Default port (8000):**
```bash
python manage.py runserver
```

**Custom port (e.g., 8234):**
```bash
python manage.py runserver 0.0.0.0:8234
```

**Or use the script:**
```bash
./run_server.sh
```

This makes the server accessible on `http://localhost:8234/api/`

## Test It!

If running on port 8234, replace `8000` with `8234` in the URLs below:

```bash
# Health check (replace 8000 with your port if different)
curl http://localhost:8234/api/health/

# Test Telegram
curl -X POST http://localhost:8234/api/test/telegram/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Test"}'

# Chat with AI
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Hello!"
  }'
```

## Next Steps

- Read [README.md](README.md) for full documentation
- See [API_EXAMPLES.md](API_EXAMPLES.md) for integration examples
- See [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md) for production deployment
- Access admin at `http://localhost:8234/admin/` (or your configured port)

You're ready to go! 🚀

