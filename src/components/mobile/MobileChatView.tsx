'use client';

import { useRef, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Smile } from 'lucide-react';
import { useChatStore, Message } from '@/store/chatStore';
import { chatRooms, getCharacter, CharacterId, ChatId } from '@/lib/characters';
import { getApiUrl } from '@/lib/api-config';
import Image from 'next/image';
import { useState } from 'react';

/**
 * Parse and render markdown-style text formatting
 * Supports: **bold**, *italic*, ~~strikethrough~~, __underline__
 */
function formatMessageContent(content: string): ReactNode {
    if (!content) return null;

    const parts: ReactNode[] = [];
    let remaining = content;
    let key = 0;

    const patterns: { regex: RegExp; render: (text: string) => ReactNode }[] = [
        { regex: /\*\*(.+?)\*\*/, render: (t) => <strong key={key++} className="font-bold">{t}</strong> },
        { regex: /~~(.+?)~~/, render: (t) => <del key={key++} className="line-through">{t}</del> },
        { regex: /__(.+?)__/, render: (t) => <u key={key++} className="underline">{t}</u> },
        { regex: /\*(.+?)\*/, render: (t) => <em key={key++} className="italic">{t}</em> },
    ];

    while (remaining.length > 0) {
        let earliestMatch: { index: number; length: number; rendered: ReactNode } | null = null;

        for (const { regex, render } of patterns) {
            const match = remaining.match(regex);
            if (match && match.index !== undefined) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                    earliestMatch = { index: match.index, length: match[0].length, rendered: render(match[1]) };
                }
            }
        }

        if (earliestMatch) {
            if (earliestMatch.index > 0) parts.push(remaining.substring(0, earliestMatch.index));
            parts.push(earliestMatch.rendered);
            remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
        } else {
            parts.push(remaining);
            break;
        }
    }

    return parts.length > 0 ? parts : content;
}

interface MobileChatViewProps {
    chatId: ChatId;
    onBack: () => void;
}

interface ChatResponse {
    characterId: CharacterId;
    content: string;
    isReaction: boolean;
}

// Quick emoji options for mobile
const quickEmojis = ['🌸', '❤️', '😊', '😂', '🥺', '✨', '💕', '👍', '(◕‿◕)', '(*´▽`*)'];

