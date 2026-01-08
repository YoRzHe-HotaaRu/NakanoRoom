'use client';

import { motion } from 'motion/react';
import { useChatStore } from '@/store/chatStore';
import { chatRooms, ChatId } from '@/lib/characters';

export function ChatSidebar() {
    const { activeChat, setActiveChat } = useChatStore();

    return (
        <aside className="w-72 h-full glass-panel flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-sakura-200/30">
                <motion.h1
                    className="font-display text-xl font-bold text-sakura-700 flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-2xl">🌸</span>
                    五等分の花嫁
                    <span className="text-sm font-normal text-sakura-500">Chat</span>
                </motion.h1>
            </div>

            {/* Chat List */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {chatRooms.map((room, index) => (
                    <ChatItem
                        key={room.id}
                        id={room.id}
                        name={room.name}
                        emoji={room.emoji}
                        description={room.description}
                        colorClass={room.colorClass}
                        isActive={activeChat === room.id}
                        onClick={() => setActiveChat(room.id)}
                        index={index}
                    />
                ))}
            </nav>

            {/* Footer decoration */}
            <div className="p-4 border-t border-sakura-200/30 text-center">
                <p className="text-xs text-sakura-400">
                    ✨ Nakano Quintuplets ✨
                </p>
            </div>
        </aside>
    );
}

interface ChatItemProps {
    id: ChatId;
    name: string;
    emoji: string;
    description: string;
    colorClass: string;
    isActive: boolean;
    onClick: () => void;
    index: number;
}

function ChatItem({
    name,
    emoji,
    description,
    colorClass,
    isActive,
    onClick,
    index
}: ChatItemProps) {
    return (
        <motion.button
            className={`chat-item w-full ${colorClass} ${isActive ? 'active' : ''}`}
            onClick={onClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="text-2xl">{emoji}</span>
            <div className="flex-1 text-left">
                <p className="font-medium text-gray-800">{name}</p>
                <p className="text-xs text-gray-500 truncate">{description}</p>
            </div>
            {isActive && (
                <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}
        </motion.button>
    );
}
