import { NextRequest, NextResponse } from 'next/server';
import { chatAsCharacter, getGroupChatResponses, Attachment } from '@/lib/api/zenmux-client';
import {
    selectGroupChatResponders,
    shouldSendKaomojiOnly,
    generateReaction
} from '@/lib/api/group-chat-logic';
import { CharacterId } from '@/lib/characters';

// CORS headers for mobile app (Capacitor)
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Helper to add CORS headers to JSON responses
function jsonWithCors(data: unknown, init?: { status?: number }) {
    return NextResponse.json(data, {
        ...init,
        headers: corsHeaders,
    });
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    characterId?: CharacterId;
}

interface ChatRequest {
    chatId: 'group' | CharacterId;
    message: string;
    history?: ChatMessage[];
    attachment?: Attachment;
}

interface CharacterResponse {
    characterId: CharacterId;
    content: string;
    isReaction: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { chatId, message, history = [], attachment } = body;

        if (!message?.trim()) {
            return jsonWithCors(
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
                    conversationHistory,
                    attachment // Pass attachment for group chat
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

            return jsonWithCors({
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
                    false, // not group chat
                    attachment // pass attachment if present
                );

                return jsonWithCors({
                    type: 'individual',
                    responses: [{
                        characterId,
                        content: response,
                        isReaction: false,
                    }],
                });
            } catch (error) {
                console.error(`Error getting response from ${characterId}:`, error);
                return jsonWithCors(
                    { error: 'Failed to get response from character' },
                    { status: 500 }
                );
            }
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        return jsonWithCors(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
