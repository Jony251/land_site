# Running Locally on Port 8234

Quick guide to run the backend on port 8234.

## Quick Start

### Option 1: Using the Script

```bash
./run_server.sh
```

### Option 2: Manual Command

```bash
# Activate virtual environment (if using one)
source venv/bin/activate

# Run on port 8234
python manage.py runserver 0.0.0.0:8234
```

### Option 3: Specify Port in Command

```bash
python manage.py runserver 8234
```

## What This Does

- Binds to `0.0.0.0:8234` (accessible from any interface)
- Makes server available at:
  - `http://localhost:8234/api/`
  - `http://127.0.0.1:8234/api/`
  - `http://your-ip:8234/api/` (from other devices on network)

## Testing

```bash
# Health check
curl http://localhost:8234/api/health/

# Chat endpoint
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "message": "Hello"}'
```

## Frontend Integration

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'http://localhost:8234/api';
```

## CORS Configuration

Make sure your frontend URL is in `CORS_ALLOWED_ORIGINS` in `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # React default
    "http://localhost:5173",   # Vite default
    "http://localhost:8080",   # Vue default
    # Add your frontend URL
]
```

## Running in Background

```bash
# Using nohup
nohup python manage.py runserver 0.0.0.0:8234 > server.log 2>&1 &

# Or using screen
screen -S chatbot
python manage.py runserver 0.0.0.0:8234
# Press Ctrl+A then D to detach
```

## Stop Server

Press `Ctrl+C` in the terminal, or:

```bash
# If running in background, find and kill process
ps aux | grep "manage.py runserver"
kill <process_id>
```

## Production on AWS EC2

See [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md) for complete deployment guide.

When deploying to EC2, the server will run on port 8234 behind Nginx, which will handle port 80/443.

