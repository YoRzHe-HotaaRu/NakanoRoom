'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useActiveChat } from '@/store/chatStore';
import { getCharacter, characters, CharacterId } from '@/lib/characters';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Group chat slideshow images (from public folder)
const groupSlideImages = [
    '/Asset/NakanoRoom/NakanoRoom.jpg',
    '/Asset/NakanoRoom/NakanoRoom2.jpg',
    '/Asset/NakanoRoom/NakanoRoom3.jpg',
    '/Asset/NakanoRoom/NakanoRoom4.jpg',
    '/Asset/NakanoRoom/NakanoRoom5.jpg',
    '/Asset/NakanoRoom/NakanoRoom6.jpg',
    '/Asset/NakanoRoom/NakanoRoom7.jpg',
    '/Asset/NakanoRoom/NakanoRoom8.jpg',
    '/Asset/NakanoRoom/NakanoRoom9.png',
    '/Asset/NakanoRoom/NakanoRoom10.jpg',
];

// Individual character slideshow images
const characterSlideImages: Partial<Record<CharacterId, string[]>> = {
    ichika: [
        '/Asset/Ichika/Ichika1.jpg',
        '/Asset/Ichika/Ichika2.jpg',
        '/Asset/Ichika/Ichika3.jpg',
        '/Asset/Ichika/Ichika4.jpg',
        '/Asset/Ichika/Ichika5.jpg',
        '/Asset/Ichika/Ichika6.jpg',
        '/Asset/Ichika/Ichika7.jpg',
        '/Asset/Ichika/Ichika8.jpg',
        '/Asset/Ichika/Ichika9.jpg',
        '/Asset/Ichika/Ichika10.jpg',
        '/Asset/Ichika/Ichika11.jpg',
    ],
    nino: [
        '/Asset/Nino/Nino1.jpg',
        '/Asset/Nino/Nino2.jpg',
        '/Asset/Nino/Nino3.jpg',
        '/Asset/Nino/Nino4.jpg',
        '/Asset/Nino/Nino5.jpg',
        '/Asset/Nino/Nino6.jpg',
        '/Asset/Nino/Nino7.jpg',
        '/Asset/Nino/Nino8.jpg',
        '/Asset/Nino/Nino9.jpg',
        '/Asset/Nino/Nino10.jpg',
    ],
    miku: [
        '/Asset/Miku/Miku1.jpg',
        '/Asset/Miku/Miku2.jpg',
        '/Asset/Miku/Miku3.jpg',
        '/Asset/Miku/Miku4.jpg',
        '/Asset/Miku/Miku5.jpg',
        '/Asset/Miku/Miku6.jpg',
        '/Asset/Miku/Miku7.jpg',
        '/Asset/Miku/Miku8.jpg',
        '/Asset/Miku/Miku9.jpg',
        '/Asset/Miku/Miku10.jpg',
    ],
    yotsuba: [
        '/Asset/Yotsuba/Yotsuba1.jpg',
        '/Asset/Yotsuba/Yotsuba2.jpg',
        '/Asset/Yotsuba/Yotsuba3.jpg',
        '/Asset/Yotsuba/Yotsuba4.jpg',
        '/Asset/Yotsuba/Yotsuba5.jpg',
        '/Asset/Yotsuba/Yotsuba6.jpg',
        '/Asset/Yotsuba/Yotsuba7.jpg',
        '/Asset/Yotsuba/Yotsuba8.jpg',
        '/Asset/Yotsuba/Yotsuba9.jpg',
        '/Asset/Yotsuba/Yotsuba10.jpg',
        '/Asset/Yotsuba/Yotsuba11.jpg',
        '/Asset/Yotsuba/Yotsuba12.jpg',
        '/Asset/Yotsuba/Yotsuba13.jpg',
        '/Asset/Yotsuba/Yotsuba14.jpg',
        '/Asset/Yotsuba/Yotsuba15.jpg',
    ],
    itsuki: [
        '/Asset/Itsuki/Itsuki1.jpg',
        '/Asset/Itsuki/Itsuki2.jpg',
        '/Asset/Itsuki/Itsuki3.jpg',
        '/Asset/Itsuki/Itsuki4.jpg',
        '/Asset/Itsuki/Itsuki5.jpg',
        '/Asset/Itsuki/Itsuki6.jpg',
        '/Asset/Itsuki/Itsuki7.jpg',
        '/Asset/Itsuki/Itsuki8.jpg',
        '/Asset/Itsuki/Itsuki9.jpg',
        '/Asset/Itsuki/Itsuki10.jpg',
        '/Asset/Itsuki/Itsuki11.jpg',
        '/Asset/Itsuki/Itsuki12.jpg',
        '/Asset/Itsuki/Itsuki13.jpg',
        '/Asset/Itsuki/Itsuki14.jpg',
        '/Asset/Itsuki/Itsuki15.jpg',
        '/Asset/Itsuki/Itsuki16.jpg',
    ],
};

export function CharacterPanel() {
    const activeChat = useActiveChat();

    const isGroup = activeChat === 'group';
    const character = !isGroup ? getCharacter(activeChat as CharacterId) : null;

    // Check if this character has a slideshow
    const hasSlideshow = !isGroup && characterSlideImages[activeChat as CharacterId];

    return (
        <aside className="w-72 h-full glass-panel flex flex-col overflow-hidden relative">
            {/* Background glow effect */}
            <div
                className="character-glow transition-colors duration-500"
                style={{
                    '--character-color': character?.color || '#FF6B8A'
                } as React.CSSProperties}
            />

            {/* Header */}
            <div className="p-3 border-b border-sakura-200/30 relative z-10">
                <h3 className="font-display font-bold text-sakura-600 text-center text-sm">
                    {isGroup ? '五つ子' : character?.japaneseName}
                </h3>
                <p className="text-[10px] text-gray-500 text-center">
                    {isGroup ? 'The Quintuplets' : character?.name}
                </p>
            </div>

            {/* Character Display */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-3 overflow-hidden">
                <AnimatePresence mode="wait">
                    {isGroup ? (
                        <ImageSlideshow key="group" images={groupSlideImages} />
                    ) : hasSlideshow ? (
                        <ImageSlideshow
                            key={activeChat}
                            images={characterSlideImages[activeChat as CharacterId]!}
                        />
                    ) : (
                        <CharacterFallback key={activeChat} character={character} />
                    )}
                </AnimatePresence>
            </div>

            {/* Character Info */}
            {!isGroup && character && (
                <motion.div
                    className="p-3 border-t border-sakura-200/30 relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-wrap gap-1 justify-center">
                        {character.traits.slice(0, 3).map((trait, i) => (
                            <span
                                key={i}
                                className="text-[9px] px-2 py-0.5 rounded-full"
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

// Reusable slideshow component for both group and individual chats
function ImageSlideshow({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <AnimatePresence mode="sync">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Slideshow image ${currentIndex + 1}`}
                        fill
                        className="object-cover rounded-xl"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                            ? 'bg-white w-4'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>

            {/* Gradient overlay for dots visibility */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent rounded-b-xl pointer-events-none" />
        </div>
    );
}

// Fallback for characters without slideshows - shows single image or placeholder
function CharacterFallback({ character }: { character: ReturnType<typeof getCharacter> | null }) {
    const [imageError, setImageError] = useState(false);

    if (!character) return null;

    if (imageError) {
        return <CharacterPlaceholder character={character} />;
    }

    return (
        <motion.div
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
        >
            <Image
                src={character.imageUrl}
                alt={character.name}
                fill
                className="object-contain drop-shadow-lg"
                onError={() => setImageError(true)}
                priority
            />
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
            className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
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
