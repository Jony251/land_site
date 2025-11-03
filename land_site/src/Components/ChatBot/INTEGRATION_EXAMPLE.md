# 🚀 Примеры интеграции с различными Backend API

## 1️⃣ Простой REST API

### Backend (Node.js + Express)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Эндпоинт для обработки сообщений
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    console.log('Получено сообщение:', message);
    
    // Здесь ваша логика обработки (AI, база данных и т.д.)
    const botResponse = `Вы написали: "${message}". Это ответ от сервера!`;
    
    res.json({
      success: true,
      message: botResponse,
      sessionId: sessionId || 'new-session-' + Date.now(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка на сервере',
      error: error.message
    });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
```

### Frontend (chatService.js)

```javascript
// Обновите API_CONFIG
const API_CONFIG = {
  baseURL: 'http://localhost:3001',
  endpoints: {
    sendMessage: '/api/chat/message'
  }
};
```

---

## 2️⃣ OpenAI ChatGPT Integration

### Backend (Node.js)

```javascript
// server.js
const express = require('express');
const OpenAI = require('openai');
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Вызов OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ты полезный ассистент для сайта Blue Cat."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });
    
    const botResponse = completion.choices[0].message.content;
    
    res.json({
      success: true,
      message: botResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обращении к AI'
    });
  }
});

app.listen(3001);
```

---

## 3️⃣ Firebase Realtime Database

### Frontend (chatService.js)

```javascript
import { getDatabase, ref, push, onValue } from 'firebase/database';

export const sendChatMessageFirebase = async (message, sessionId) => {
  try {
    const db = getDatabase();
    const messagesRef = ref(db, `chats/${sessionId}/messages`);
    
    // Отправка сообщения пользователя
    await push(messagesRef, {
      text: message,
      sender: 'user',
      timestamp: Date.now()
    });
    
    // Здесь можно вызвать Cloud Function для генерации ответа
    // или использовать Firebase ML Kit
    
    return {
      success: true,
      message: 'Сообщение отправлено',
      sessionId: sessionId
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка Firebase'
    };
  }
};
```

---

## 4️⃣ WebSocket для реального времени

### Backend (Node.js + Socket.io)

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Пользователь подключен:', socket.id);
  
  // Получение сообщения от клиента
  socket.on('chat-message', async (data) => {
    console.log('Получено:', data.message);
    
    // Имитация обработки (замените на реальную логику)
    setTimeout(() => {
      socket.emit('bot-response', {
        message: `Ответ на: "${data.message}"`,
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
  
  socket.on('disconnect', () => {
    console.log('Пользователь отключен');
  });
});

server.listen(3001);
```

### Frontend (chatService.js)

```javascript
import io from 'socket.io-client';

let socket = null;

export const initializeWebSocket = () => {
  socket = io('http://localhost:3001');
  
  socket.on('connect', () => {
    console.log('WebSocket подключен');
  });
  
  return socket;
};

export const sendChatMessageWebSocket = (message, onResponse) => {
  if (!socket) {
    socket = initializeWebSocket();
  }
  
  // Отправка сообщения
  socket.emit('chat-message', {
    message: message,
    timestamp: new Date().toISOString()
  });
  
  // Получение ответа
  socket.once('bot-response', (data) => {
    onResponse({
      success: true,
      message: data.message,
      timestamp: data.timestamp
    });
  });
};
```

---

## 5️⃣ Python Flask Backend

### Backend (Python)

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    try:
        data = request.get_json()
        message = data.get('message')
        
        # Ваша логика обработки
        bot_response = f"Вы написали: {message}"
        
        return jsonify({
            'success': True,
            'message': bot_response,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Ошибка сервера',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
```

---

## 6️⃣ Пример с аутентификацией (JWT)

### Frontend (chatService.js)

```javascript
// Получение токена из localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const sendChatMessageAuth = async (message) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Пользователь не авторизован');
    }
    
    const response = await fetch(`${API_CONFIG.baseURL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // JWT токен
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.status === 401) {
      // Токен истек - перенаправить на логин
      window.location.href = '/login';
      return;
    }
    
    const data = await response.json();
    return {
      success: true,
      message: data.response
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка авторизации'
    };
  }
};
```

---

## 🎯 Быстрый старт для тестирования

### Вариант 1: Используйте MOCK (уже работает)

```javascript
// В ChatBot.comp.jsx уже настроено:
const response = await sendChatMessageMock(userMessage.text);
```

### Вариант 2: Локальный сервер за 2 минуты

1. Создайте файл `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat/message', (req, res) => {
  res.json({
    success: true,
    message: `Получено: "${req.body.message}"`,
    timestamp: new Date().toISOString()
  });
});

app.listen(3001, () => console.log('Server on :3001'));
```

2. Установите зависимости:
```bash
npm install express cors
```

3. Запустите:
```bash
node server.js
```

4. В `chatService.js` измените URL:
```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:3001',
  // ...
};
```

5. В `ChatBot.comp.jsx` раскомментируйте:
```javascript
const response = await sendChatMessage(userMessage.text);
```

---

## 📝 Checklist для продакшена

- [ ] Настроить CORS правильно (не использовать `*`)
- [ ] Добавить rate limiting (ограничение запросов)
- [ ] Реализовать логирование
- [ ] Добавить валидацию входных данных
- [ ] Настроить HTTPS
- [ ] Добавить мониторинг ошибок (Sentry)
- [ ] Реализовать retry логику
- [ ] Добавить кеширование ответов
- [ ] Настроить переменные окружения
- [ ] Провести нагрузочное тестирование
