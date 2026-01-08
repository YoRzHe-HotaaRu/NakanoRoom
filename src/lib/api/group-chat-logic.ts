import { CharacterId, getAllCharacterIds, getRandomKaomoji } from '../characters';

/**
 * Selects which characters will respond in the group chat
 * Returns 1-3 characters, with higher probability for relevant responders
 */
export function selectGroupChatResponders(
    userMessage: string,
    previousResponders: CharacterId[] = []
): CharacterId[] {
    const allCharacters = getAllCharacterIds();

    // Determine how many characters will respond (1-3)
    const responseCount = Math.floor(Math.random() * 3) + 1;

    // Weight characters based on message content relevance
    const weights = calculateResponseWeights(userMessage, allCharacters, previousResponders);

    // Select characters based on weights
    const selected: CharacterId[] = [];
    const available = [...allCharacters];

    for (let i = 0; i < Math.min(responseCount, available.length); i++) {
        const totalWeight = available.reduce((sum, id) => sum + (weights.get(id) || 1), 0);
        let random = Math.random() * totalWeight;

        for (let j = 0; j < available.length; j++) {
            const id = available[j];
            const weight = weights.get(id) || 1;
            random -= weight;

            if (random <= 0) {
                selected.push(id);
                available.splice(j, 1);
                break;
            }
        }
    }

    return selected;
}

/**
 * Calculate response probability weights based on message content
 */
function calculateResponseWeights(
    message: string,
    characters: CharacterId[],
    previousResponders: CharacterId[]
): Map<CharacterId, number> {
    const weights = new Map<CharacterId, number>();
    const lowerMessage = message.toLowerCase();

    // Keyword mappings for each character
    const keywords: Record<CharacterId, string[]> = {
        ichika: ['movie', 'acting', 'actress', 'drama', 'film', 'older', 'sister', 'work', 'job', 'date'],
        nino: ['cook', 'food', 'recipe', 'fashion', 'clothes', 'style', 'dress', 'hate', 'love', 'protect'],
        miku: ['history', 'sengoku', 'samurai', 'japan', 'war', 'quiet', 'headphones', 'music', 'shy'],
        yotsuba: ['help', 'sport', 'run', 'exercise', 'team', 'club', 'fun', 'play', 'yay', 'happy'],
        itsuki: ['study', 'school', 'teacher', 'food', 'eat', 'hungry', 'meat', 'learn', 'test', 'exam'],
    };

    for (const id of characters) {
        let weight = 1.0;

        // Boost weight if message contains relevant keywords
        for (const keyword of keywords[id]) {
            if (lowerMessage.includes(keyword)) {
                weight += 1.5;
            }
        }

        // Slight penalty for characters who just responded
        if (previousResponders.includes(id)) {
            weight *= 0.7;
        }

        // Check if character is mentioned by name
        if (lowerMessage.includes(id)) {
            weight += 3;
        }

        weights.set(id, Math.max(weight, 0.3));
    }

    return weights;
}

/**
 * Determine if a character should send just a kaomoji/short reaction
 */
export function shouldSendKaomojiOnly(): boolean {
    // 15% chance of just sending a kaomoji
    return Math.random() < 0.15;
}

/**
 * Generate a reaction-only response
 */
export function generateReaction(characterId: CharacterId): string {
    const reactions: Record<CharacterId, string[]> = {
        ichika: ['♡', 'Fufu~', getRandomKaomoji(), '(*´▽`*)', 'Ara ara~'],
        nino: ['Hmph!', '...', getRandomKaomoji(), '(｀ε´)', 'Whatever...'],
        miku: ['...', getRandomKaomoji(), '(´・ω・`)', 'Hmm...', 'I see...'],
        yotsuba: ['Yay!', getRandomKaomoji(), '(ノ´ヮ`)ノ*: ・゚✧', 'Woohoo!', '٩(◕‿◕｡)۶'],
        itsuki: [getRandomKaomoji(), '(╯︵╰,)', 'Hmm...', '*nods*', '( ・ิω・ิ)'],
    };

    const characterReactions = reactions[characterId];
    return characterReactions[Math.floor(Math.random() * characterReactions.length)];
}

/**
 * Add typing delay simulation based on message length
 */
export function calculateTypingDelay(messageLength: number): number {
    // Base delay + time per character (simulating typing speed)
    const baseDelay = 500;
    const charDelay = 20;
    const maxDelay = 3000;

    return Math.min(baseDelay + (messageLength * charDelay), maxDelay);
}
