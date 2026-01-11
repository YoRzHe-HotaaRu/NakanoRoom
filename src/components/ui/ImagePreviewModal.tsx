'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ImagePreviewModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!mounted || !imageUrl) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Download button */}
                <a
                    href={imageUrl}
                    download="image"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <Download className="w-6 h-6 text-white" />
                </a>

                {/* Image */}
                <motion.img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                />
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
