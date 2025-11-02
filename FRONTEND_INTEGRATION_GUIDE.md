# Frontend Integration Guide

Complete guide for integrating the AI Chatbot Backend API into your frontend application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [API Base URL](#api-base-url)
3. [Endpoints Overview](#endpoints-overview)
4. [Authentication & Headers](#authentication--headers)
5. [Chat API](#chat-api)
6. [Lead Submission](#lead-submission)
7. [Conversation History](#conversation-history)
8. [Error Handling](#error-handling)
9. [Code Examples](#code-examples)
10. [Best Practices](#best-practices)

## Quick Start

### Base URL

```javascript
const API_BASE_URL = 'http://localhost:8234/api';
// For production: 'https://your-domain.com/api'
```

### Minimal Example

```javascript
async function sendMessage(sessionId, message) {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message: message
    })
  });
  const data = await response.json();
  return data.response;
}
```

## API Base URL

**Development:**
```
http://localhost:8234/api
```

**Production:**
```
https://your-domain.com/api
```

Make sure your production URL is added to `CORS_ALLOWED_ORIGINS` in the backend settings.

## Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health/` | GET | Health check |
| `/api/chat/` | POST | Send message, get AI response |
| `/api/leads/` | POST | Manual lead submission (optional) |
| `/api/conversations/<session_id>/` | GET | Get conversation history |
| `/api/test/telegram/` | POST | Test Telegram integration |

## Authentication & Headers

No authentication required. All endpoints are public.

**Required Headers:**
```javascript
{
  'Content-Type': 'application/json'
}
```

## Chat API

### Endpoint
```
POST /api/chat/
```

### Request Body

```json
{
  "session_id": "unique-session-id",
  "message": "Hello, how can you help me?",
  "model": "gpt-4"
}
```

**Fields:**
- `session_id` (required): Unique identifier for the conversation session
  - Use the same ID to maintain conversation history
  - Generate once per user session (e.g., `user-${Date.now()}` or UUID)
- `message` (required): User's message to the AI
- `model` (optional): OpenAI model to use. Default: `"gpt-4"`

### Response

**Success (200 OK):**
```json
{
  "response": "Hello! I'm here to help you...",
  "session_id": "unique-session-id"
}
```

**With Lead Submission:**
```json
{
  "response": "Thank you! Your information has been submitted.",
  "session_id": "unique-session-id",
  "lead_submitted": true,
  "message": "Lead has been submitted successfully!"
}
```

### Example: JavaScript/TypeScript

```typescript
interface ChatRequest {
  session_id: string;
  message: string;
  model?: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
  lead_submitted?: boolean;
  message?: string;
}

async function chat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Chat request failed');
  }

  return await response.json();
}

// Usage
const result = await chat({
  session_id: 'user-123',
  message: 'Hello!'
});

console.log(result.response); // AI response
if (result.lead_submitted) {
  console.log('Lead was submitted!');
}
```

## Lead Submission

### Automatic (Via Chat)

Leads are automatically submitted when the AI collects user information during conversation. You don't need to do anything - just check the response for `lead_submitted: true`.

```javascript
const response = await chat({
  session_id: sessionId,
  message: "My name is John Doe, phone: +1234567890"
});

if (response.lead_submitted) {
  // Lead was automatically submitted by AI
  showNotification("Thank you! Your information has been submitted.");
}
```

### Manual (Optional Endpoint)

You can also submit leads directly:

```
POST /api/leads/
```

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "message": "I'm interested in your service"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Lead submitted successfully"
}
```

## Conversation History

### Endpoint
```
GET /api/conversations/<session_id>/
```

### Response

```json
{
  "session_id": "user-123",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "created_at": "2024-01-01T12:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Hi there! How can I help?",
      "created_at": "2024-01-01T12:00:01Z"
    }
  ],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:01Z"
}
```

### Example

```javascript
async function getConversationHistory(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/conversations/${sessionId}/`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversation history');
  }
  
  return await response.json();
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message here"
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Bad Request | Check request body format |
| 404 | Not Found | Verify endpoint URL |
| 500 | Internal Server Error | Check backend logs |

### Error Handling Example

```javascript
async function safeChatRequest(request) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      // Network error
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}
```

## Code Examples

### React Hook Example

```jsx
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8234/api';

function useChatbot() {
  const [sessionId] = useState(() => `user-${Date.now()}-${Math.random()}`);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);

    // Add user message to UI immediately
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Add AI response to UI
      const aiMessage = { 
        role: 'assistant', 
        content: data.response,
        lead_submitted: data.lead_submitted || false
      };
      setMessages(prev => [...prev, aiMessage]);

      // Show notification if lead was submitted
      if (data.lead_submitted) {
        console.log('Lead submitted successfully!');
        // You can trigger a notification here
      }

      return data;
    } catch (err) {
      setError(err.message);
      // Add error message to UI
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        error: true
      }]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversations/${sessionId}/`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })));
      }
    } catch (err) {
      console.error('Failed to load conversation history:', err);
    }
  }, [sessionId]);

  return {
    sessionId,
    messages,
    loading,
    error,
    sendMessage,
    loadHistory
  };
}

// Usage in component
function ChatComponent() {
  const { messages, loading, error, sendMessage, loadHistory } = useChatbot();
  const [input, setInput] = useState('');

  useEffect(() => {
    loadHistory(); // Load conversation history on mount
  }, [loadHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input;
    setInput('');

    try {
      await sendMessage(message);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <span className="role">{msg.role === 'user' ? 'You' : 'AI'}:</span>
            <span className="content">{msg.content}</span>
            {msg.lead_submitted && (
              <span className="badge">✓ Lead Submitted</span>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default ChatComponent;
```

### Vue 3 Composition API Example

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.role]"
      >
        <span class="role">{{ msg.role === 'user' ? 'You' : 'AI' }}:</span>
        <span class="content">{{ msg.content }}</span>
        <span v-if="msg.lead_submitted" class="badge">✓ Lead Submitted</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <input
        v-model="input"
        placeholder="Type your message..."
        :disabled="loading"
      />
      <button type="submit" :disabled="loading || !input.trim()">
        {{ loading ? 'Sending...' : 'Send' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_BASE_URL = 'http://localhost:8234/api';
const sessionId = ref(`user-${Date.now()}-${Math.random()}`);
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const error = ref(null);

const sendMessage = async (message) => {
  loading.value = true;
  error.value = null;

  // Add user message
  messages.value.push({ role: 'user', content: message });

  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId.value,
        message: message
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    const data = await response.json();

    // Add AI response
    messages.value.push({
      role: 'assistant',
      content: data.response,
      lead_submitted: data.lead_submitted || false
    });

    if (data.lead_submitted) {
      console.log('Lead submitted!');
    }
  } catch (err) {
    error.value = err.message;
    messages.value.push({
      role: 'assistant',
      content: `Sorry, I encountered an error: ${err.message}`,
      error: true
    });
  } finally {
    loading.value = false;
  }
};

const loadHistory = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${sessionId.value}/`
    );

    if (response.ok) {
      const data = await response.json();
      messages.value = data.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }
  } catch (err) {
    console.error('Failed to load history:', err);
  }
};

const handleSubmit = () => {
  if (!input.value.trim() || loading.value) return;
  const message = input.value;
  input.value = '';
  sendMessage(message);
};

onMounted(() => {
  loadHistory();
});
</script>
```

### Plain JavaScript Example

```javascript
class Chatbot {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl || 'http://localhost:8234/api';
    this.sessionId = `user-${Date.now()}-${Math.random()}`;
    this.messages = [];
    this.onMessage = null;
    this.onError = null;
    this.onLeadSubmitted = null;
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          message: message
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      const data = await response.json();

      // Add messages to history
      this.messages.push({ role: 'user', content: message });
      this.messages.push({
        role: 'assistant',
        content: data.response,
        lead_submitted: data.lead_submitted || false
      });

      // Trigger callbacks
      if (this.onMessage) {
        this.onMessage(data.response, data);
      }

      if (data.lead_submitted && this.onLeadSubmitted) {
        this.onLeadSubmitted(data);
      }

      return data;
    } catch (error) {
      if (this.onError) {
        this.onError(error);
      }
      throw error;
    }
  }

  async loadHistory() {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/conversations/${this.sessionId}/`
      );

      if (response.ok) {
        const data = await response.json();
        this.messages = data.messages;
        return data.messages;
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
    return [];
  }
}

// Usage
const chatbot = new Chatbot();

chatbot.onMessage = (response, fullData) => {
  console.log('AI:', response);
  // Update UI here
};

chatbot.onLeadSubmitted = (data) => {
  alert('Your information has been submitted!');
  // Show success notification
};

chatbot.onError = (error) => {
  console.error('Error:', error);
  // Show error notification
};

// Send a message
await chatbot.sendMessage('Hello!');
```

## Best Practices

### 1. Session Management

**Generate once per user session:**
```javascript
// Good: Generate once
const sessionId = useMemo(() => `user-${Date.now()}`, []);

// Bad: Generate new ID each time
const sessionId = `user-${Date.now()}`; // Don't do this!
```

**Persist session ID:**
```javascript
// Save to localStorage
const getSessionId = () => {
  let sessionId = localStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = `user-${Date.now()}-${Math.random()}`;
    localStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
};
```

### 2. Error Handling

Always handle errors gracefully:

```javascript
try {
  const response = await chat({ session_id, message });
  // Handle success
} catch (error) {
  // Show user-friendly error message
  showNotification('Sorry, something went wrong. Please try again.');
  // Log error for debugging
  console.error('Chat error:', error);
}
```

### 3. Loading States

Show loading indicators during requests:

```javascript
const [loading, setLoading] = useState(false);

const sendMessage = async (message) => {
  setLoading(true);
  try {
    const response = await chat({ session_id, message });
    return response;
  } finally {
    setLoading(false);
  }
};
```

### 4. Optimistic UI Updates

Add user messages immediately, update with AI response:

```javascript
// Add user message immediately
messages.push({ role: 'user', content: message });

// Then get AI response
const response = await chat({ session_id, message });
messages.push({ role: 'assistant', content: response.response });
```

### 5. Handling Lead Submission

Check for lead submission and show confirmation:

```javascript
const response = await chat({ session_id, message });

if (response.lead_submitted) {
  // Show success message
  showNotification('Thank you! Your information has been submitted.');
  
  // Optionally clear form or redirect
  // clearForm();
}
```

### 6. Rate Limiting

Implement client-side rate limiting if needed:

```javascript
let lastRequestTime = 0;
const MIN_DELAY = 500; // 500ms between requests

const sendMessage = async (message) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_DELAY) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_DELAY - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return await chat({ session_id, message });
};
```

### 7. Retry Logic

Implement retry for failed requests:

```javascript
async function chatWithRetry(request, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await chat(request);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 8. TypeScript Types

```typescript
// types.ts
export interface ChatRequest {
  session_id: string;
  message: string;
  model?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  lead_submitted?: boolean;
  message?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationHistory {
  session_id: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}
```

## CORS Configuration

If you get CORS errors, make sure your frontend URL is in the backend's `CORS_ALLOWED_ORIGINS`:

```python
# In backend config/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # React default
    "http://localhost:5173",    # Vite default
    "https://your-frontend-domain.com"
]
```

## Testing

### Test Chat

```javascript
// Test basic chat
const response = await chat({
  session_id: 'test-123',
  message: 'Hello, test message'
});
console.log('Response:', response.response);
```

### Test Lead Submission

```javascript
// The AI should automatically submit lead when it collects info
// You can test by providing contact details:
const response = await chat({
  session_id: 'test-123',
  message: 'My name is John Doe and my phone is +1234567890'
});

if (response.lead_submitted) {
  console.log('✓ Lead submission works!');
}
```

## Production Checklist

- [ ] Update `API_BASE_URL` to production URL
- [ ] Add production URL to backend `CORS_ALLOWED_ORIGINS`
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test lead submission flow
- [ ] Handle session persistence
- [ ] Add retry logic for failed requests
- [ ] Implement rate limiting if needed
- [ ] Add user-friendly error messages

## Support

For issues or questions:
- Check backend logs
- Verify API endpoint URLs
- Ensure CORS is configured correctly
- Test with `curl` first to verify backend works

