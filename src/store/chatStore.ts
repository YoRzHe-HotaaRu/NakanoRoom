import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ChatId, CharacterId } from '@/lib/characters';

export interface Message {
    id: string;
    chatId: ChatId;
    role: 'user' | 'assistant';
    content: string;
    characterId?: CharacterId; // For assistant messages
    timestamp: number;
}

export interface ChatState {
    // Current active chat
    activeChat: ChatId;

    // Messages grouped by chat ID
    messages: Record<ChatId, Message[]>;

    // Loading state per chat
    isLoading: Record<ChatId, boolean>;

    // Typing characters (for showing typing indicator)
    typingCharacters: CharacterId[];

    // Message being replied to
    replyToMessage: Message | null;

    // Actions
    setActiveChat: (chatId: ChatId) => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
    setLoading: (chatId: ChatId, loading: boolean) => void;
    setTypingCharacters: (characters: CharacterId[]) => void;
    setReplyToMessage: (message: Message | null) => void;
    clearChat: (chatId: ChatId) => void;
    clearAllChats: () => void;

    // Get messages for current chat
    getCurrentMessages: () => Message[];
    getMessagesForChat: (chatId: ChatId) => Message[];
}

const initialMessages: Record<ChatId, Message[]> = {
    group: [],
    ichika: [],
    nino: [],
    miku: [],
    yotsuba: [],
    itsuki: [],
};

const initialLoading: Record<ChatId, boolean> = {
    group: false,
    ichika: false,
    nino: false,
    miku: false,
    yotsuba: false,
    itsuki: false,
};

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            activeChat: 'group',
            messages: { ...initialMessages },
            isLoading: { ...initialLoading },
            typingCharacters: [],
            replyToMessage: null,

            setActiveChat: (chatId) => {
                set({ activeChat: chatId, replyToMessage: null });
            },

            addMessage: (messageData) => {
                const message: Message = {
                    ...messageData,
                    id: uuidv4(),
                    timestamp: Date.now(),
                };

                set((state) => ({
                    messages: {
                        ...state.messages,
                        [messageData.chatId]: [...(state.messages[messageData.chatId] || []), message],
                    },
                    replyToMessage: null, // Clear reply after sending
                }));

                return message;
            },

            setLoading: (chatId, loading) => {
                set((state) => ({
                    isLoading: {
                        ...state.isLoading,
                        [chatId]: loading,
                    },
                }));
            },

            setTypingCharacters: (characters) => {
                set({ typingCharacters: characters });
            },

            setReplyToMessage: (message) => {
                set({ replyToMessage: message });
            },

            clearChat: (chatId) => {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [chatId]: [],
                    },
                }));
            },

            clearAllChats: () => {
                set({
                    messages: { ...initialMessages },
                    isLoading: { ...initialLoading },
                    typingCharacters: [],
                });
            },

            getCurrentMessages: () => {
                const state = get();
                return state.messages[state.activeChat] || [];
            },

            getMessagesForChat: (chatId) => {
                const state = get();
                return state.messages[chatId] || [];
            },
        }),
        {
            name: 'nakano-room-chat-storage',
            partialize: (state) => ({
                messages: state.messages,
                activeChat: state.activeChat,
            }),
        }
    )
);

// Selector hooks for optimized re-renders
export const useActiveChat = () => useChatStore((state) => state.activeChat);
export const useCurrentMessages = () => useChatStore((state) => state.messages[state.activeChat] || []);
export const useIsLoading = () => useChatStore((state) => state.isLoading[state.activeChat]);
export const useTypingCharacters = () => useChatStore((state) => state.typingCharacters);
