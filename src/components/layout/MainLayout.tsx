'use client';

import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { CharacterPanel } from '@/components/character/CharacterPanel';
import { AnimeClock, AnimeQuote } from '@/components/decorations/AnimeClock';
import { VideoBackground } from '@/components/decorations/VideoBackground';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion } from 'motion/react';

export function MainLayout() {
    const isMobile = useIsMobile();

    // Mobile layout
    if (isMobile) {
        return <MobileLayout />;
    }

    // Desktop layout (unchanged)
    return (
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center gap-4 p-8">
            {/* Video Background */}
            <VideoBackground />

            {/* Floating sakura petals overlay */}
            <FloatingPetals />

            {/* Main Chat Container - Left side */}
            <motion.div
                className="relative z-10 w-[55%] max-w-[800px] h-[85%] max-h-[800px] flex rounded-2xl overflow-hidden shadow-2xl border border-sakura-200/30 bg-white/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            >
                {/* Left Sidebar - Chat Selection */}
                <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <ChatSidebar />
                </motion.div>

                {/* Center - Chat Window */}
                <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <ChatWindow />
                </motion.div>
            </motion.div>

            {/* Right Side - Character Panel + Decorations (Detached) */}
            <motion.div
                className="relative z-10 flex flex-col gap-4 h-[85%] max-h-[800px]"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }}
            >
                {/* Character Panel */}
                <div className="flex-1 min-h-0">
                    <CharacterPanel />
                </div>

                {/* Bottom decorations row */}
                <div className="flex gap-3 items-end">
                    {/* Quote */}
                    <motion.div
                        className="glass-panel p-3 flex-1 max-w-[180px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <AnimeQuote />
                    </motion.div>

                    {/* Clock */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <AnimeClock />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

// Optimized floating petals using CSS animations (much better performance than JS-based motion)
function FloatingPetals() {
    // Reduced to 6 petals for better performance
    const petals = [
        { left: 10, delay: 0, duration: 18 },
        { left: 25, delay: 3, duration: 20 },
        { left: 45, delay: 6, duration: 16 },
        { left: 65, delay: 2, duration: 22 },
        { left: 80, delay: 5, duration: 19 },
        { left: 92, delay: 8, duration: 17 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
            {petals.map((petal, i) => (
                <div
                    key={i}
                    className="absolute text-sakura-300 text-sm animate-petal-fall"
                    style={{
                        left: `${petal.left}%`,
                        animationDelay: `${petal.delay}s`,
                        animationDuration: `${petal.duration}s`,
                    }}
                >
                    🌸
                </div>
            ))}
        </div>
    );
}

