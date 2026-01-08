'use client';

import { motion } from 'motion/react';
import { Message } from '@/store/chatStore';
import { getCharacter, CharacterId } from '@/lib/characters';
import { useMemo } from 'react';

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const character = message.characterId ? getCharacter(message.characterId) : null;

    const formattedTime = useMemo(() => {
        return new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }, [message.timestamp]);

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: 'spring',
                stiffness: 500,
                damping: 40
            }}
        >
            {/* Avatar for character messages */}
            {!isUser && character && (
                <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    style={{ '--character-color': character.color } as React.CSSProperties}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                        style={{
                            background: `linear-gradient(135deg, ${character.color}40, ${character.color}20)`,
                            border: `2px solid ${character.color}`
                        }}
                    >
                        {character.emoji}
                    </div>
                </motion.div>
            )}

            {/* Message content */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {/* Character name */}
                {!isUser && character && (
                    <span
                        className="text-xs font-medium mb-1 px-1"
                        style={{ color: character.color }}
                    >
                        {character.name}
                    </span>
                )}

                {/* Bubble */}
                <motion.div
                    className={isUser ? 'message-user' : 'message-character'}
                    style={!isUser && character ? {
                        borderLeft: `3px solid ${character.color}`,
                    } : undefined}
                    whileHover={{ scale: 1.01 }}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </p>
                </motion.div>

                {/* Timestamp */}
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formattedTime}
                </span>
            </div>

            {/* User avatar placeholder */}
            {isUser && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    You
                </div>
            )}
        </motion.div>
    );
}

// Typing indicator component
interface TypingIndicatorProps {
    characters: CharacterId[];
}

export function TypingIndicator({ characters }: TypingIndicatorProps) {
    if (characters.length === 0) return null;

    const displayNames = characters.map(id => getCharacter(id).name).join(', ');

    return (
        <motion.div
            className="flex items-center gap-3 px-4 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <div className="typing-dots">
                <span />
                <span />
                <span />
            </div>
            <span className="text-xs text-gray-500">
                {displayNames} {characters.length === 1 ? 'is' : 'are'} typing...
            </span>
        </motion.div>
    );
}
