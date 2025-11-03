/**
 * Chat Service - Сервис для работы с Chat API
 * 
 * Этот файл содержит функции для взаимодействия с backend API
 */

// Конфигурация API
const API_CONFIG = {
  baseURL: 'https://your-backend-api.com', // Замените на ваш URL
  endpoints: {
    sendMessage: '/api/chat/message',
    getHistory: '/api/chat/history',
    createSession: '/api/chat/session'
  },
  timeout: 10000 // 10 секунд
};

/**
 * Отправка сообщения в чат
 * 
 * @param {string} message - Текст сообщения от пользователя
 * @param {string} sessionId - ID сессии чата (опционально)
 * @returns {Promise<Object>} Ответ от бота
 * 
 * Пример использования:
 * const response = await sendChatMessage("Привет!", "session-123");
 */
export const sendChatMessage = async (message, sessionId = null) => {
  try {
    // 1. Подготовка данных для отправки
    const requestBody = {
      message: message,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      // Дополнительные поля при необходимости:
      userId: localStorage.getItem('userId') || null,
      language: 'ru'
    };

    console.log('📤 Отправка запроса:', requestBody);

    // 2. Отправка POST запроса к API
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendMessage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Если требуется авторизация:
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(requestBody),
      // Таймаут для запроса
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });

    // 3. Проверка статуса ответа
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // 4. Парсинг JSON ответа
    const data = await response.json();
    
    console.log('📥 Получен ответ:', data);

    // 5. Возврат обработанных данных
    return {
      success: true,
      message: data.response || data.message,
      sessionId: data.sessionId,
      timestamp: data.timestamp || new Date().toISOString(),
      metadata: data.metadata || {}
    };

  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения:', error);

    // Обработка различных типов ошибок
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Timeout',
        message: 'Превышено время ожидания ответа от сервера'
      };
    }

    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'NetworkError',
        message: 'Проблема с подключением к серверу'
      };
    }

    return {
      success: false,
      error: error.name,
      message: 'Произошла ошибка при отправке сообщения'
    };
  }
};

/**
 * Получение истории чата
 * 
 * @param {string} sessionId - ID сессии
 * @returns {Promise<Array>} Массив сообщений
 */
export const getChatHistory = async (sessionId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getHistory}?sessionId=${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.messages || [];

  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    return [];
  }
};

/**
 * Создание новой сессии чата
 * 
 * @returns {Promise<string>} ID новой сессии
 */
export const createChatSession = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createSession}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.sessionId;

  } catch (error) {
    console.error('Ошибка при создании сессии:', error);
    // Генерируем локальный ID если API недоступен
    return `local-${Date.now()}`;
  }
};

/**
 * MOCK функция для тестирования без backend
 * Имитирует задержку и возвращает случайный ответ
 */
export const sendChatMessageMock = async (message) => {
  // Имитация задержки сети (500-1500ms)
  const delay = Math.random() * 1000 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Примеры ответов
  const mockResponses = [
    "Спасибо за ваше сообщение! Чем могу помочь?",
    "Интересный вопрос! Позвольте мне подумать...",
    "Я здесь, чтобы помочь вам с любыми вопросами!",
    "Отличный вопрос! Вот что я могу вам сказать...",
    `Вы написали: "${message}". Как я могу помочь с этим?`
  ];

  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

  return {
    success: true,
    message: randomResponse,
    sessionId: 'mock-session-123',
    timestamp: new Date().toISOString()
  };
};

// Экспорт конфигурации для возможности изменения
export { API_CONFIG };
