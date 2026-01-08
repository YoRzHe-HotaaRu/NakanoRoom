'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useActiveChat } from '@/store/chatStore';
import { getCharacter, characters, ChatId, CharacterId } from '@/lib/characters';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function CharacterPanel() {
    const activeChat = useActiveChat();
    const [imageError, setImageError] = useState<Record<string, boolean>>({});

    const isGroup = activeChat === 'group';
    const character = !isGroup ? getCharacter(activeChat as CharacterId) : null;

    // Reset error state when character changes
    useEffect(() => {
        setImageError({});
    }, [activeChat]);

    return (
        <aside className="w-80 h-full glass-panel flex flex-col overflow-hidden relative">
            {/* Background glow effect */}
            <div
                className="character-glow transition-colors duration-500"
                style={{
                    '--character-color': character?.color || '#FF6B8A'
                } as React.CSSProperties}
            />

            {/* Header */}
            <div className="p-4 border-b border-sakura-200/30 relative z-10">
                <h3 className="font-display font-bold text-sakura-600 text-center">
                    {isGroup ? '五つ子' : character?.japaneseName}
                </h3>
                <p className="text-xs text-gray-500 text-center">
                    {isGroup ? 'The Quintuplets' : character?.name}
                </p>
            </div>

            {/* Character Display */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {isGroup ? (
                        <GroupDisplay key="group" />
                    ) : (
                        <motion.div
                            key={activeChat}
                            className="relative w-full h-full flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {character && !imageError[character.id] ? (
                                <Image
                                    src={character.imageUrl}
                                    alt={character.name}
                                    fill
                                    className="object-contain drop-shadow-lg"
                                    onError={() => setImageError(prev => ({ ...prev, [character.id]: true }))}
                                    priority
                                />
                            ) : (
                                <CharacterPlaceholder character={character} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Character Info */}
            {!isGroup && character && (
                <motion.div
                    className="p-4 border-t border-sakura-200/30 relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-wrap gap-1 justify-center">
                        {character.traits.slice(0, 3).map((trait, i) => (
                            <span
                                key={i}
                                className="text-[10px] px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: `${character.color}20`,
                                    color: character.color,
                                    border: `1px solid ${character.color}40`
                                }}
                            >
                                {trait}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Decorative elements */}
            <SakuraPetals />
        </aside>
    );
}

function GroupDisplay() {
    const allCharacters = Object.values(characters);

    return (
        <motion.div
            className="grid grid-cols-3 gap-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {allCharacters.map((char, index) => (
                <motion.div
                    key={char.id}
                    className="aspect-square rounded-xl overflow-hidden relative"
                    style={{
                        background: `linear-gradient(135deg, ${char.color}30, ${char.color}10)`,
                        border: `2px solid ${char.color}50`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        {char.emoji}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-1 px-2">
                        <p className="text-[10px] font-medium text-center truncate" style={{ color: char.color }}>
                            {char.name}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

interface CharacterPlaceholderProps {
    character: ReturnType<typeof getCharacter> | null;
}

function CharacterPlaceholder({ character }: CharacterPlaceholderProps) {
    if (!character) return null;

    return (
        <div
            className="w-48 h-48 rounded-full flex items-center justify-center text-8xl"
            style={{
                background: `linear-gradient(135deg, ${character.color}40, ${character.color}20)`,
                border: `4px solid ${character.color}`,
                boxShadow: `0 0 40px ${character.color}40`,
            }}
        >
            {character.emoji}
        </div>
    );
}

function SakuraPetals() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="sakura-petal"
                    style={{
                        left: `${20 + i * 15}%`,
                        animationDelay: `${i * 2}s`,
                    }}
                    animate={{
                        y: ['0%', '100vh'],
                        x: [0, Math.sin(i) * 30],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 1.5,
                    }}
                />
            ))}
        </div>
    );
}
