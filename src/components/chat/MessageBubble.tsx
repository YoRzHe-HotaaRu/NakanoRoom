'use client';

import { motion } from 'motion/react';
import { Message, useChatStore } from '@/store/chatStore';
import { getCharacter, CharacterId } from '@/lib/characters';
import { useMemo, ReactNode, useState } from 'react';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { Reply } from 'lucide-react';
import Image from 'next/image';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';

/**
 * Parse and render markdown-style text formatting
 * Supports: **bold**, *italic*, ~~strikethrough~~, __underline__, > quotes
 */
function formatMessageContent(content: string, isUserMessage: boolean = false): ReactNode {
    // Handle empty content
    if (!content) return null;

    // First, check if message starts with a quote block (reply format)
    // Pattern: > Name: "quoted text"\n\nactual message
    const quoteMatch = content.match(/^> (.+?): "(.+?)"\n\n([\s\S]*)$/);
    if (quoteMatch) {
        const [, quotedName, quotedText, actualMessage] = quoteMatch;
        return (
            <>
                <div
                    className={`mb-2 pl-2 py-1 border-l-2 ${isUserMessage
                        ? 'border-white/50 bg-white/10'
                        : 'border-sakura-300 bg-sakura-50/50'
                        } rounded-r text-xs`}
                >
                    <span className={`font-medium ${isUserMessage ? 'text-white/90' : 'text-sakura-600'}`}>
                        {quotedName}
                    </span>
                    <p className={`italic ${isUserMessage ? 'text-white/70' : 'text-gray-500'} line-clamp-2`}>
                        "{quotedText}"
                    </p>
                </div>
                <div>{formatInlineStyles(actualMessage)}</div>
            </>
        );
    }

    return formatInlineStyles(content);
}

/**
 * Format inline text styles (bold, italic, etc.)
 */
function formatInlineStyles(content: string): ReactNode {
    if (!content) return null;

    const parts: ReactNode[] = [];
    let remaining = content;
    let key = 0;

    // Regex patterns (order matters - check longer patterns first)
    const patterns: { regex: RegExp; render: (text: string) => ReactNode }[] = [
        // Attachment indicator: [📎 filename]
        {
            regex: /\[📎 (.+?)\]/,
            render: (t) => {
                // Truncate long filenames
                const maxLen = 25;
                const displayName = t.length > maxLen ? t.slice(0, maxLen) + '...' : t;
                return (
                    <span key={key++} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium max-w-full" title={t}>
                        📎 <span className="truncate">{displayName}</span>
                    </span>
                );
            }
        },
        // Bold: **text**
        { regex: /\*\*(.+?)\*\*/, render: (t) => <strong key={key++} className="font-bold">{t}</strong> },
        // Strikethrough: ~~text~~
        { regex: /~~(.+?)~~/, render: (t) => <del key={key++} className="line-through">{t}</del> },
        // Underline: __text__
        { regex: /__(.+?)__/, render: (t) => <u key={key++} className="underline">{t}</u> },
        // Italic: *text* (single asterisk)
        { regex: /\*(.+?)\*/, render: (t) => <em key={key++} className="italic">{t}</em> },
    ];

    while (remaining.length > 0) {
        let earliestMatch: { index: number; length: number; rendered: ReactNode } | null = null;

        for (const { regex, render } of patterns) {
            const match = remaining.match(regex);
            if (match && match.index !== undefined) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                    earliestMatch = {
                        index: match.index,
                        length: match[0].length,
                        rendered: render(match[1]),
                    };
                }
            }
        }

        if (earliestMatch) {
            // Add text before the match
            if (earliestMatch.index > 0) {
                parts.push(remaining.substring(0, earliestMatch.index));
            }
            // Add the formatted element
            parts.push(earliestMatch.rendered);
            // Continue with remaining text
            remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
        } else {
            // No more matches, add remaining text
            parts.push(remaining);
            break;
        }
    }

    return parts.length > 0 ? parts : content;
}

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const character = message.characterId ? getCharacter(message.characterId) : null;
    const setReplyToMessage = useChatStore((state) => state.setReplyToMessage);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const formattedTime = useMemo(() => {
        return new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }, [message.timestamp]);

    const contextMenuItems = [
        {
            label: 'Reply',
            icon: <Reply size={14} />,
            onClick: () => setReplyToMessage(message),
        },
    ];

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: 'spring',
                stiffness: 500,
                damping: 40
            }}
        >
            {/* Avatar for character messages - now with profile pic */}
            {!isUser && character && (
                <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    style={{ '--character-color': character.color } as React.CSSProperties}
                >
                    <div
                        className="w-10 h-10 rounded-full overflow-hidden shadow-md"
                        style={{
                            border: `2px solid ${character.color}`
                        }}
                    >
                        <Image
                            src={character.profilePic}
                            alt={character.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            )}

            {/* Message content */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {/* Character name */}
                {!isUser && character && (
                    <span
                        className="text-xs font-medium mb-1 px-1"
                        style={{ color: character.color }}
                    >
                        {character.name}
                    </span>
                )}

                {/* Bubble - with context menu for character messages only */}
                {!isUser ? (
                    <ContextMenu items={contextMenuItems}>
                        <motion.div
                            className="message-character"
                            style={character ? {
                                borderLeft: `3px solid ${character.color}`,
                            } : undefined}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {formatMessageContent(message.content, isUser)}
                            </div>
                        </motion.div>
                    </ContextMenu>
                ) : (
                    <motion.div
                        className="message-user"
                        whileHover={{ scale: 1.01 }}
                    >
                        {/* Image preview for attachments */}
                        {message.imagePreview && (
                            <div className="mb-2">
                                <button
                                    onClick={() => setPreviewImage(message.imagePreview!)}
                                    className="block"
                                    type="button"
                                >
                                    <img
                                        src={message.imagePreview}
                                        alt="Attached image"
                                        className="max-w-[200px] max-h-[200px] rounded-lg object-cover border-2 border-white/30 hover:border-white/60 transition-colors cursor-pointer"
                                    />
                                </button>
                            </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {formatMessageContent(message.content, isUser)}
                        </div>
                    </motion.div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formattedTime}
                </span>
            </div>

            {/* User avatar placeholder */}
            {isUser && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    You
                </div>
            )}

            {/* Image preview modal */}
            <ImagePreviewModal
                imageUrl={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </motion.div>
    );
}

// Typing indicator component
interface TypingIndicatorProps {
    characters: CharacterId[];
}

export function TypingIndicator({ characters }: TypingIndicatorProps) {
    if (characters.length === 0) return null;

    const displayNames = characters.map(id => getCharacter(id).name).join(', ');

    return (
        <motion.div
            className="flex items-center gap-3 px-4 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <div className="typing-dots">
                <span />
                <span />
                <span />
            </div>
            <span className="text-xs text-gray-500">
                {displayNames} {characters.length === 1 ? 'is' : 'are'} typing...
            </span>
        </motion.div>
    );
}
