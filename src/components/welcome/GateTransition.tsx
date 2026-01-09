'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface GateTransitionProps {
    isOpen: boolean;
    onTransitionComplete?: () => void;
    children?: ReactNode;
}

export function GateTransition({ isOpen, onTransitionComplete, children }: GateTransitionProps) {
    return (
        <>
            {/* Content behind the gates */}
            {children}

            {/* Gate panels */}
            <AnimatePresence onExitComplete={onTransitionComplete}>
                {!isOpen && (
                    <>
                        {/* Left panel */}
                        <motion.div
                            className="fixed top-0 left-0 w-1/2 h-full z-[100] overflow-hidden"
                            initial={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                duration: 1.2,
                                ease: [0.645, 0.045, 0.355, 1], // Cubic bezier for smooth door feel
                            }}
                        >
                            {/* Panel background with wood grain effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-sakura-100 to-sakura-50">
                                {/* Decorative pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg className="w-full h-full" preserveAspectRatio="none">
                                        <pattern id="leftPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <circle cx="20" cy="20" r="1" fill="#FF6B8A" />
                                        </pattern>
                                        <rect fill="url(#leftPattern)" width="100%" height="100%" />
                                    </svg>
                                </div>

                                {/* Sakura design on panel */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path
                                            d="M50 10 C50 10 40 30 40 50 C40 70 50 80 50 80 C50 80 60 70 60 50 C60 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                        <path
                                            d="M50 10 C50 10 30 25 20 40 C10 55 20 70 20 70 C20 70 35 60 45 45 C55 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                        <path
                                            d="M50 10 C50 10 70 25 80 40 C90 55 80 70 80 70 C80 70 65 60 55 45 C45 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                    </svg>
                                </div>

                                {/* Door frame edge */}
                                <div className="absolute right-0 top-0 w-3 h-full bg-gradient-to-l from-sakura-300/50 to-transparent" />
                            </div>
                        </motion.div>

                        {/* Right panel */}
                        <motion.div
                            className="fixed top-0 right-0 w-1/2 h-full z-[100] overflow-hidden"
                            initial={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                duration: 1.2,
                                ease: [0.645, 0.045, 0.355, 1],
                            }}
                        >
                            {/* Panel background */}
                            <div className="absolute inset-0 bg-gradient-to-l from-sakura-100 to-sakura-50">
                                {/* Decorative pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg className="w-full h-full" preserveAspectRatio="none">
                                        <pattern id="rightPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <circle cx="20" cy="20" r="1" fill="#FF6B8A" />
                                        </pattern>
                                        <rect fill="url(#rightPattern)" width="100%" height="100%" />
                                    </svg>
                                </div>

                                {/* Sakura design on panel */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path
                                            d="M50 10 C50 10 40 30 40 50 C40 70 50 80 50 80 C50 80 60 70 60 50 C60 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                        <path
                                            d="M50 10 C50 10 30 25 20 40 C10 55 20 70 20 70 C20 70 35 60 45 45 C55 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                        <path
                                            d="M50 10 C50 10 70 25 80 40 C90 55 80 70 80 70 C80 70 65 60 55 45 C45 30 50 10 50 10"
                                            fill="#FF6B8A"
                                        />
                                    </svg>
                                </div>

                                {/* Door frame edge */}
                                <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-sakura-300/50 to-transparent" />
                            </div>
                        </motion.div>

                        {/* Center line where doors meet */}
                        <motion.div
                            className="fixed top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-sakura-300/30 z-[101]"
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
