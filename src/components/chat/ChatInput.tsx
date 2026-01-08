'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile } from 'lucide-react';
import { useChatStore, useIsLoading } from '@/store/chatStore';
import { characters, CharacterId } from '@/lib/characters';

interface ChatInputProps {
    onSend: (message: string) => void;
}

interface MentionOption {
    id: CharacterId;
    name: string;
    emoji: string;
    color: string;
}

const mentionOptions: MentionOption[] = Object.values(characters).map(c => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    color: c.color,
}));

export function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionStartPos, setMentionStartPos] = useState(-1);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isLoading = useIsLoading();

    // Filter mention options based on what user typed after @
    const filteredMentions = mentionOptions.filter(opt =>
        opt.name.toLowerCase().startsWith(mentionFilter.toLowerCase())
    );

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    // Reset selected index when filter changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [mentionFilter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart || 0;

        setMessage(newValue);

        // Check for @ trigger
        const textBeforeCursor = newValue.substring(0, cursorPos);
        const atMatch = textBeforeCursor.match(/@(\w*)$/);

        if (atMatch) {
            setShowMentions(true);
            setMentionFilter(atMatch[1]);
            setMentionStartPos(cursorPos - atMatch[0].length);
        } else {
            setShowMentions(false);
            setMentionFilter('');
            setMentionStartPos(-1);
        }
    };

    const insertMention = (option: MentionOption) => {
        if (mentionStartPos === -1) return;

        const beforeMention = message.substring(0, mentionStartPos);
        const afterMention = message.substring(mentionStartPos + mentionFilter.length + 1); // +1 for @
        const newMessage = `${beforeMention}@${option.name} ${afterMention}`;

        setMessage(newMessage);
        setShowMentions(false);
        setMentionFilter('');
        setMentionStartPos(-1);

        // Focus back on textarea
        setTimeout(() => {
            textareaRef.current?.focus();
            const newCursorPos = beforeMention.length + option.name.length + 2; // @Name + space
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSend(message.trim());
            setMessage('');
            setShowMentions(false);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (showMentions && filteredMentions.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < filteredMentions.length - 1 ? prev + 1 : 0
                    );
                    return;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : filteredMentions.length - 1
                    );
                    return;
                case 'Tab':
                case 'Enter':
                    e.preventDefault();
                    insertMention(filteredMentions[selectedIndex]);
                    return;
                case 'Escape':
                    e.preventDefault();
                    setShowMentions(false);
                    return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="p-4 border-t border-sakura-200/30 bg-white/50 backdrop-blur-sm relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            {/* Mention Autocomplete Dropdown */}
            <AnimatePresence>
                {showMentions && filteredMentions.length > 0 && (
                    <motion.div
                        className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-sakura-200/50 overflow-hidden z-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="p-2 border-b border-sakura-100 bg-sakura-50/50">
                            <p className="text-xs text-gray-500">Mention a character</p>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {filteredMentions.map((option, index) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${index === selectedIndex
                                            ? 'bg-sakura-100'
                                            : 'hover:bg-sakura-50'
                                        }`}
                                    onClick={() => insertMention(option)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <span
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                        style={{ backgroundColor: `${option.color}20` }}
                                    >
                                        {option.emoji}
                                    </span>
                                    <div>
                                        <p className="font-medium text-sm" style={{ color: option.color }}>
                                            @{option.name}
                                        </p>
                                    </div>
                                    {index === selectedIndex && (
                                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                            Tab ↹
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Use @ to mention)"
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

            {/* Hint */}
            <p className="text-[10px] text-gray-400 mt-2 text-center">
                Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">@</kbd> to mention • <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Tab</kbd> to select • <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Shift</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Enter</kbd> for new line
            </p>
        </motion.form>
    );
}
