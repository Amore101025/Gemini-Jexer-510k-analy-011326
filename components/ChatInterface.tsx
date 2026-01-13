import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { PainterStyle, ChatMessage, Language } from '../types';
import { chatWithContext } from '../services/geminiService';

interface ChatProps {
    style: PainterStyle;
    lang: Language;
    contextData: any;
}

const ChatInterface: React.FC<ChatProps> = ({ style, lang, contextData }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', content: lang === 'en' ? 'Hello! I am ready to answer questions about this 510(k).' : '你好！我準備好回答有關此 510(k) 的問題。', timestamp: new Date() }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const responseText = await chatWithContext(input, contextData);
            const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full rounded-2xl border border-white/20 shadow-xl overflow-hidden ${style.cardBg}`}>
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <Bot className={style.accentColor} size={20} />
                <h3 className={`font-semibold ${style.textColor}`}>{lang === 'en' ? 'Contextual Chat' : '上下文對話'}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-teal-600 text-white rounded-br-none' 
                            : 'bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-bl-none ' + style.textColor
                        }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                                {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                                <span>{msg.role === 'user' ? 'You' : 'Agent'}</span>
                            </div>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/50 dark:bg-black/50 p-3 rounded-2xl rounded-bl-none">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={lang === 'en' ? "Ask about indications, risks..." : "詢問適應症，風險..."}
                        className="flex-1 bg-white/40 dark:bg-black/40 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button 
                        onClick={handleSend}
                        className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;