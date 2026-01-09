'use client';

import { motion } from 'motion/react';
import { chatRooms, getCharacter, CharacterId, ChatId } from '@/lib/characters';
import Image from 'next/image';

interface MobileChatListProps {
    onSelectChat: (chatId: ChatId) => void;
}

export function MobileChatList({ onSelectChat }: MobileChatListProps) {
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
                        <motion.button
                            key={room.id}
                            onClick={() => onSelectChat(room.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sakura-50/50 active:bg-sakura-100/50 border-b border-gray-100 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
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
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sakura-200 to-sakura-400 flex items-center justify-center text-xl flex-shrink-0">
                                    🌸
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {room.name}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        {/* Can add timestamp here later */}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {room.description}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
