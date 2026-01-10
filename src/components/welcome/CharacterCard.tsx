'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Character } from '@/lib/characters';

interface CharacterCardProps {
    character: Character;
    index: number;
}

export function CharacterCard({ character, index }: CharacterCardProps) {
    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {/* Glow effect behind card */}
            <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ backgroundColor: character.color + '40' }}
            />

            {/* Card */}
            <motion.div
                className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-lg border-2 overflow-hidden"
                style={{ borderColor: character.color + '60' }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Corner ribbon with character emoji */}
                <div
                    className="absolute -top-1 -right-1 w-10 h-10 lg:w-12 lg:h-12 flex items-end justify-start pl-2 pb-2 text-sm lg:text-lg"
                    style={{
                        background: `linear-gradient(135deg, transparent 50%, ${character.color} 50%)`,
                    }}
                />

                {/* Profile image */}
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2 lg:mb-3">
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: character.color }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                        }}
                    />
                    <div
                        className="relative w-full h-full rounded-full overflow-hidden border-2 lg:border-3"
                        style={{ borderColor: character.color }}
                    >
                        <Image
                            src={character.profilePic}
                            alt={character.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Name */}
                <h3
                    className="text-center font-bold text-base lg:text-lg mb-1"
                    style={{ color: character.color }}
                >
                    {character.name}
                </h3>

                {/* Description */}
                <p className="text-center text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {character.traits[0]}
                </p>

                {/* Character trait badge */}
                <motion.div
                    className="mt-2 lg:mt-3 px-2 lg:px-3 py-1 rounded-full text-xs font-medium text-center text-white"
                    style={{ backgroundColor: character.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.15, type: 'spring' }}
                >
                    {getCharacterTrait(character.id)}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function getCharacterTrait(id: string): string {
    const traits: Record<string, string> = {
        ichika: '🎭 The Actress',
        nino: '🦋 The Chef',
        miku: '🎧 The Historian',
        yotsuba: '🍀 The Helper',
        itsuki: '⭐ The Foodie',
    };
    return traits[id] || '💕 Sister';
}
