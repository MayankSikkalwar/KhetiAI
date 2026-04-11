import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  MessageSquare,
  X,
  Minimize2,
  Globe,
  Loader2,
  Square,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { useChat } from '../../../context/ChatContext';

export function VoiceAssistant() {
  const { isChatOpen: isOpen, toggleChat } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! I am Kheti-AI Sahayak. How can I help you today?',
      contentHi: 'नमस्ते! मैं खेती-AI सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
  ];

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Set recognition language when toggle changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'hi-IN';
    }
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (language === 'en') {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    } else {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hiVoice) utterance.voice = hiVoice;
    }

    utterance.pitch = 1.0;
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isThinking) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, language })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
        if (autoSpeak) {
          speak(data.response);
        }
      } else {
        const errorMessage = data.error || 'Sorry, I encountered an error. Please try again.';
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Check your internet or backend status.' }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => toggleChat(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 transition-all hover:scale-110 z-50 group"
      >
        <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 w-[400px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all overflow-hidden border border-green-100",
      isMinimized ? "h-16" : "h-[600px]"
    )}>
      {/* Header */}
      <div className="bg-green-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Kheti-AI Sahayak</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-100 uppercase tracking-wider font-semibold">Online Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(o => !o)}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Globe className="w-3 h-3" />
              {LANGUAGES.find(l => l.id === language)?.label}
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isLangOpen && "rotate-180")} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl shadow-black/10 border border-green-50 overflow-hidden z-50 min-w-[110px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => { setLanguage(lang.id); setIsLangOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-green-50",
                      language === lang.id
                        ? "text-green-700 bg-green-50/80 font-bold"
                        : "text-green-900/70"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1 rounded">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={() => toggleChat(false)} className="hover:bg-white/20 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50/30">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user'
                    ? "bg-green-600 text-white rounded-tr-none"
                    : "bg-white text-green-950 shadow-sm border border-green-100 rounded-tl-none"
                )}>
                  {msg.role === 'assistant' && language === 'hi' && msg.contentHi ? msg.contentHi : msg.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-green-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Controls & Input */}
          <div className="p-4 bg-white border-t border-green-100">
            <div className="flex items-center gap-2 mb-3 px-1">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all",
                  autoSpeak ? "bg-green-100 border-green-200 text-green-700" : "bg-gray-100 border-gray-200 text-gray-500"
                )}
              >
                {autoSpeak ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                Voice Answer: {autoSpeak ? 'On' : 'Off'}
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 text-[10px] text-red-600 animate-pulse font-bold uppercase hover:bg-red-50 px-2 py-1 rounded-full border border-red-100 transition-all"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  Stop Speaking
                </button>
              )}
            </div>

            <div className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'en' ? "Ask anything about farming..." : "खेती के बारे में कुछ भी पूछें..."}
                  className="w-full pl-4 pr-10 py-3 bg-green-50 border border-green-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
                <button
                  onClick={toggleListening}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                    isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-green-100 text-green-600 hover:bg-green-200"
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isThinking}
                className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-400 transition-all shadow-lg active:scale-95"
              >
                {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
