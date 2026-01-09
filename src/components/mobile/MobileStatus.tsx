'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Play } from 'lucide-react';
import Image from 'next/image';

const videoOptions = [
    {
        id: 'op1',
        name: 'Opening 1',
        subtitle: 'Gotoubun no Katachi',
        video: '/Asset/Background_Wallpaper/OP1.mp4',
        thumbnail: '/Asset/NakanoRoom/NakanoRoom.jpg', // Using as placeholder
    },
    {
        id: 'op2',
        name: 'Opening 2',
        subtitle: 'Gotoubun no Kiseki',
        video: '/Asset/Background_Wallpaper/OP2.mp4',
        thumbnail: '/Asset/NakanoRoom/NakanoRoom2.jpg',
    },
    {
        id: 'op3',
        name: 'Opening 3',
        subtitle: 'Gotobun no Tsubasa',
        video: '/Asset/Background_Wallpaper/OP3.mp4',
        thumbnail: '/Asset/NakanoRoom/NakanoRoom3.jpg',
    },
];

export function MobileStatus() {
    const [selectedVideo, setSelectedVideo] = useState('op1');

    // TODO: In future, this could be connected to global state to change the actual background

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <header className="p-4 border-b border-sakura-200/30 bg-white/90">
                <h1 className="font-display text-xl font-bold text-sakura-600 flex items-center gap-2">
                    <span>🎬</span>
                    Status
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Choose your background wallpaper
                </p>
            </header>

            {/* Video Options */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Background Videos
                </h2>

                {videoOptions.map((option, index) => (
                    <motion.button
                        key={option.id}
                        onClick={() => setSelectedVideo(option.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${selectedVideo === option.id
                                ? 'bg-sakura-50 ring-2 ring-sakura-400'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <Image
                                src={option.thumbnail}
                                alt={option.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play size={24} className="text-white" fill="white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-800">
                                {option.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {option.subtitle}
                            </p>
                        </div>

                        {/* Selected indicator */}
                        {selectedVideo === option.id && (
                            <motion.div
                                className="w-6 h-6 rounded-full bg-sakura-500 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                            >
                                <Check size={14} className="text-white" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}

                {/* Info card */}
                <motion.div
                    className="mt-6 p-4 bg-sakura-50 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-sm text-sakura-700">
                        💡 <strong>Tip:</strong> The selected opening will play as your animated wallpaper background.
                        Use the 🔇 button to toggle music on/off.
                    </p>
                </motion.div>

                {/* Current playing */}
                <div className="text-center pt-4">
                    <p className="text-xs text-gray-400">
                        Currently playing: All openings in sequence (OP1 → OP2 → OP3)
                    </p>
                </div>
            </div>
        </div>
    );
}
