'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

interface Petal {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

interface SakuraPetalsProps {
    count?: number;
}

export function SakuraPetals({ count = 25 }: SakuraPetalsProps) {
    // Generate random petals only once
    const petals = useMemo<Petal[]>(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100, // Random x position (%)
            delay: Math.random() * 5, // Random start delay
            duration: 8 + Math.random() * 6, // 8-14 seconds to fall
            size: 12 + Math.random() * 16, // 12-28px
            rotation: Math.random() * 360, // Random initial rotation
        }));
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute"
                    style={{
                        left: `${petal.x}%`,
                        top: -30,
                        width: petal.size,
                        height: petal.size,
                    }}
                    initial={{
                        y: -30,
                        rotate: petal.rotation,
                        opacity: 0,
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: [0, Math.sin(petal.id) * 100, Math.cos(petal.id) * 50, 0],
                        rotate: [petal.rotation, petal.rotation + 360],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {/* Sakura petal SVG */}
                    <svg
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        <path
                            d="M16 2C16 2 12 8 12 14C12 20 16 22 16 22C16 22 20 20 20 14C20 8 16 2 16 2Z"
                            fill="url(#petalGradient)"
                            opacity="0.9"
                        />
                        <path
                            d="M16 2C16 2 10 6 6 10C2 14 4 18 4 18C4 18 8 16 12 12C16 8 16 2 16 2Z"
                            fill="url(#petalGradient)"
                            opacity="0.8"
                        />
                        <path
                            d="M16 2C16 2 22 6 26 10C30 14 28 18 28 18C28 18 24 16 20 12C16 8 16 2 16 2Z"
                            fill="url(#petalGradient)"
                            opacity="0.8"
                        />
                        <defs>
                            <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFB7C5" />
                                <stop offset="50%" stopColor="#FFC0CB" />
                                <stop offset="100%" stopColor="#FFE4E9" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
