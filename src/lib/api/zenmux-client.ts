import { CharacterId, getCharacter } from '../characters';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
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

export class ZenMuxClient {
    private apiKey: string;
    private baseUrl: string;
    private model: string;

    constructor() {
        this.apiKey = process.env.ZENMUX_API_KEY || '';
        this.baseUrl = process.env.ZENMUX_BASE_URL || 'https://zenmux.ai/api/v1';
        this.model = process.env.ZENMUX_MODEL || 'x-ai/grok-4.1-fast';

        if (!this.apiKey) {
            console.warn('ZENMUX_API_KEY is not set');
        }
    }

    async chat(
        messages: ChatMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<string> {
        const request: ChatCompletionRequest = {
            model: this.model,
            messages,
            temperature: options?.temperature ?? 0.8,
            max_tokens: options?.maxTokens ?? 500,
            stream: false,
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ZenMux API error: ${response.status} - ${errorText}`);
            }

            const data: ChatCompletionResponse = await response.json();

            if (!data.choices || data.choices.length === 0) {
                throw new Error('No response choices returned from ZenMux');
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('ZenMux API call failed:', error);
            throw error;
        }
    }

    async chatAsCharacter(
        characterId: CharacterId,
        userMessage: string,
        conversationHistory: ChatMessage[] = []
    ): Promise<string> {
        const character = getCharacter(characterId);

        const messages: ChatMessage[] = [
            { role: 'system', content: character.systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage },
        ];

        return this.chat(messages, { temperature: 0.85 });
    }

    async groupChatResponse(
        respondingCharacters: CharacterId[],
        userMessage: string,
        conversationHistory: ChatMessage[] = []
    ): Promise<Map<CharacterId, string>> {
        const responses = new Map<CharacterId, string>();

        // Get responses from each participating character INDIVIDUALLY
        for (const characterId of respondingCharacters) {
            try {
                const character = getCharacter(characterId);

                // Clear instruction that this character responds ONLY as themselves
                const groupContext = `You are in a group chat with all your sisters and someone is messaging the group. 
IMPORTANT RULES:
1. Respond ONLY as ${character.name} - do NOT include responses from other characters
2. Do NOT prefix your response with your name or "[${character.name}]:"
3. Keep your response brief (1-3 sentences) since others might also reply
4. Stay completely in character as ${character.name}
5. Sometimes you can just react with a kaomoji if appropriate`;

                const messages: ChatMessage[] = [
                    { role: 'system', content: `${character.systemPrompt}\n\n${groupContext}` },
                    ...conversationHistory,
                    { role: 'user', content: userMessage },
                ];

                let response = await this.chat(messages, {
                    temperature: 0.9,
                    maxTokens: 150 // Shorter responses for group chat
                });

                // Clean the response - remove any character name prefixes
                response = this.cleanResponse(response, characterId);

                responses.set(characterId, response);
            } catch (error) {
                console.error(`Failed to get response from ${characterId}:`, error);
                // Continue with other characters even if one fails
            }
        }

        return responses;
    }

    // Clean LLM response to remove name prefixes and other characters' responses
    private cleanResponse(response: string, characterId: CharacterId): string {
        const character = getCharacter(characterId);

        // Remove common prefixes like "[Name]:", "Name:", "*Name*"
        const prefixPatterns = [
            new RegExp(`^\\[${character.name}\\]:\\s*`, 'i'),
            new RegExp(`^${character.name}:\\s*`, 'i'),
            new RegExp(`^\\*${character.name}\\*\\s*`, 'i'),
        ];

        let cleaned = response.trim();
        for (const pattern of prefixPatterns) {
            cleaned = cleaned.replace(pattern, '');
        }

        // If the response contains other character names with prefixes, 
        // only keep the part before other characters speak
        const otherCharNames = ['Ichika', 'Nino', 'Miku', 'Yotsuba', 'Itsuki'];
        for (const name of otherCharNames) {
            if (name.toLowerCase() !== character.name.toLowerCase()) {
                // Check if another character's response is included
                const otherPattern = new RegExp(`\\n*\\[${name}\\]:.*`, 'is');
                cleaned = cleaned.replace(otherPattern, '');

                const otherPattern2 = new RegExp(`\\n+${name}:.*`, 'is');
                cleaned = cleaned.replace(otherPattern2, '');
            }
        }

        return cleaned.trim();
    }

    // Health check
    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Singleton instance for server-side usage
let clientInstance: ZenMuxClient | null = null;

export function getZenMuxClient(): ZenMuxClient {
    if (!clientInstance) {
        clientInstance = new ZenMuxClient();
    }
    return clientInstance;
}
