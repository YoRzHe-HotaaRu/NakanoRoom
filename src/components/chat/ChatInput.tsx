'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Send, Smile } from 'lucide-react';
import { useChatStore, useIsLoading } from '@/store/chatStore';

interface ChatInputProps {
    onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isLoading = useIsLoading();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSend(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="p-4 border-t border-sakura-200/30 bg-white/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="flex items-end gap-3">
                {/* Emoji button (decorative) */}
                <motion.button
                    type="button"
                    className="p-2 text-sakura-400 hover:text-sakura-600 transition-colors rounded-lg hover:bg-sakura-100/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Add emoji"
                >
                    <Smile size={22} />
                </motion.button>

                {/* Input field */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        rows={1}
                        className="w-full resize-none rounded-xl px-4 py-3 bg-white/80 border border-sakura-200/50 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-300/30 placeholder:text-gray-400 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                </div>

                {/* Send button */}
                <motion.button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="btn-send flex items-center justify-center w-12 h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    whileHover={message.trim() && !isLoading ? { scale: 1.05 } : undefined}
                    whileTap={message.trim() && !isLoading ? { scale: 0.95 } : undefined}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    ) : (
                        <Send size={20} />
                    )}
                </motion.button>
            </div>

            {/* Shift+Enter hint */}
            <p className="text-[10px] text-gray-400 mt-2 text-center">
                Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Enter</kbd> for new line
            </p>
        </motion.form>
    );
}
