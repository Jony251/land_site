# API Usage Examples

This document provides practical examples for using the AI chatbot backend API.

## Base URL

All examples use `http://localhost:8000/api` as the base URL. Update this for production.

## 1. Health Check

**Endpoint:** `GET /api/health/`

Check if the backend is running.

```bash
curl http://localhost:8000/api/health/
```

**Response:**
```json
{
  "status": "ok",
  "message": "AI Chatbot backend is running"
}
```

---

## 2. Chat with AI

**Endpoint:** `POST /api/chat/`

Send a message to the chatbot and get an AI response.

### JavaScript Example

```javascript
async function chatWithAI(sessionId, message) {
  const response = await fetch('http://localhost:8000/api/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      model: 'gpt-4'  // optional, defaults to gpt-4
    })
  });
  
  const data = await response.json();
  console.log('AI Response:', data.response);
  return data.response;
}

// Usage
chatWithAI('user-session-123', 'Hello, what can you help me with?');
```

### cURL Example

```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-123",
    "message": "What is your purpose?",
    "model": "gpt-4"
  }'
```

**Response:**
```json
{
  "response": "I'm an AI assistant designed to help you...",
  "session_id": "user-123"
}
```

### React Example

```jsx
import React, { useState } from 'react';

function ChatComponent() {
  const [sessionId] = useState(() => `user-${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userMessage = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });

      const data = await response.json();
      
      // Add AI response to UI
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error.' 
      }]);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.role === 'user' ? 'You: ' : 'AI: '}
            {msg.content}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatComponent;
```

---

## 3. Submit a Lead

**Endpoint:** `POST /api/leads/`

Submit lead information (e.g., contact form submission).

### JavaScript Example

```javascript
async function submitLead(leadData) {
  const response = await fetch('http://localhost:8000/api/leads/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData)
  });
  
  const data = await response.json();
  console.log('Lead submitted:', data);
  return data;
}

// Usage
submitLead({
  name: 'John Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  message: 'I would like to learn more about your services'
});
```

### cURL Example

```bash
curl -X POST http://localhost:8000/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "message": "I am interested in your product"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Lead submitted successfully"
}
```

### React Form Example

```jsx
import React, { useState } from 'react';

function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const response = await fetch('http://localhost:8000/api/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setStatus(data.message);
      
      // Reset form
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      setStatus('Error submitting lead');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
      />
      <button type="submit">Submit</button>
      {status && <p>{status}</p>}
    </form>
  );
}

export default LeadForm;
```

---

## 4. Get Conversation History

**Endpoint:** `GET /api/conversations/<session_id>/`

Retrieve all messages in a conversation.

### JavaScript Example

```javascript
async function getConversationHistory(sessionId) {
  const response = await fetch(`http://localhost:8000/api/conversations/${sessionId}/`);
  const data = await response.json();
  return data;
}

// Usage
const history = await getConversationHistory('user-123');
console.log('Messages:', history.messages);
```

### cURL Example

```bash
curl http://localhost:8000/api/conversations/user-123/
```

**Response:**
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
      "content": "Hi! How can I help you today?",
      "created_at": "2024-01-01T12:00:01Z"
    },
    {
      "role": "user",
      "content": "What can you do?",
      "created_at": "2024-01-01T12:00:30Z"
    },
    {
      "role": "assistant",
      "content": "I can answer questions, help with tasks...",
      "created_at": "2024-01-01T12:00:31Z"
    }
  ],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:31Z"
}
```

---

## 5. Test Telegram Integration

**Endpoint:** `POST /api/test/telegram/`

Send a test message to verify Telegram integration.

### JavaScript Example

```javascript
async function testTelegram(customMessage) {
  const response = await fetch('http://localhost:8000/api/test/telegram/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: customMessage || 'Test message'
    })
  });
  
  const data = await response.json();
  console.log('Test result:', data);
  return data;
}

// Usage
testTelegram('Hello from my app!');
```

### cURL Example

```bash
curl -X POST http://localhost:8000/api/test/telegram/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing integration"}'
```

**Response:**
```json
{
  "status": "success",
  "message": "Test message sent to Telegram"
}
```

---

## Error Handling

All endpoints may return error responses. Here's how to handle them:

### Example Error Response

```json
{
  "error": "Configuration error. Please check your environment variables."
}
```

### JavaScript Error Handling

```javascript
async function safeApiCall(endpoint, options) {
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Usage
try {
  const result = await safeApiCall('http://localhost:8000/api/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: 'test-123',
      message: 'Hello'
    })
  });
  console.log('Success:', result);
} catch (error) {
  alert('Error: ' + error.message);
}
```

---

## CORS Considerations

If you're calling the API from a frontend application, make sure:

1. Your frontend URL is added to `CORS_ALLOWED_ORIGINS` in `config/settings.py`
2. You're using the correct protocol (http/https)
3. You're using the correct port

Example:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourdomain.com",  # Add your production URL
]
```

---

## Production Tips

1. **Always use HTTPS in production**
2. **Store API base URL in environment variables**
3. **Implement rate limiting on the frontend**
4. **Add loading states and error handling**
5. **Use proper session management**
6. **Sanitize user input before sending**

