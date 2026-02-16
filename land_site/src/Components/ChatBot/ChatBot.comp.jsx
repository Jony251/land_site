import { useState, useRef, useEffect } from 'react';
import './ChatBot.comp.css';
import { sendChatMessageMock } from './chatService';
import CatAvatar from './CatAvatar';
import { useI18n } from '../../i18n/LanguageProvider';
import { useSiteCopy } from '../../i18n/siteCopy';

const ChatBot = () => {
  const { lang } = useI18n();
  const sc = useSiteCopy();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: sc('chatbot.welcome'), sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].sender !== 'bot') return prev;
      return [{ ...prev[0], text: sc('chatbot.welcome') }];
    });
  }, [sc]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1️⃣ Создаем сообщение пользователя
    const userMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    // 2️⃣ Добавляем сообщение пользователя в историю
    setMessages(prev => [...prev, userMessage]);
    
    // 3️⃣ Очищаем поле ввода
    setInputValue('');
    
    // 4️⃣ Показываем индикатор "бот печатает..."
    setIsTyping(true);

    try {
      // 5️⃣ ВАРИАНТ 1: Использование MOCK данных (для тестирования без backend)
      const response = await sendChatMessageMock(userMessage.text, lang);
      
      // 6️⃣ ВАРИАНТ 2: Использование реального API (раскомментируйте когда backend готов)
      // const response = await sendChatMessage(userMessage.text);

      // 7️⃣ Проверяем успешность ответа
      if (response.success) {
        // 8️⃣ Создаем сообщение бота из ответа API
        const botResponse = {
          text: response.message,
          sender: "bot",
          timestamp: new Date(response.timestamp)
        };
        
        // 9️⃣ Добавляем ответ бота в историю
        setMessages(prev => [...prev, botResponse]);
      } else {
        const errorMessage = {
          text: response.message || sc('chatbot.genericError'),
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // ⚠️ Обработка неожиданных ошибок
      console.error('Ошибка при отправке сообщения:', error);
      const errorMessage = {
        text: sc('chatbot.fallbackError'),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // ✅ Убираем индикатор печати в любом случае
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    const locale = lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label={sc('chatbot.toggle')}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <CatAvatar isVisible={!isOpen} />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" ref={chatWindowRef}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <CatAvatar isVisible={isOpen} chatRef={chatWindowRef} />
              </div>
              <div>
                <h3>{sc('chatbot.title')}</h3>
                <span className="chat-status">{sc('chatbot.online')}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder={sc('chatbot.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputValue.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
