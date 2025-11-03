# ChatBot Component

## Overview
A modern, responsive chatbot component positioned in the bottom-right corner of the page.

## Features
- ✅ Toggle open/close animation
- ✅ Message history with timestamps
- ✅ Typing indicator
- ✅ Auto-scroll to latest message
- ✅ Responsive design
- ✅ Accessible (ARIA labels)
- ⏳ Backend integration (TODO)

## Backend Integration

### Current Implementation
The component currently uses a mock response with `setTimeout`. See line 40-48 in `ChatBot.comp.jsx`:

```javascript
// TODO: Replace with actual backend API call
setTimeout(() => {
  const botResponse = {
    text: "Thank you for your message! This is a demo response. Backend integration coming soon.",
    sender: "bot",
    timestamp: new Date()
  };
  setMessages(prev => [...prev, botResponse]);
  setIsTyping(false);
}, 1000);
```

### How to Integrate Backend

Replace the `setTimeout` block with an actual API call:

```javascript
const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  const userMessage = {
    text: inputValue,
    sender: "user",
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    // Replace with your actual API endpoint
    const response = await fetch('YOUR_BACKEND_URL/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage.text,
        // Add any other required fields (user ID, session ID, etc.)
      }),
    });

    const data = await response.json();

    const botResponse = {
      text: data.response, // Adjust based on your API response structure
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
  } catch (error) {
    console.error('Error sending message:', error);
    const errorResponse = {
      text: "Sorry, I'm having trouble connecting. Please try again later.",
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorResponse]);
  } finally {
    setIsTyping(false);
  }
};
```

### Expected Backend API Format

**Request:**
```json
{
  "message": "User's message text",
  "userId": "optional-user-id",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "Bot's response text",
  "timestamp": "2024-11-02T12:00:00Z"
}
```

## Customization

### Colors
Edit `ChatBot.comp.css` to change the color scheme:
- Primary color: `#646cff`
- Hover color: `#4a4fcf`
- Close button: `#ff6b6b`

### Position
Change position in `.chatbot-container`:
```css
.chatbot-container {
  bottom: 20px;  /* Distance from bottom */
  right: 20px;   /* Distance from right */
}
```

### Size
Adjust chat window dimensions in `.chat-window`:
```css
.chat-window {
  width: 380px;   /* Window width */
  height: 550px;  /* Window height */
}
```

## Usage

The component is automatically included in `App.jsx` and appears on all pages.

To remove from specific pages, conditionally render based on route.
