'use client';

import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { CharacterPanel } from '@/components/character/CharacterPanel';
import { AnimeClock, AnimeQuote } from '@/components/decorations/AnimeClock';
import { motion } from 'motion/react';

export function MainLayout() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-sakura-gradient">
            {/* Background decoration */}
            <BackgroundDecoration />

            {/* Main content */}
            <div className="relative z-10 h-full flex p-4 gap-4">
                {/* Left Sidebar - Chat Selection */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                >
                    <ChatSidebar />
                </motion.div>

                {/* Center - Chat Window */}
                <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <ChatWindow />
                </motion.div>

                {/* Right Panel - Character Display */}
                <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                >
                    <CharacterPanel />

                    {/* Decorations under character panel */}
                    <div className="glass-panel p-4 flex flex-col items-center gap-4">
                        <AnimeClock />
                        <div className="mt-6 w-full">
                            <AnimeQuote />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function BackgroundDecoration() {
    // Pre-calculated positions to avoid hydration mismatch (no Math.random)
    const petalConfigs = [
        { left: 5, size: 10, duration: 18, delay: 0 },
        { left: 15, size: 12, duration: 20, delay: 2 },
        { left: 25, size: 8, duration: 16, delay: 4 },
        { left: 35, size: 14, duration: 22, delay: 1 },
        { left: 45, size: 9, duration: 17, delay: 5 },
        { left: 55, size: 11, duration: 19, delay: 3 },
        { left: 65, size: 13, duration: 21, delay: 6 },
        { left: 75, size: 10, duration: 18, delay: 8 },
        { left: 85, size: 12, duration: 20, delay: 7 },
        { left: 95, size: 8, duration: 15, delay: 9 },
        { left: 10, size: 11, duration: 19, delay: 4 },
        { left: 30, size: 9, duration: 17, delay: 6 },
        { left: 50, size: 13, duration: 21, delay: 2 },
        { left: 70, size: 10, duration: 18, delay: 8 },
        { left: 90, size: 12, duration: 20, delay: 5 },
    ];

    return (
        <>
            {/* Gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-sakura-100/50 via-transparent to-sakura-200/30 pointer-events-none" />

            {/* Floating sakura petals */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {petalConfigs.map((config, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-sakura-300"
                        style={{
                            left: `${config.left}%`,
                            top: -20,
                            fontSize: `${config.size}px`,
                        }}
                        animate={{
                            y: ['0vh', '105vh'],
                            x: [0, Math.sin(i) * 50, Math.cos(i) * 30, 0],
                            rotate: [0, 360, 720],
                        }}
                        transition={{
                            duration: config.duration,
                            repeat: Infinity,
                            delay: config.delay,
                            ease: 'linear',
                        }}
                    >
                        🌸
                    </motion.div>
                ))}
            </div>

            {/* Subtle grid pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 107, 138, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 138, 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />
        </>
    );
}
