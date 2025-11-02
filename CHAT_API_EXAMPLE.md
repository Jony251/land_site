# Chat API - Quick Example

Simple example for getting AI responses from the chatbot.

## Endpoint

```
POST http://localhost:8234/api/chat/
```

(Replace `localhost:8234` with your server address)

## Request Body

```json
{
  "session_id": "user-123",
  "message": "Hello, how can you help me?",
  "model": "gpt-4"
}
```

### Fields

- **`session_id`** (required): Unique identifier for the conversation. Use the same ID to maintain conversation history.
  - Examples: `"user-123"`, `"session-abc-456"`, `"unique-user-id"`
  
- **`message`** (required): The message you want to send to the AI
  - Example: `"What is your purpose?"`
  
- **`model`** (optional): OpenAI model to use. Defaults to `"gpt-4"` if not provided
  - Examples: `"gpt-4"`, `"gpt-3.5-turbo"`, `"gpt-4-turbo"`

## Response

```json
{
  "response": "Hello! I'm an AI assistant designed to help you with...",
  "session_id": "user-123"
}
```

## Complete Examples

### Using cURL

```bash
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session-123",
    "message": "Hello, what can you do?",
    "model": "gpt-4"
  }'
```

### Using JavaScript/fetch

```javascript
const response = await fetch('http://localhost:8234/api/chat/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session_id: 'user-123',
    message: 'Hello, what can you do?',
    model: 'gpt-4'  // optional
  })
});

const data = await response.json();
console.log('AI Response:', data.response);
```

### Using Python requests

```python
import requests

url = "http://localhost:8234/api/chat/"
payload = {
    "session_id": "user-123",
    "message": "Hello, what can you do?",
    "model": "gpt-4"  # optional
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print("AI Response:", data["response"])
```

## Minimal Example (without model)

```json
{
  "session_id": "my-session",
  "message": "Tell me a joke"
}
```

The `model` field is optional - it will default to `"gpt-4"`.

## Conversation History

The API automatically maintains conversation history per `session_id`. 

- **First message** with `session_id: "user-123"`: Starts a new conversation
- **Second message** with same `session_id: "user-123"`: Includes previous messages in context
- **Different `session_id`**: Starts a fresh conversation

Example conversation flow:

```bash
# Message 1
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "user-123", "message": "My name is John"}'

# Response: "Nice to meet you, John! How can I help you today?"

# Message 2 (same session_id - AI remembers your name)
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "user-123", "message": "What's my name?"}'

# Response: "Your name is John!"
```

## Error Responses

### Missing required field

**Request:**
```json
{
  "session_id": "user-123"
  // missing "message"
}
```

**Response (400 Bad Request):**
```json
{
  "message": ["This field is required."]
}
```

### Invalid session_id format

**Request:**
```json
{
  "session_id": 123,  // should be string
  "message": "Hello"
}
```

**Response (400 Bad Request):**
```json
{
  "session_id": ["Not a valid string."]
}
```

## Full Working Example

Here's a complete example you can copy-paste:

```bash
curl -X POST http://localhost:8234/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-user-001",
    "message": "Hello! Can you introduce yourself?",
    "model": "gpt-4"
  }'
```

Expected response:
```json
{
  "response": "[AI will introduce itself based on your system prompt from Google Docs]",
  "session_id": "demo-user-001"
}
```

## Notes

- Make sure your server is running on port 8234 (or adjust the URL)
- Ensure your `.env` file has `OPENAI_API_KEY` configured
- The system prompt comes from your Google Docs (configured in `.env` as `GOOGLE_DOCS_SYSTEM_PROMPT_ID`)
- The AI response will be influenced by the system prompt you set up in Google Docs

