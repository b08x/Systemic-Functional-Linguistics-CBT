
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
    message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === 'model' || message.role === 'system-intro';

    const wrapperClasses = isModel ? 'justify-start' : 'justify-end';
    const bubbleClasses = isModel 
        ? 'bg-[#333e48] text-gray-200' 
        : 'bg-[#c36e26] text-white';
    
    const isTyping = message.text === '...';

    const formatText = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-[#e2a32d]">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={`flex items-end gap-2 ${wrapperClasses}`}>
             {isModel && <div className="w-8 h-8 rounded-full bg-[#e2a32d]/20 flex items-center justify-center text-[#e2a32d] font-bold text-xs flex-shrink-0">AI</div>}
            <div className={`max-w-md lg:max-w-xl px-4 py-2 rounded-lg shadow ${bubbleClasses}`}>
                 {isTyping ? (
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 bg-[#95aac0] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-[#95aac0] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-[#95aac0] rounded-full animate-bounce"></span>
                    </div>
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{formatText(message.text)}</p>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
