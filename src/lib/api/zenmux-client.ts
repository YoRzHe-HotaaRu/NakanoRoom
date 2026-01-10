import { CharacterId, getCharacter } from '../characters';

// Multimodal content types for ZenMux API
export type TextContent = { type: 'text'; text: string };
export type ImageContent = { type: 'image_url'; image_url: { url: string } };
export type FileContent = { type: 'file'; file: { filename: string; file_data: string } };
export type ContentPart = TextContent | ImageContent | FileContent;

// Attachment interface for frontend
export interface Attachment {
    base64: string;
    type: 'image' | 'pdf';
    filename: string;
    preview?: string; // For image thumbnails
}

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | ContentPart[];
}

interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// Per-character API configuration
interface CharacterApiConfig {
    apiKey: string;
    model: string;
    baseUrl: string;
}

// Get API configuration for a specific character
function getCharacterApiConfig(characterId: CharacterId): CharacterApiConfig {
    const baseUrl = process.env.ZENMUX_BASE_URL || 'https://zenmux.ai/api/v1';

    const configs: Record<CharacterId, CharacterApiConfig> = {
        ichika: {
            apiKey: process.env.ICHIKA_API_KEY || '',
            model: process.env.ICHIKA_MODEL || 'x-ai/grok-4.1-fast',
            baseUrl,
        },
        nino: {
            apiKey: process.env.NINO_API_KEY || '',
            model: process.env.NINO_MODEL || 'openai/gpt-5-nano',
            baseUrl,
        },
        miku: {
            apiKey: process.env.MIKU_API_KEY || '',
            model: process.env.MIKU_MODEL || 'google/gemini-2.5-flash-lite',
            baseUrl,
        },
        yotsuba: {
            apiKey: process.env.YOTSUBA_API_KEY || '',
            model: process.env.YOTSUBA_MODEL || 'openai/gpt-5-nano',
            baseUrl,
        },
        itsuki: {
            apiKey: process.env.ITSUKI_API_KEY || '',
            model: process.env.ITSUKI_MODEL || 'x-ai/grok-4.1-fast',
            baseUrl,
        },
    };

    return configs[characterId];
}