export function MobileChatView({ chatId, onBack }: MobileChatViewProps) {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { messages, addMessage, setLoading, isLoading, setTypingCharacters, typingCharacters } = useChatStore();
    const chatMessages = messages[chatId] || [];
    const loading = isLoading[chatId] || false;
    const typing = typingCharacters || [];

    const room = chatRooms.find(r => r.id === chatId);
    const isGroup = chatId === 'group';
    const character = !isGroup ? getCharacter(chatId as CharacterId) : null;

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, typing]);

    const handleSend = useCallback(async () => {
        if (!message.trim() || loading) return;

        const content = message.trim();
        setMessage('');

        // Add user message
        addMessage({
            chatId,
            role: 'user',
            content,
        });

        setLoading(chatId, true);

        // Show typing indicator
        if (isGroup) {
            setTypingCharacters(['miku', 'yotsuba']);
        } else {
            setTypingCharacters([chatId as CharacterId]);
        }

        try {
            const response = await fetch(getApiUrl('/api/chat'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    message: content,
                    history: chatMessages.slice(-10).map(m => ({
                        role: m.role,
                        content: m.content,
                        characterId: m.characterId,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setTypingCharacters([]);

            if (data.responses && Array.isArray(data.responses)) {
                for (const resp of data.responses as ChatResponse[]) {
                    if (data.type === 'group' && data.responses.indexOf(resp) > 0) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                    addMessage({
                        chatId,
                        role: 'assistant',
                        content: resp.content,
                        characterId: resp.characterId,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setTypingCharacters([]);
            addMessage({
                chatId,
                role: 'assistant',
                content: 'Sorry, I couldn\'t process that message. Please try again!',
                characterId: isGroup ? 'yotsuba' : chatId as CharacterId,
            });
        } finally {
            setLoading(chatId, false);
        }
    }, [message, loading, chatId, isGroup, chatMessages, addMessage, setLoading, setTypingCharacters]);

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <header className="flex items-center gap-3 p-3 pt-[calc(0.75rem+env(safe-area-inset-top))] border-b border-sakura-200/30 bg-white/90">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-sakura-600 hover:bg-sakura-50 rounded-full"
                >
                    <ArrowLeft size={22} />
                </button>

                {/* Avatar */}
                {character ? (
                    <div
                        className="w-10 h-10 rounded-full overflow-hidden"
                        style={{ border: `2px solid ${character.color}` }}
                    >
                        <Image
                            src={character.profilePic}
                            alt={character.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sakura-400">
                        <Image
                            src="/Asset/NakanoRoom/NakanoRoomChatPic.jpg"
                            alt="Nakano Room"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">{room?.name}</h2>
                    <p className="text-xs text-gray-500">
                        {typing.length > 0
                            ? `${typing.map(id => getCharacter(id).name).join(', ')} typing...`
                            : room?.description
                        }
                    </p>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <AnimatePresence>
                    {chatMessages.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center justify-center h-full text-center pt-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-6xl mb-4">{room?.emoji}</span>
                            <p className="text-gray-500 mb-2">No messages yet</p>
                            <p className="text-sm text-gray-400">
                                Say hello to {isGroup ? 'the Nakano sisters' : room?.name}!
                            </p>
                        </motion.div>
                    ) : (
                        chatMessages.map((msg, i) => (
                            <MobileMessageBubble key={msg.id} message={msg} index={i} />
                        ))
                    )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {typing.length > 0 && (
                        <motion.div
                            className="flex items-center gap-2 px-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* First typing character's avatar */}
                            <div
                                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                                style={{ border: `2px solid ${getCharacter(typing[0]).color}` }}
                            >
                                <Image
                                    src={getCharacter(typing[0]).profilePic}
                                    alt={getCharacter(typing[0]).name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                                <div className="typing-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-sakura-200/30 bg-white/90">
                {/* Emoji picker row */}
                <AnimatePresence>
                    {showEmojiPicker && (
                        <motion.div
                            className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {quickEmojis.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setMessage(prev => prev + emoji);
                                        inputRef.current?.focus();
                                    }}
                                    className="flex-shrink-0 px-3 py-1.5 bg-sakura-50 hover:bg-sakura-100 rounded-full text-sm transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${showEmojiPicker ? 'text-sakura-600 bg-sakura-100' : 'text-sakura-400'
                            }`}
                    >
                        <Smile size={22} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        onFocus={() => setShowEmojiPicker(false)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sakura-300"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || loading}
                        className="flex items-center justify-center w-10 h-10 bg-sakura-500 text-white rounded-full disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function MobileMessageBubble({ message, index }: { message: Message; index: number }) {
    const isUser = message.role === 'user';
    const character = message.characterId ? getCharacter(message.characterId) : null;

    return (
        <motion.div
            className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
        >
            {/* Avatar - only for character */}
            {!isUser && character && (
                <div
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: `2px solid ${character.color}` }}
                >
                    <Image
                        src={character.profilePic}
                        alt={character.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                {!isUser && character && (
                    <span className="text-xs font-medium mb-0.5 px-1" style={{ color: character.color }}>
                        {character.name}
                    </span>
                )}
                <div
                    className={`rounded-2xl px-3 py-2 text-sm ${isUser
                        ? 'bg-sakura-500 text-white rounded-br-sm'
                        : 'bg-white shadow-sm rounded-bl-sm'
                        }`}
                    style={!isUser && character ? { borderLeft: `3px solid ${character.color}` } : undefined}
                >
                    {formatMessageContent(message.content)}
                </div>
            </div>
        </motion.div>
    );
}
