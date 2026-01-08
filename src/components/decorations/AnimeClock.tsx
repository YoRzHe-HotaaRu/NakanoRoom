'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function AnimeClock() {
    // Initialize with null to avoid hydration mismatch
    const [time, setTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Don't render clock hands until mounted to avoid hydration mismatch
    if (!mounted || !time) {
        return (
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-white/80 backdrop-blur-sm shadow-sakura border-2 border-sakura-200">
                    <div className="absolute inset-1 rounded-full border border-sakura-100">
                        {/* Hour markers only - no dynamic content */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-3 bg-sakura-300 rounded-full"
                                style={{
                                    top: '4px',
                                    left: '50%',
                                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                                    transformOrigin: 'center 58px',
                                }}
                            />
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-sm z-20" />
                    </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-sakura-200">
                    <span className="font-mono text-xs text-sakura-600 font-medium">--:--</span>
                </div>
                <div className="absolute -top-2 -right-2 text-lg">🌸</div>
                <div className="absolute -bottom-2 -left-2 text-sm">✨</div>
            </div>
        );
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Calculate angles
    const secondAngle = (seconds / 60) * 360;
    const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

    // Format time without locale to avoid hydration issues
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return (
        <motion.div
            className="relative w-32 h-32"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* Clock face */}
            <div className="absolute inset-0 rounded-full bg-white/80 backdrop-blur-sm shadow-sakura border-2 border-sakura-200">
                {/* Decorative border */}
                <div className="absolute inset-1 rounded-full border border-sakura-100">
                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-3 bg-sakura-300 rounded-full"
                            style={{
                                top: '4px',
                                left: '50%',
                                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                                transformOrigin: 'center 58px',
                            }}
                        />
                    ))}

                    {/* Center decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-sm z-20" />

                    {/* Hour hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-1.5 h-8 bg-gradient-to-t from-sakura-600 to-sakura-400 rounded-full origin-bottom"
                        style={{
                            transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)`,
                        }}
                    />

                    {/* Minute hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-1 h-11 bg-gradient-to-t from-sakura-500 to-sakura-300 rounded-full origin-bottom"
                        style={{
                            transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)`,
                        }}
                    />

                    {/* Second hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-0.5 h-12 bg-sakura-400 rounded-full origin-bottom z-10"
                        style={{
                            transform: `translateX(-50%) translateY(-100%) rotate(${secondAngle}deg)`,
                        }}
                    />
                </div>
            </div>

            {/* Digital time display */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-sakura-200">
                <span className="font-mono text-xs text-sakura-600 font-medium">
                    {formattedTime}
                </span>
            </div>

            {/* Sakura decoration */}
            <div className="absolute -top-2 -right-2 text-lg">🌸</div>
            <div className="absolute -bottom-2 -left-2 text-sm">✨</div>
        </motion.div>
    );
}

// Additional decorative component
export function SakuraDecoration() {
    return (
        <div className="relative">
            {/* Cherry blossom branch illustration */}
            <motion.div
                className="text-4xl"
                animate={{
                    rotate: [0, 5, -5, 0],
                    y: [0, -3, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                🌸🍃
            </motion.div>
        </div>
    );
}

// Quote decoration
export function AnimeQuote() {
    const quotes = [
        { text: "I'll always be by your side", author: "Yotsuba" },
        { text: "It's not like I care or anything!", author: "Nino" },
        { text: "History teaches us many things...", author: "Miku" },
        { text: "Leave it to your big sister~", author: "Ichika" },
        { text: "Let's eat together!", author: "Itsuki" },
    ];

    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [quotes.length]);

    const quote = quotes[quoteIndex];

    return (
        <motion.div
            className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-sakura-200/50"
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-xs text-gray-600 italic mb-1">&quot;{quote.text}&quot;</p>
            <p className="text-[10px] text-sakura-500">— {quote.author}</p>
        </motion.div>
    );
}
