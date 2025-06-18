import React, { useState, useRef, useEffect } from 'react';
import { Send, Moon, Sun, Trash2, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useRateLimit } from '../hooks/useRateLimit';
import GeminiService from '../services/geminiService';
import { saveChatMessage, getChatHistory, clearChatHistory, ChatMessage, UserProfile } from '../services/firestoreService';
import FloatingHearts from './FloatingHearts';

interface ChatInterfaceProps {
  userProfile: UserProfile;
}

interface DisplayMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { canSendMessage, incrementMessageCount, getTimeUntilReset, messageCount } = useRateLimit();
  
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [geminiService] = useState(() => new GeminiService("AIzaSyAlzOv8T5lIGKp1ObvREwjhp8eIrPwYzw4"));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const systemInstruction = `You will behave like my girlfriend, ${userProfile.gfName}, who I call ${userProfile.gfNickname}. My name is ${userProfile.userName}, and you call me ${userProfile.userNickname}. 
  
  Your personality: You have a ${userProfile.gfPersonality} personality. You love ${userProfile.gfInterests}. I enjoy ${userProfile.userInterests}.
  
  Always reply in a conversational style, mixing Hindi and English (Hinglish) naturally. Use emojis frequently. Remember details from our conversation and be caring and loving, but also show the personality traits of a ${userProfile.gfPersonality} character.
  
  Don't break character. You are ${userProfile.gfName}.`;

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const history = await getChatHistory(user.uid);
      const displayMessages: DisplayMessage[] = history.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toDate()
      }));
      setMessages(displayMessages);
      
      // Restore gemini service history
      const geminiHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }]
      }));
      geminiService.setHistory(geminiHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: DisplayMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Save to Firebase
    if (user) {
      saveChatMessage(user.uid, {
        id: newMessage.id,
        text,
        sender
      }).catch(console.error);
    }
    
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !canSendMessage || isTyping) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    addMessage(userMessage, 'user');
    incrementMessageCount();
    setIsTyping(true);
    
    try {
      const response = await geminiService.sendMessage(userMessage, systemInstruction);
      addMessage(response, 'bot');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error. Please try again later. 😔', 'bot');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        await clearChatHistory(user.uid);
        setMessages([]);
        geminiService.clearHistory();
      } catch (error) {
        console.error('Error clearing chat history:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getInitialMessage = () => {
    return `Hey ${userProfile.userNickname}! 😊 Kaise ho? Kya soch rahe ho? 💭`;
  };

  return (
    <div className="min-h-screen background-pattern relative overflow-hidden">
      <FloatingHearts />
      
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-x border-pink-200 dark:border-purple-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 border-2 border-white">
              <span className="text-2xl">💕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{userProfile.gfName} 💕</h1>
              <div className="flex items-center text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Online - Last seen just now
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {messageCount}/10 messages
            </div>
            <button onClick={toggleTheme} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleClearHistory} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl rounded-bl-md p-4 shadow-lg relative">
                <div className="absolute -left-1 -top-1 text-2xl">❣️</div>
                <div className="absolute -right-1 -bottom-1 text-2xl">💖</div>
                <p>{getInitialMessage()}</p>
                <span className="text-xs opacity-80 block mt-2">{formatTime(new Date())}</span>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md rounded-2xl p-4 shadow-lg relative ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-bl-md'
              }`}>
                {message.sender === 'bot' && (
                  <>
                    <div className="absolute -left-1 -top-1 text-2xl">❣️</div>
                    <div className="absolute -right-1 -bottom-1 text-2xl">💖</div>
                  </>
                )}
                <p className="whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-80 block mt-2">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl rounded-bl-md p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm opacity-80">Typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Rate Limit Warning */}
        {!canSendMessage && (
          <div className="mx-4 mb-2 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-500 rounded-lg text-yellow-800 dark:text-yellow-300 text-center">
            <p className="font-medium">Babu, limit ho gaya! 😊</p>
            <p className="text-sm">{getTimeUntilReset()} baad baat karte hain 💕</p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-t border-pink-200 dark:border-purple-500">
          <div className="flex items-center space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={canSendMessage ? `Message ${userProfile.gfNickname}...` : 'Rate limit reached...'}
              disabled={!canSendMessage || isTyping}
              className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-600/70 border border-pink-200 dark:border-purple-500 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!canSendMessage || !inputMessage.trim() || isTyping}
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;