

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ChatMessage } from '../../types';
import { SendIcon } from '../icons';
import { format } from 'date-fns';

const ConversationList: React.FC = () => {
    const { users, currentUser, activeChatUserId, setActiveChatUserId, messages } = useApp();
    
    const conversations = useMemo(() => {
        if (!currentUser) return [];
        const correspondedUserIds = new Set<string>();
        messages.forEach(msg => {
            if (msg.senderId === currentUser.id) correspondedUserIds.add(msg.receiverId);
            if (msg.receiverId === currentUser.id) correspondedUserIds.add(msg.senderId);
        });
        return Array.from(correspondedUserIds)
            .map(id => users.find(u => u.id === id))
            .filter((u): u is User => !!u);
    }, [users, currentUser, messages]);
    
    return (
        <div className="w-1/3 bg-bits-light-dark border-r border-bits-medium-dark">
            <div className="p-4 border-b border-bits-medium-dark">
                <h2 className="text-xl font-bold">Chats</h2>
            </div>
            <div className="overflow-y-auto">
                {conversations.map(user => (
                    <div
                        key={user.id}
                        onClick={() => setActiveChatUserId(user.id)}
                        className={`flex items-center p-4 cursor-pointer hover:bg-bits-medium-dark ${activeChatUserId === user.id ? 'bg-bits-red/20' : ''}`}
                    >
                        <img src={user.profile.avatar} alt={user.profile.name} className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-semibold text-bits-text">{user.profile.name}</p>
                            <p className="text-sm text-bits-text-muted">@{user.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ChatWindow: React.FC = () => {
    const { activeChatUserId, findUserById, currentUser, messages, setMessages } = useApp();
    const [newMessage, setNewMessage] = useState('');
    const chatPartner = findUserById(activeChatUserId || '');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages, activeChatUserId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !activeChatUserId) return;
        
        const message: ChatMessage = {
            id: `m${Date.now()}`,
            senderId: currentUser.id,
            receiverId: activeChatUserId,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    if (!activeChatUserId || !chatPartner || !currentUser) {
        return (
            <div className="w-2/3 flex items-center justify-center">
                <p className="text-bits-text-muted">Select a conversation to start chatting.</p>
            </div>
        );
    }
    
    const conversationMessages = messages.filter(
        msg => (msg.senderId === currentUser.id && msg.receiverId === activeChatUserId) ||
               (msg.senderId === activeChatUserId && msg.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return (
        <div className="w-2/3 flex flex-col h-full">
            <div className="p-4 border-b border-bits-medium-dark flex items-center">
                <img src={chatPartner.profile.avatar} alt={chatPartner.profile.name} className="w-10 h-10 rounded-full mr-3" />
                <h3 className="font-bold text-lg">{chatPartner.profile.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {conversationMessages.map(msg => (
                    <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-md ${msg.senderId === currentUser.id ? 'bg-bits-red text-white' : 'bg-bits-medium-dark text-bits-text'}`}>
                           <p>{msg.text}</p>
                           <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-white/70' : 'text-bits-text-muted'}`}>{format(new Date(msg.timestamp), 'p')}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-bits-medium-dark">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-bits-medium-dark rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-bits-red"
                    />
                    <button type="submit" className="bg-bits-red p-3 rounded-full text-white hover:bg-red-700 transition-colors">
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}

export const ChatPage: React.FC = () => {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] border-t border-bits-medium-dark">
        <ConversationList />
        <ChatWindow />
    </div>
  );
};