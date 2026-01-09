import { NextRequest, NextResponse } from 'next/server';
import { chatAsCharacter, getGroupChatResponses } from '@/lib/api/zenmux-client';
import {
    selectGroupChatResponders,
    shouldSendKaomojiOnly,
    generateReaction
} from '@/lib/api/group-chat-logic';
import { CharacterId } from '@/lib/characters';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    characterId?: CharacterId;
}

interface ChatRequest {
    chatId: 'group' | CharacterId;
    message: string;
    history?: ChatMessage[];
}

interface CharacterResponse {
    characterId: CharacterId;
    content: string;
    isReaction: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { chatId, message, history = [] } = body;

        if (!message?.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Convert history to API format (simplified - sister context is now injected separately)
        const conversationHistory = history.slice(-8).map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));

        if (chatId === 'group') {
            // Group chat - characters respond SEQUENTIALLY so they can react to each other
            const responders = selectGroupChatResponders(message);
            const responses: CharacterResponse[] = [];

            // Separate kaomoji-only responders from full responders
            const kaomojiResponders: CharacterId[] = [];
            const fullResponders: CharacterId[] = [];

            for (const characterId of responders) {
                if (shouldSendKaomojiOnly()) {
                    kaomojiResponders.push(characterId);
                } else {
                    fullResponders.push(characterId);
                }
            }

            // Add kaomoji responses immediately
            for (const characterId of kaomojiResponders) {
                responses.push({
                    characterId,
                    content: generateReaction(characterId),
                    isReaction: true,
                });
            }

            // Get full responses in PARALLEL using separate API keys
            if (fullResponders.length > 0) {
                const parallelResponses = await getGroupChatResponses(
                    fullResponders,
                    message,
                    conversationHistory
                );

                for (const [characterId, content] of parallelResponses) {
                    responses.push({
                        characterId,
                        content,
                        isReaction: false,
                    });
                }
            }

            // Sort responses by a deterministic order for consistency
            const characterOrder: CharacterId[] = ['yotsuba', 'miku', 'nino', 'ichika', 'itsuki'];
            responses.sort((a, b) =>
                characterOrder.indexOf(a.characterId) - characterOrder.indexOf(b.characterId)
            );

            return NextResponse.json({
                type: 'group',
                responses
            });
        } else {
            // Individual chat - single character responds
            const characterId = chatId as CharacterId;

            try {
                const response = await chatAsCharacter(
                    characterId,
                    message,
                    conversationHistory,
                    false // not group chat
                );

                return NextResponse.json({
                    type: 'individual',
                    responses: [{
                        characterId,
                        content: response,
                        isReaction: false,
                    }],
                });
            } catch (error) {
                console.error(`Error getting response from ${characterId}:`, error);
                return NextResponse.json(
                    { error: 'Failed to get response from character' },
                    { status: 500 }
                );
            }
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
