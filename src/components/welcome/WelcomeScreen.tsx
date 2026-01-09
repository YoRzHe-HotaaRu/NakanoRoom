'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SakuraPetals } from './SakuraPetals';
import { CharacterCard } from './CharacterCard';
import { GateTransition } from './GateTransition';
import { characters, Character } from '@/lib/characters';
import Image from 'next/image';

interface WelcomeScreenProps {
    onEnter: () => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
    const [isGateOpen, setIsGateOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Stagger content appearance
    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleEnter = () => {
        setIsGateOpen(true);
    };

    const handleTransitionComplete = () => {
        // Store that user has seen welcome
        localStorage.setItem('hasSeenWelcome', 'true');
        onEnter();
    };

    return (
        <GateTransition isOpen={isGateOpen} onTransitionComplete={handleTransitionComplete}>
            <AnimatePresence>
                {!isGateOpen && (
                    <motion.div
                        className="fixed inset-0 z-[200] overflow-hidden"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-sakura-50" />

                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 2px 2px, #FF6B8A 1px, transparent 0)`,
                                    backgroundSize: '40px 40px',
                                }}
                                animate={{ x: [0, 40], y: [0, 40] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>

                        {/* Sakura petals */}
                        <SakuraPetals count={30} />

                        {/* Content container - scrollable on mobile, fit viewport on desktop */}
                        <div className="relative z-20 h-full overflow-y-auto md:overflow-hidden">
                            <div className="min-h-full md:h-full flex flex-col items-center justify-start md:justify-center px-4 py-6 md:py-6">

                                {/* Hero Section */}
                                <AnimatePresence>
                                    {showContent && (
                                        <motion.div
                                            className="text-center mb-5 md:mb-10"
                                            initial={{ opacity: 0, y: -30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        >
                                            {/* Logo/Icon */}
                                            <motion.div
                                                className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-3 rounded-full overflow-hidden border-3 md:border-4 border-sakura-300 shadow-lg"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                            >
                                                <Image
                                                    src="/Asset/NakanoRoom/NakanoRoomChatPic.jpg"
                                                    alt="Nakano Room"
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>

                                            {/* Title */}
                                            <motion.h1
                                                className="text-2xl md:text-5xl font-display font-bold mb-1 md:mb-2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <span className="text-sakura-500">🌸</span>
                                                <span className="bg-gradient-to-r from-sakura-500 via-pink-500 to-sakura-600 bg-clip-text text-transparent">
                                                    {' '}五等分の花嫁{' '}
                                                </span>
                                                <span className="text-sakura-500">🌸</span>
                                            </motion.h1>

                                            <motion.p
                                                className="text-base md:text-xl text-sakura-400 font-medium"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                Chat with the Quintuplets!
                                            </motion.p>

                                            <motion.p
                                                className="text-sm text-gray-500 mt-2 max-w-md mx-auto"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                Welcome to Nakano Room – your cozy corner to hang out with the five adorable Nakano sisters!
                                            </motion.p>

                                            {/* Mobile-only Enter button - shown at top */}
                                            <motion.button
                                                onClick={handleEnter}
                                                className="md:hidden mt-4 px-6 py-3 bg-gradient-to-r from-sakura-400 via-pink-500 to-sakura-500 text-white font-bold text-base rounded-full shadow-lg"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.9 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Enter the Nakano Room →
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Meet the Sisters */}
                                <AnimatePresence>
                                    {showContent && (
                                        <motion.div
                                            className="w-full max-w-5xl mb-4 md:mb-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <motion.h2
                                                className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-5"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                Meet the Nakano Sisters 💕
                                            </motion.h2>

                                            {/* Character grid - custom layout for mobile */}
                                            {/* Desktop: 5 columns */}
                                            <div className="hidden md:grid md:grid-cols-5 gap-4 px-2">
                                                {Object.values(characters).map((char: Character, index: number) => (
                                                    <CharacterCard key={char.id} character={char} index={index} />
                                                ))}
                                            </div>

                                            {/* Mobile: 1 centered + 2x2 grid */}
                                            <div className="md:hidden px-2">
                                                {/* First row - 1 centered card */}
                                                <div className="flex justify-center mb-3">
                                                    <div className="w-[45%]">
                                                        <CharacterCard character={Object.values(characters)[0]} index={0} />
                                                    </div>
                                                </div>
                                                {/* Second row - 2 cards */}
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <CharacterCard character={Object.values(characters)[1]} index={1} />
                                                    <CharacterCard character={Object.values(characters)[2]} index={2} />
                                                </div>
                                                {/* Third row - 2 cards */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <CharacterCard character={Object.values(characters)[3]} index={3} />
                                                    <CharacterCard character={Object.values(characters)[4]} index={4} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Features Section */}
                                <AnimatePresence>
                                    {showContent && (
                                        <motion.div
                                            className="w-full max-w-3xl mb-4 md:mb-6"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.5 }}
                                        >
                                            <h2 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3 md:mb-4">
                                                Features ✨
                                            </h2>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { icon: '💬', title: 'Chat', desc: 'Talk with each sister' },
                                                    { icon: '👥', title: 'Group', desc: 'Chat with all five!' },
                                                    { icon: '@', title: 'Mention', desc: 'Tag specific sisters' },
                                                    { icon: '😊', title: 'Emoji', desc: 'Cute kaomoji included' },
                                                ].map((feature, i) => (
                                                    <motion.div
                                                        key={feature.title}
                                                        className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-sakura-100"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 1.6 + i * 0.1 }}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                    >
                                                        <div className="text-2xl mb-1">{feature.icon}</div>
                                                        <div className="font-semibold text-gray-700 text-sm">{feature.title}</div>
                                                        <div className="text-xs text-gray-500">{feature.desc}</div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Enter Button - desktop only (mobile has button at top) */}
                                <AnimatePresence>
                                    {showContent && (
                                        <motion.div
                                            className="hidden md:block mt-2 mb-4"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 2, type: 'spring', stiffness: 200 }}
                                        >
                                            <motion.button
                                                onClick={handleEnter}
                                                className="relative px-8 py-4 bg-gradient-to-r from-sakura-400 via-pink-500 to-sakura-500 text-white font-bold text-lg rounded-full shadow-lg overflow-hidden group"
                                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 138, 0.4)' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                                />

                                                {/* Button text */}
                                                <span className="relative flex items-center gap-2">
                                                    <span>Enter the Nakano Room</span>
                                                    <motion.span
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        →
                                                    </motion.span>
                                                </span>
                                            </motion.button>

                                            <motion.p
                                                className="text-center text-xs text-gray-400 mt-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 2.3 }}
                                            >
                                                Click to open the doors 🚪
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GateTransition>
    );
}
