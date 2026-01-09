'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { chatRooms, getCharacter, CharacterId, ChatId } from '@/lib/characters';
import { useChatStore } from '@/store/chatStore';
import { MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface MobileChatListProps {
    onSelectChat: (chatId: ChatId) => void;
}

export function MobileChatList({ onSelectChat }: MobileChatListProps) {
    const [openMenuId, setOpenMenuId] = useState<ChatId | null>(null);
    const clearChat = useChatStore((state) => state.clearChat);

    const handleClearChat = (e: React.MouseEvent, chatId: ChatId) => {
        e.stopPropagation();
        clearChat(chatId);
        setOpenMenuId(null);
    };

    const toggleMenu = (e: React.MouseEvent, chatId: ChatId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === chatId ? null : chatId);
    };

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <header className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-sakura-200/30 bg-white/90">
                <h1 className="font-display text-xl font-bold text-sakura-600 flex items-center gap-2">
                    <span>🌸</span>
                    五等分の花嫁
                    <span className="text-sm font-normal text-sakura-400">Chat</span>
                </h1>
            </header>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chatRooms.map((room, index) => {
                    const isGroup = room.id === 'group';
                    const character = !isGroup ? getCharacter(room.id as CharacterId) : null;

                    return (
                        <motion.div
                            key={room.id}
                            className="relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => onSelectChat(room.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sakura-50/50 active:bg-sakura-100/50 border-b border-gray-100 transition-colors"
                            >
                                {/* Avatar */}
                                {character ? (
                                    <div
                                        className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                                        style={{ border: `2px solid ${character.color}` }}
                                    >
                                        <Image
                                            src={character.profilePic}
                                            alt={character.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-sakura-400">
                                        <Image
                                            src="/Asset/NakanoRoom/NakanoRoomChatPic.jpg"
                                            alt="Nakano Room"
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800 truncate">
                                            {room.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {room.description}
                                    </p>
                                </div>

                                {/* More button */}
                                <div
                                    onClick={(e) => toggleMenu(e, room.id)}
                                    className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                >
                                    <MoreVertical size={18} className="text-gray-400" />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {openMenuId === room.id && (
                                    <motion.div
                                        className="absolute right-4 top-12 z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <button
                                            onClick={(e) => handleClearChat(e, room.id)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors w-full"
                                        >
                                            <Trash2 size={16} />
                                            <span className="text-sm">Clear Chat</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Click outside to close menu */}
            {openMenuId && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpenMenuId(null)}
                />
            )}
        </div>
    );
}