// Make API call with specific config
async function callChatApi(
    config: CharacterApiConfig,
    messages: ChatMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): Promise<string> {
    const request: ChatCompletionRequest = {
        model: config.model,
        messages,
        temperature: options?.temperature ?? 0.85,
        max_tokens: options?.maxTokens ?? 300,
        stream: false,
    };

    try {
        const response = await fetch(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data: ChatCompletionResponse = await response.json();

        // Debug: log the full response
        console.log(`API Response for request:`, JSON.stringify(data, null, 2).substring(0, 500));

        if (!data.choices || data.choices.length === 0) {
            console.error('No choices in response:', data);
            throw new Error('No response choices returned');
        }

        // Handle null/undefined content
        const content = data.choices[0].message?.content;
        if (!content) {
            console.error('Empty content in response. Full choice:', data.choices[0]);
            throw new Error('Empty response content received');
        }

        return content;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Clean response to remove character name prefixes
function cleanResponse(response: string | null | undefined, characterId: CharacterId): string {
    // Handle null/undefined responses
    if (!response) {
        return '';
    }

    const character = getCharacter(characterId);
    let cleaned = response.trim();

    // Remove [Name]: prefix at start
    cleaned = cleaned.replace(/^\[(?:Ichika|Nino|Miku|Yotsuba|Itsuki)\]:\s*/i, '');

    // Remove Name: prefix at start
    cleaned = cleaned.replace(/^(?:Ichika|Nino|Miku|Yotsuba|Itsuki):\s*/i, '');

    // Remove *Name* prefix at start
    cleaned = cleaned.replace(/^\*(?:Ichika|Nino|Miku|Yotsuba|Itsuki)\*\s*/i, '');

    // Remove ALL inline [Name]: patterns (including in the middle of text)
    cleaned = cleaned.replace(/\s*\[(?:Ichika|Nino|Miku|Yotsuba|Itsuki)\]:\s*/gi, ' ');

    // Cut off at any other character's response (newline followed by name)
    const otherCharPattern = /\n+\[(?:Ichika|Nino|Miku|Yotsuba|Itsuki)\]:/i;
    const match = cleaned.match(otherCharPattern);
    if (match && match.index !== undefined) {
        cleaned = cleaned.substring(0, match.index);
    }

    const otherCharPattern2 = /\n+(?:Ichika|Nino|Miku|Yotsuba|Itsuki):/i;
    const match2 = cleaned.match(otherCharPattern2);
    if (match2 && match2.index !== undefined) {
        cleaned = cleaned.substring(0, match2.index);
    }

    return cleaned.trim();
}

// Chat as a specific character using their dedicated API
export async function chatAsCharacter(
    characterId: CharacterId,
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    isGroupChat: boolean = false,
    attachment?: Attachment
): Promise<string> {
    const character = getCharacter(characterId);
    const config = getCharacterApiConfig(characterId);

    // Build system prompt
    let systemPrompt = character.systemPrompt;

    if (isGroupChat) {
        // Import and use the group chat prompts module
        const { getGroupChatPrompt } = await import('../prompts/group-chat-prompts');
        systemPrompt = getGroupChatPrompt(characterId, character.systemPrompt);
    }

    // Build user message content - multimodal if attachment present
    let userContent: string | ContentPart[];

    if (attachment) {
        const contentParts: ContentPart[] = [
            { type: 'text', text: userMessage || 'Please analyze this file.' }
        ];

        if (attachment.type === 'image') {
            contentParts.push({
                type: 'image_url',
                image_url: { url: attachment.base64 }
            });
        } else if (attachment.type === 'pdf') {
            contentParts.push({
                type: 'file',
                file: {
                    filename: attachment.filename,
                    file_data: attachment.base64
                }
            });
        }

        userContent = contentParts;
    } else {
        userContent = userMessage;
    }

    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userContent },
    ];

    const response = await callChatApi(config, messages, {
        temperature: isGroupChat ? 0.9 : 0.85,
        maxTokens: isGroupChat ? 150 : 300,
    });

    return cleanResponse(response, characterId);
}

// Get responses from multiple characters SEQUENTIALLY
// Each sister sees what previous sisters said and can react to them
export async function getGroupChatResponses(
    characterIds: CharacterId[],
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    attachment?: Attachment
): Promise<Map<CharacterId, string>> {
    const { buildSisterResponseContext, getResponseOrder, detectAddressedSisters } = await import('../prompts/group-chat-prompts');

    // Detect which sisters are being addressed in the user message
    const addressedSisters = detectAddressedSisters(userMessage);

    // Order responders (energetic ones first, quiet ones last)
    const orderedResponders = getResponseOrder(characterIds);

    const responses = new Map<CharacterId, string>();

    // Call APIs SEQUENTIALLY so each sister can see previous responses
    for (let i = 0; i < orderedResponders.length; i++) {
        const characterId = orderedResponders[i];
        try {
            // Build context with addressing awareness and sister responses
            const sisterContext = buildSisterResponseContext(responses, characterId, addressedSisters);

            // Combine user message with sister context
            const enrichedMessage = sisterContext
                ? `${userMessage}${sisterContext}`
                : userMessage;

            // Only pass attachment to the first responder
            const response = await chatAsCharacter(
                characterId,
                enrichedMessage,
                conversationHistory,
                true, // isGroupChat
                i === 0 ? attachment : undefined // Only first responder sees the attachment
            );

            if (response) {
                responses.set(characterId, response);
            }
        } catch (error) {
            console.error(`Failed to get response from ${characterId}:`, error);
        }
    }

    return responses;
}

// Health check for a specific character's API
export async function isCharacterApiAvailable(characterId: CharacterId): Promise<boolean> {
    const config = getCharacterApiConfig(characterId);

    try {
        const response = await fetch(`${config.baseUrl}/models`, {
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}
