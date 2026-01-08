'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

const videoPlaylist = [
    '/Asset/Background_Wallpaper/OP1.mp4',
    '/Asset/Background_Wallpaper/OP2.mp4',
    '/Asset/Background_Wallpaper/OP3.mp4',
];

const DEFAULT_VOLUME = 0.18; // 18% volume

export function VideoBackground() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle video end - move to next video
    const handleVideoEnd = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoPlaylist.length);
    };

    // Set initial volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = DEFAULT_VOLUME;
        }
    }, []);

    // Update video source when index changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.volume = DEFAULT_VOLUME;
            videoRef.current.play().catch((err) => {
                console.log('Auto-play prevented:', err);
            });
        }
    }, [currentVideoIndex]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-0 overflow-hidden">
                {/* Video element */}
                <video
                    ref={videoRef}
                    className="absolute w-full h-full object-cover blur-[6px]"
                    muted={isMuted}
                    playsInline
                    onEnded={handleVideoEnd}
                    autoPlay
                >
                    <source src={videoPlaylist[currentVideoIndex]} type="video/mp4" />
                </video>

                {/* Overlay to soften the video and maintain readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-sakura-100/60 via-white/40 to-sakura-200/50 backdrop-blur-[2px]" />

                {/* Subtle vignette effect */}
                <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255, 235, 240, 0.4) 100%)'
                    }}
                />
            </div>

            {/* Mute toggle button - bottom right */}
            <motion.button
                onClick={toggleMute}
                className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sakura-600 hover:text-sakura-700 hover:bg-white/80 transition-colors shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
        </>
    );
}
