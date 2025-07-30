
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage as ChatMessageType, ChatRole } from '../types';
import ChatMessage from './ChatMessage';
import Spinner from './Spinner';

interface ChatInterfaceProps {
    topic: string | null;
    fileContext: { name: string, content: string } | null;
    onFileContextChange: (name: string, content: string) => void;
    onClearContext: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ topic, fileContext, onFileContextChange, onClearContext }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const initializeChat = useCallback(async () => {
        setError(null);
        setMessages([]);
        setLoading(true);
        try {
            const newChat = createChatSession(topic ?? undefined, fileContext?.content);
            setChat(newChat);

            if (topic || fileContext) {
                const response = await newChat.sendMessage({ message: "OK" }); 
                const modelMessage: ChatMessageType = { id: 'intro-model', role: 'model', text: response.text };
                setMessages([modelMessage]);
            } else {
                setMessages([{ id: 'intro-system', role: 'system-intro', text: "Hello! I'm your SFL assistant. Select a topic from the left or upload a document to begin our chat." }]);
            }

        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to initialize chat session.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [topic, fileContext]);
    
    useEffect(() => {
        initializeChat();
    }, [initializeChat]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || loading) return;

        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await chat.sendMessage({ message: currentInput });
            const modelMessage: ChatMessageType = { id: Date.now().toString() + 'm', role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id)); 
            setUserInput(currentInput);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileContextChange(file.name, content);
            };
            reader.readAsText(file);
        }
        // Reset file input value to allow re-uploading the same file
        if (event.target) {
            event.target.value = '';
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    }

    return (
        <div className="bg-[#333e48] rounded-xl shadow-2xl border border-[#5c6f7e] flex flex-col h-[75vh]">
            <div className="p-4 border-b border-[#5c6f7e] flex justify-between items-center flex-shrink-0">
                 <h2 className="text-xl font-bold text-gray-200">SFL AI Assistant</h2>
                 <button onClick={onClearContext} title="Reset Chat" className="text-sm px-3 py-1 bg-[#5c6f7e] hover:bg-[#95aac0] rounded-md transition-colors">&times; New Chat</button>
            </div>
            
            {fileContext && (
                <div className="p-2 px-4 bg-[#5c6f7e]/30 text-xs text-[#95aac0] flex justify-between items-center flex-shrink-0">
                    <span>Context: <span className="font-medium text-[#e2a32d]">{fileContext.name}</span></span>
                </div>
            )}
            
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                {loading && messages.length > 0 && <ChatMessage key="loading" message={{id: 'loading', role: 'model', text: '...'}} />}
                {loading && messages.length === 0 && (
                     <div className="flex justify-center items-center h-full"><Spinner size="lg"/></div>
                )}
                 {error && <div className="p-3 my-2 text-sm text-red-300 bg-red-600/20 rounded-md border border-red-600/50">{error}</div>}
            </div>

            <div className="p-4 border-t border-[#5c6f7e] flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.js,.ts,.jsx,.tsx,.py,.java,.html,.css,.json, .cs, .go, .php, .rb" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-[#95aac0] hover:text-[#e2a32d] transition-colors flex-shrink-0" aria-label="Upload file" title="Upload file">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question or paste text..."
                        className="w-full max-h-32 p-2 bg-[#212934] border-2 border-[#5c6f7e] rounded-md focus:ring-2 focus:ring-[#e2a32d] focus:border-[#e2a32d] transition duration-200 text-gray-200 resize-y"
                        rows={1}
                        disabled={loading}
                        aria-label="Chat input"
                    />
                    <button type="submit" disabled={loading || !userInput.trim()} className="p-2 text-[#95aac0] hover:text-[#e2a32d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0" aria-label="Send message" title="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;