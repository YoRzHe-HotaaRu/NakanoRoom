import { CharacterId, getAllCharacterIds, getRandomKaomoji } from '../characters';

/**
 * Check for @mentions in the message and return guaranteed responders
 */
export function getAtMentionedCharacters(message: string): CharacterId[] {
    const mentioned: CharacterId[] = [];
    const lowerMessage = message.toLowerCase();

    // Check for @mentions (case insensitive)
    const mentionPatterns: Record<CharacterId, RegExp[]> = {
        ichika: [/@ichika/i, /@いちか/i],
        nino: [/@nino/i, /@にの/i],
        miku: [/@miku/i, /@みく/i],
        yotsuba: [/@yotsuba/i, /@よつば/i],
        itsuki: [/@itsuki/i, /@いつき/i],
    };

    for (const [id, patterns] of Object.entries(mentionPatterns)) {
        for (const pattern of patterns) {
            if (pattern.test(message)) {
                mentioned.push(id as CharacterId);
                break;
            }
        }
    }

    return mentioned;
}

/**
 * Check if a character's name is mentioned (without @)
 */
function isNameMentioned(message: string, characterId: CharacterId): boolean {
    const lowerMessage = message.toLowerCase();

    // Name variations (including nicknames and Japanese)
    const nameVariations: Record<CharacterId, string[]> = {
        ichika: ['ichika', 'いちか', 'onee-san', 'big sis'],
        nino: ['nino', 'にの'],
        miku: ['miku', 'みく'],
        yotsuba: ['yotsuba', 'よつば', 'yots'],
        itsuki: ['itsuki', 'いつき', 'eatsuki'],
    };

    return nameVariations[characterId].some(name => lowerMessage.includes(name));
}

/**
 * Selects which characters will respond in the group chat
 * Returns 1-3 characters, with higher probability for relevant responders
 * @mentions guarantee the character will respond
 */
export function selectGroupChatResponders(
    userMessage: string,
    previousResponders: CharacterId[] = []
): CharacterId[] {
    const allCharacters = getAllCharacterIds();

    // First, check for @mentions - these characters ALWAYS respond
    const atMentioned = getAtMentionedCharacters(userMessage);

    // If there are @mentions, they respond first, then optionally add others
    if (atMentioned.length > 0) {
        // If 2+ characters are @mentioned, just return them
        if (atMentioned.length >= 2) {
            return atMentioned;
        }

        // If 1 character is @mentioned, they respond + maybe 0-1 others
        const othersCount = Math.random() < 0.5 ? 1 : 0;
        if (othersCount === 0) {
            return atMentioned;
        }

        // Add one random other character
        const availableOthers = allCharacters.filter(id => !atMentioned.includes(id));
        const weights = calculateResponseWeights(userMessage, availableOthers, previousResponders);
        const selectedOther = weightedRandomSelect(availableOthers, weights);

        if (selectedOther) {
            return [...atMentioned, selectedOther];
        }
        return atMentioned;
    }

    // No @mentions - use weighted selection (1-3 characters)
    const responseCount = Math.floor(Math.random() * 3) + 1;

    // Weight characters based on message content relevance
    const weights = calculateResponseWeights(userMessage, allCharacters, previousResponders);

    // Select characters based on weights
    const selected: CharacterId[] = [];
    const available = [...allCharacters];

    for (let i = 0; i < Math.min(responseCount, available.length); i++) {
        const selectedChar = weightedRandomSelect(available, weights);
        if (selectedChar) {
            selected.push(selectedChar);
            const idx = available.indexOf(selectedChar);
            if (idx > -1) available.splice(idx, 1);
        }
    }

    return selected;
}

/**
 * Select a random character based on weights
 */
function weightedRandomSelect(
    characters: CharacterId[],
    weights: Map<CharacterId, number>
): CharacterId | null {
    const totalWeight = characters.reduce((sum, id) => sum + (weights.get(id) || 1), 0);
    let random = Math.random() * totalWeight;

    for (const id of characters) {
        const weight = weights.get(id) || 1;
        random -= weight;
        if (random <= 0) {
            return id;
        }
    }

    return characters.length > 0 ? characters[0] : null;
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
        ichika: ['movie', 'acting', 'actress', 'drama', 'film', 'older', 'sister', 'work', 'job', 'date', 'flirt', 'cute'],
        nino: ['cook', 'cooking', 'food', 'recipe', 'fashion', 'clothes', 'style', 'dress', 'hate', 'love', 'protect', 'tsundere'],
        miku: ['history', 'sengoku', 'samurai', 'japan', 'war', 'quiet', 'headphones', 'music', 'shy', 'warrior'],
        yotsuba: ['help', 'sport', 'run', 'exercise', 'team', 'club', 'fun', 'play', 'yay', 'happy', 'genki', 'energy'],
        itsuki: ['study', 'school', 'teacher', 'food', 'eat', 'hungry', 'meat', 'learn', 'test', 'exam', 'star', 'first'],
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

        // BOOST if character's name is mentioned (without @)
        if (isNameMentioned(message, id)) {
            weight += 5.0; // Strong boost for name mentions
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
