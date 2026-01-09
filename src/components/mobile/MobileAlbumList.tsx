'use client';

import { motion } from 'motion/react';
import { characters, CharacterId } from '@/lib/characters';
import Image from 'next/image';

export type AlbumId = CharacterId | 'nakano-memories';

interface MobileAlbumListProps {
    onSelectCharacter: (albumId: AlbumId) => void;
}

export function MobileAlbumList({ onSelectCharacter }: MobileAlbumListProps) {
    const characterList = Object.values(characters);

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <header className="p-4 border-b border-sakura-200/30 bg-white/90">
                <h1 className="font-display text-xl font-bold text-sakura-600 flex items-center gap-2">
                    <span>📸</span>
                    Album
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Tap a character to view their gallery
                </p>
            </header>

            {/* Character Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                    {characterList.map((char, index) => (
                        <motion.button
                            key={char.id}
                            onClick={() => onSelectCharacter(char.id)}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-lg active:scale-95 transition-transform"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                border: `3px solid ${char.color}`,
                                boxShadow: `0 4px 20px ${char.color}40`
                            }}
                        >
                            <Image
                                src={char.profilePic}
                                alt={char.name}
                                fill
                                className="object-cover"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                                <p className="font-display font-bold text-white text-lg">
                                    {char.name}
                                </p>
                                <p className="text-white/70 text-xs">
                                    {char.japaneseName}
                                </p>
                            </div>

                            {/* Emoji badge */}
                            <div
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                style={{ backgroundColor: `${char.color}` }}
                            >
                                {char.emoji}
                            </div>
                        </motion.button>
                    ))}

                    {/* Nakano Memories Card */}
                    <motion.button
                        onClick={() => onSelectCharacter('nakano-memories')}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-lg active:scale-95 transition-transform"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: characterList.length * 0.1 }}
                        style={{
                            border: '3px solid #F472B6',
                            boxShadow: '0 4px 20px rgba(244, 114, 182, 0.4)'
                        }}
                    >
                        <Image
                            src="/Asset/NakanoRoom/NakanoRoom.jpg"
                            alt="Nakano Memories"
                            fill
                            className="object-cover"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                            <p className="font-display font-bold text-white text-lg">
                                Nakano Memories
                            </p>
                            <p className="text-white/70 text-xs">
                                五等分の花嫁
                            </p>
                        </div>

                        {/* Emoji badge */}
                        <div
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: '#F472B6' }}
                        >
                            🌸
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

