'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChatStore, useActiveChat, useCurrentMessages, useTypingCharacters } from '@/store/chatStore';
import { MessageBubble, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { chatRooms, CharacterId } from '@/lib/characters';

interface ChatResponse {
    characterId: CharacterId;
    content: string;
    isReaction: boolean;
}

export function ChatWindow() {
    const activeChat = useActiveChat();
    const messages = useCurrentMessages();
    const typingCharacters = useTypingCharacters();
    const { addMessage, setLoading, setTypingCharacters } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentRoom = chatRooms.find(r => r.id === activeChat);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingCharacters]);

    const handleSendMessage = useCallback(async (content: string) => {
        // Add user message
        addMessage({
            chatId: activeChat,
            role: 'user',
            content,
        });

        setLoading(activeChat, true);

        // Show typing indicator for expected responders
        if (activeChat === 'group') {
            // For group chat, we don't know who will respond yet
            setTypingCharacters(['miku', 'yotsuba']); // placeholder
        } else {
            setTypingCharacters([activeChat as CharacterId]);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: activeChat,
                    message: content,
                    history: messages.slice(-10).map(m => ({
                        role: m.role,
                        content: m.content,
                        characterId: m.characterId,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            setTypingCharacters([]);

            // Add character responses
            if (data.responses && Array.isArray(data.responses)) {
                for (const resp of data.responses as ChatResponse[]) {
                    // Small delay between messages in group chat
                    if (data.type === 'group' && data.responses.indexOf(resp) > 0) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    addMessage({
                        chatId: activeChat,
                        role: 'assistant',
                        content: resp.content,
                        characterId: resp.characterId,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setTypingCharacters([]);

            // Add error message
            addMessage({
                chatId: activeChat,
                role: 'assistant',
                content: 'Sorry, I couldn\'t process that message. Please try again!',
                characterId: activeChat === 'group' ? 'yotsuba' : activeChat as CharacterId,
            });
        } finally {
            setLoading(activeChat, false);
        }
    }, [activeChat, messages, addMessage, setLoading, setTypingCharacters]);

    return (
        <div className="flex-1 h-full flex flex-col glass-panel overflow-hidden">
            {/* Chat Header */}
            <header className="p-4 border-b border-sakura-200/30 bg-white/30">
                <motion.div
                    className="flex items-center gap-3"
                    key={activeChat}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <span className="text-2xl">{currentRoom?.emoji}</span>
                    <div>
                        <h2 className="font-display font-bold text-lg text-gray-800">
                            {currentRoom?.name}
                        </h2>
                        <p className="text-xs text-gray-500">{currentRoom?.description}</p>
                    </div>
                </motion.div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center justify-center h-full text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-6xl mb-4">{currentRoom?.emoji}</span>
                            <p className="text-gray-500 mb-2">No messages yet</p>
                            <p className="text-sm text-gray-400">
                                Say hello to {activeChat === 'group' ? 'the Nakano sisters' : currentRoom?.name}!
                            </p>
                        </motion.div>
                    ) : (
                        messages.map((message, index) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                index={index}
                            />
                        ))
                    )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {typingCharacters.length > 0 && (
                        <TypingIndicator characters={typingCharacters} />
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
}
