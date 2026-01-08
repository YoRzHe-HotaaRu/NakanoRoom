/**
 * Unit tests for chat store
 */
import { useChatStore, Message } from '@/store/chatStore';
import { act } from '@testing-library/react';

describe('Chat Store', () => {
    beforeEach(() => {
        // Reset store state before each test
        const store = useChatStore.getState();
        store.clearAllChats();
        store.setActiveChat('group');
    });

    describe('Initial State', () => {
        it('should have group as default active chat', () => {
            const { activeChat } = useChatStore.getState();
            expect(activeChat).toBe('group');
        });

        it('should have empty messages for all chats', () => {
            const { messages } = useChatStore.getState();
            expect(messages.group).toEqual([]);
            expect(messages.ichika).toEqual([]);
            expect(messages.nino).toEqual([]);
            expect(messages.miku).toEqual([]);
            expect(messages.yotsuba).toEqual([]);
            expect(messages.itsuki).toEqual([]);
        });

        it('should have loading false for all chats', () => {
            const { isLoading } = useChatStore.getState();
            Object.values(isLoading).forEach((loading) => {
                expect(loading).toBe(false);
            });
        });

        it('should have empty typing characters', () => {
            const { typingCharacters } = useChatStore.getState();
            expect(typingCharacters).toEqual([]);
        });
    });

    describe('setActiveChat', () => {
        it('should change active chat', () => {
            const { setActiveChat } = useChatStore.getState();

            act(() => {
                setActiveChat('miku');
            });

            expect(useChatStore.getState().activeChat).toBe('miku');
        });

        it('should work for all chat types', () => {
            const { setActiveChat } = useChatStore.getState();
            const chatIds = ['group', 'ichika', 'nino', 'miku', 'yotsuba', 'itsuki'] as const;

            chatIds.forEach((chatId) => {
                act(() => {
                    setActiveChat(chatId);
                });
                expect(useChatStore.getState().activeChat).toBe(chatId);
            });
        });
    });

    describe('addMessage', () => {
        it('should add user message to correct chat', () => {
            const { addMessage } = useChatStore.getState();

            act(() => {
                addMessage({
                    chatId: 'yotsuba',
                    role: 'user',
                    content: 'Hello Yotsuba!',
                });
            });

            const { messages } = useChatStore.getState();
            expect(messages.yotsuba).toHaveLength(1);
            expect(messages.yotsuba[0].content).toBe('Hello Yotsuba!');
            expect(messages.yotsuba[0].role).toBe('user');
        });

        it('should add assistant message with characterId', () => {
            const { addMessage } = useChatStore.getState();

            act(() => {
                addMessage({
                    chatId: 'nino',
                    role: 'assistant',
                    content: 'H-hmph! It\'s not like I wanted to talk to you!',
                    characterId: 'nino',
                });
            });

            const { messages } = useChatStore.getState();
            expect(messages.nino[0].characterId).toBe('nino');
        });

        it('should generate unique id and timestamp', () => {
            const { addMessage } = useChatStore.getState();

            let message1: Message;
            let message2: Message;

            act(() => {
                message1 = addMessage({
                    chatId: 'group',
                    role: 'user',
                    content: 'First message',
                });
                message2 = addMessage({
                    chatId: 'group',
                    role: 'user',
                    content: 'Second message',
                });
            });

            expect(message1!.id).toBeDefined();
            expect(message2!.id).toBeDefined();
            expect(message1!.id).not.toBe(message2!.id);
            expect(message1!.timestamp).toBeDefined();
            expect(message2!.timestamp).toBeGreaterThanOrEqual(message1!.timestamp);
        });

        it('should not affect other chats', () => {
            const { addMessage } = useChatStore.getState();

            act(() => {
                addMessage({
                    chatId: 'miku',
                    role: 'user',
                    content: 'Hello Miku!',
                });
            });

            const { messages } = useChatStore.getState();
            expect(messages.miku).toHaveLength(1);
            expect(messages.ichika).toHaveLength(0);
            expect(messages.group).toHaveLength(0);
        });
    });

    describe('setLoading', () => {
        it('should set loading state for specific chat', () => {
            const { setLoading } = useChatStore.getState();

            act(() => {
                setLoading('itsuki', true);
            });

            const { isLoading } = useChatStore.getState();
            expect(isLoading.itsuki).toBe(true);
            expect(isLoading.group).toBe(false);
        });

        it('should toggle loading state', () => {
            const { setLoading } = useChatStore.getState();

            act(() => {
                setLoading('ichika', true);
            });
            expect(useChatStore.getState().isLoading.ichika).toBe(true);

            act(() => {
                setLoading('ichika', false);
            });
            expect(useChatStore.getState().isLoading.ichika).toBe(false);
        });
    });

    describe('setTypingCharacters', () => {
        it('should set typing characters', () => {
            const { setTypingCharacters } = useChatStore.getState();

            act(() => {
                setTypingCharacters(['miku', 'yotsuba']);
            });

            const { typingCharacters } = useChatStore.getState();
            expect(typingCharacters).toEqual(['miku', 'yotsuba']);
        });

        it('should clear typing characters', () => {
            const { setTypingCharacters } = useChatStore.getState();

            act(() => {
                setTypingCharacters(['nino']);
                setTypingCharacters([]);
            });

            expect(useChatStore.getState().typingCharacters).toEqual([]);
        });
    });

    describe('clearChat', () => {
        it('should clear messages for specific chat', () => {
            const { addMessage, clearChat } = useChatStore.getState();

            act(() => {
                addMessage({ chatId: 'yotsuba', role: 'user', content: 'Test' });
                addMessage({ chatId: 'miku', role: 'user', content: 'Test' });
                clearChat('yotsuba');
            });

            const { messages } = useChatStore.getState();
            expect(messages.yotsuba).toHaveLength(0);
            expect(messages.miku).toHaveLength(1);
        });
    });

    describe('clearAllChats', () => {
        it('should clear all messages and reset state', () => {
            const { addMessage, setLoading, setTypingCharacters, clearAllChats } = useChatStore.getState();

            act(() => {
                addMessage({ chatId: 'group', role: 'user', content: 'Test' });
                addMessage({ chatId: 'nino', role: 'user', content: 'Test' });
                setLoading('group', true);
                setTypingCharacters(['ichika']);
                clearAllChats();
            });

            const state = useChatStore.getState();
            expect(state.messages.group).toHaveLength(0);
            expect(state.messages.nino).toHaveLength(0);
            expect(state.isLoading.group).toBe(false);
            expect(state.typingCharacters).toEqual([]);
        });
    });

    describe('getCurrentMessages', () => {
        it('should return messages for active chat', () => {
            const { addMessage, setActiveChat, getCurrentMessages } = useChatStore.getState();

            act(() => {
                addMessage({ chatId: 'miku', role: 'user', content: 'Hello!' });
                setActiveChat('miku');
            });

            const currentMessages = useChatStore.getState().getCurrentMessages();
            expect(currentMessages).toHaveLength(1);
            expect(currentMessages[0].content).toBe('Hello!');
        });
    });

    describe('getMessagesForChat', () => {
        it('should return messages for specified chat', () => {
            const { addMessage, getMessagesForChat } = useChatStore.getState();

            act(() => {
                addMessage({ chatId: 'itsuki', role: 'user', content: 'Food!' });
            });

            const messages = useChatStore.getState().getMessagesForChat('itsuki');
            expect(messages).toHaveLength(1);
            expect(messages[0].content).toBe('Food!');
        });
    });
});
