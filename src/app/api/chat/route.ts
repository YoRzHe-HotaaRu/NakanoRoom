import { NextRequest, NextResponse } from 'next/server';
import { getZenMuxClient } from '@/lib/api/zenmux-client';
import {
    selectGroupChatResponders,
    shouldSendKaomojiOnly,
    generateReaction
} from '@/lib/api/group-chat-logic';
import { CharacterId, getCharacter } from '@/lib/characters';

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

        const client = getZenMuxClient();

        // Convert history to API format
        const conversationHistory = history.slice(-10).map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.characterId
                ? `[${getCharacter(msg.characterId).name}]: ${msg.content}`
                : msg.content,
        }));

        if (chatId === 'group') {
            // Group chat - multiple characters may respond
            const responders = selectGroupChatResponders(message);
            const responses: CharacterResponse[] = [];

            for (const characterId of responders) {
                // Check if this character will just send a kaomoji
                if (shouldSendKaomojiOnly()) {
                    responses.push({
                        characterId,
                        content: generateReaction(characterId),
                        isReaction: true,
                    });
                } else {
                    try {
                        const response = await client.chatAsCharacter(
                            characterId,
                            message,
                            conversationHistory
                        );
                        responses.push({
                            characterId,
                            content: response,
                            isReaction: false,
                        });
                    } catch (error) {
                        console.error(`Error getting response from ${characterId}:`, error);
                        // Add a fallback reaction if API fails
                        responses.push({
                            characterId,
                            content: generateReaction(characterId),
                            isReaction: true,
                        });
                    }
                }
            }

            return NextResponse.json({
                type: 'group',
                responses
            });
        } else {
            // Individual chat - single character responds
            const characterId = chatId as CharacterId;

            try {
                const response = await client.chatAsCharacter(
                    characterId,
                    message,
                    conversationHistory
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
