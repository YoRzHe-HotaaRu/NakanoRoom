'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, X, Reply, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { useChatStore, useIsLoading } from '@/store/chatStore';
import { characters, CharacterId, getCharacter } from '@/lib/characters';
import { Attachment } from '@/lib/api/zenmux-client';

interface ChatInputProps {
    onSend: (message: string, attachment?: Attachment) => void;
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

// Anime/cute emoji categories
const emojiCategories = [
    {
        name: 'Kaomoji',
        emojis: ['(◕‿◕)', '(´・ω・`)', '(*´▽`*)', '(｡♥‿♥｡)', '(◠‿◠)', '(≧◡≦)', '٩(◕‿◕｡)۶', '(ノ´ヮ`)ノ*: ・゚✧', '(´∀`)', '(◕ᴗ◕✿)']
    },
    {
        name: 'Hearts',
        emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞', '🥰', '😍']
    },
    {
        name: 'Cute',
        emojis: ['🌸', '✨', '🎀', '🍡', '🍰', '🎂', '🍓', '🌷', '🌺', '🦋']
    },
    {
        name: 'Faces',
        emojis: ['😊', '😂', '🤣', '😭', '😤', '😳', '🥺', '😎', '🤔', '😴']
    },
    {
        name: 'Reactions',
        emojis: ['👍', '👎', '👏', '🙌', '💪', '🤝', '👋', '✌️', '🤞', '👀']
    }
];

export function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionStartPos, setMentionStartPos] = useState(-1);
    const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isLoading = useIsLoading();
    const replyToMessage = useChatStore((state) => state.replyToMessage);
    const setReplyToMessage = useChatStore((state) => state.setReplyToMessage);
    const [attachment, setAttachment] = useState<Attachment | null>(null);

    // Get reply character info
    const replyCharacter = replyToMessage?.characterId
        ? getCharacter(replyToMessage.characterId)
        : null;

    // Filter mention options based on what user typed after @
    const filteredMentions = mentionOptions.filter(opt =>
        opt.name.toLowerCase().startsWith(mentionFilter.toLowerCase())
    );

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // Focus input when starting a reply
    useEffect(() => {
        if (replyToMessage) {
            textareaRef.current?.focus();
        }
    }, [replyToMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart || 0;

        setMessage(newValue);

        // Check for @ trigger
        const textBeforeCursor = newValue.substring(0, cursorPos);
        const atMatch = textBeforeCursor.match(/@(\w*)$/);

        if (atMatch) {
            setShowMentions(true);
            setShowEmojiPicker(false);
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
        const afterMention = message.substring(mentionStartPos + mentionFilter.length + 1);
        const newMessage = `${beforeMention}@${option.name} ${afterMention}`;

        setMessage(newMessage);
        setShowMentions(false);
        setMentionFilter('');
        setMentionStartPos(-1);

        setTimeout(() => {
            textareaRef.current?.focus();
            const newCursorPos = beforeMention.length + option.name.length + 2;
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const insertEmoji = (emoji: string) => {
        const cursorPos = textareaRef.current?.selectionStart || message.length;
        const beforeCursor = message.substring(0, cursorPos);
        const afterCursor = message.substring(cursorPos);
        const newMessage = `${beforeCursor}${emoji}${afterCursor}`;

        setMessage(newMessage);

        setTimeout(() => {
            textareaRef.current?.focus();
            const newCursorPos = cursorPos + emoji.length;
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Handle file selection
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File too large! Maximum size is 10MB.');
            return;
        }

        // Determine file type
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        if (!isImage && !isPdf) {
            alert('Only images (JPG, PNG, GIF, WebP) and PDF files are supported.');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setAttachment({
                base64,
                type: isImage ? 'image' : 'pdf',
                filename: file.name,
                preview: isImage ? base64 : undefined
            });
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        // Can send if has message OR has attachment
        if ((message.trim() || attachment) && !isLoading) {
            // If replying, prepend the reply context
            const finalMessage = replyToMessage
                ? `> ${replyCharacter?.name || 'You'}: "${replyToMessage.content.slice(0, 50)}${replyToMessage.content.length > 50 ? '...' : ''}"\n\n${message.trim()}`
                : message.trim();
            onSend(finalMessage, attachment || undefined);
            setMessage('');
            setAttachment(null);
            setShowMentions(false);
            setShowEmojiPicker(false);
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

        // Cancel reply on Escape
        if (e.key === 'Escape' && replyToMessage) {
            e.preventDefault();
            setReplyToMessage(null);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="p-3 border-t border-sakura-200/30 bg-white/70 backdrop-blur-sm relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            {/* Reply Preview */}
            <AnimatePresence>
                {replyToMessage && (
                    <motion.div
                        className="flex items-center gap-2 mb-2 px-3 py-2 bg-sakura-50 rounded-lg border-l-3"
                        style={{ borderLeftColor: replyCharacter?.color || '#FF6B8A' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Reply size={14} className="text-sakura-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium" style={{ color: replyCharacter?.color || '#FF6B8A' }}>
                                Replying to {replyCharacter?.name || 'yourself'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {replyToMessage.content.slice(0, 60)}{replyToMessage.content.length > 60 ? '...' : ''}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReplyToMessage(null)}
                            className="p-1 hover:bg-sakura-100 rounded-full transition-colors"
                        >
                            <X size={14} className="text-gray-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mention Autocomplete Dropdown */}
            <AnimatePresence>
                {showMentions && filteredMentions.length > 0 && (
                    <motion.div
                        className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg border border-sakura-200/50 overflow-hidden z-50"
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

            {/* Emoji Picker */}
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        ref={emojiPickerRef}
                        className="absolute bottom-full left-3 mb-2 bg-white rounded-xl shadow-lg border border-sakura-200/50 overflow-hidden z-50 w-72"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Header */}
                        <div className="p-2 border-b border-sakura-100 bg-sakura-50/50 flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-600">Emoji & Kaomoji</p>
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex border-b border-sakura-100 px-1">
                            {emojiCategories.map((cat, idx) => (
                                <button
                                    key={cat.name}
                                    type="button"
                                    onClick={() => setActiveEmojiCategory(idx)}
                                    className={`px-2 py-1.5 text-xs transition-colors ${activeEmojiCategory === idx
                                        ? 'text-sakura-600 border-b-2 border-sakura-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Emoji Grid - 2 cols for kaomoji (wider text), 5 cols for emoji */}
                        <div className={`p-2 grid gap-1 max-h-40 overflow-y-auto ${activeEmojiCategory === 0 ? 'grid-cols-2' : 'grid-cols-5'}`}>
                            {emojiCategories[activeEmojiCategory].emojis.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => insertEmoji(emoji)}
                                    className={`hover:bg-sakura-50 rounded-lg transition-colors text-center ${activeEmojiCategory === 0
                                        ? 'p-2 text-sm whitespace-nowrap'
                                        : 'p-2 text-lg'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Attachment preview */}
            <AnimatePresence>
                {attachment && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-sakura-50 border border-sakura-200 rounded-lg">
                            {attachment.type === 'image' ? (
                                <>
                                    {attachment.preview && (
                                        <img
                                            src={attachment.preview}
                                            alt="Preview"
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    )}
                                    <ImageIcon size={16} className="text-sakura-500" />
                                </>
                            ) : (
                                <FileText size={16} className="text-sakura-500" />
                            )}
                            <span className="text-sm text-gray-600 max-w-[150px] truncate">
                                {attachment.filename}
                            </span>
                            <button
                                type="button"
                                onClick={removeAttachment}
                                className="p-1 hover:bg-sakura-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-gray-500" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-end gap-2">
                {/* Emoji button - using onPointerDown for better mobile support */}
                <motion.button
                    type="button"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowMentions(false);
                    }}
                    className={`flex items-center justify-center w-10 h-10 transition-colors rounded-xl ${showEmojiPicker
                        ? 'text-sakura-600 bg-sakura-100'
                        : 'text-sakura-400 hover:text-sakura-600 hover:bg-sakura-100/50'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add emoji"
                >
                    <Smile size={20} />
                </motion.button>

                {/* Attachment button */}
                <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-xl text-sakura-400 hover:text-sakura-600 hover:bg-sakura-100/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Attach file"
                >
                    <Paperclip size={20} />
                </motion.button>

                {/* Input field */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message..."
                        disabled={isLoading}
                        rows={1}
                        className="w-full resize-none rounded-xl px-3 py-2 bg-white/80 border border-sakura-200/50 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-300/30 placeholder:text-gray-400 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        style={{ minHeight: '40px', maxHeight: '100px' }}
                    />
                </div>

                {/* Send button */}
                <motion.button
                    type="submit"
                    disabled={(!message.trim() && !attachment) || isLoading}
                    className="btn-send flex items-center justify-center w-10 h-10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    whileHover={(message.trim() || attachment) && !isLoading ? { scale: 1.05 } : undefined}
                    whileTap={(message.trim() || attachment) && !isLoading ? { scale: 0.95 } : undefined}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    ) : (
                        <Send size={18} />
                    )}
                </motion.button>
            </div>
        </motion.form>
    );
}
