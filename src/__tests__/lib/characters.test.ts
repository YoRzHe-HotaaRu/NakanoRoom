/**
 * Unit tests for character data and utilities
 */
import {
    characters,
    chatRooms,
    getCharacter,
    getAllCharacterIds,
    getRandomKaomoji,
    CharacterId
} from '@/lib/characters';

describe('Character Data', () => {
    describe('characters object', () => {
        it('should contain all 5 Nakano sisters', () => {
            const characterIds = Object.keys(characters);
            expect(characterIds).toHaveLength(5);
            expect(characterIds).toContain('ichika');
            expect(characterIds).toContain('nino');
            expect(characterIds).toContain('miku');
            expect(characterIds).toContain('yotsuba');
            expect(characterIds).toContain('itsuki');
        });

        it('should have required properties for each character', () => {
            Object.values(characters).forEach((character) => {
                expect(character).toHaveProperty('id');
                expect(character).toHaveProperty('name');
                expect(character).toHaveProperty('japaneseName');
                expect(character).toHaveProperty('emoji');
                expect(character).toHaveProperty('color');
                expect(character).toHaveProperty('colorClass');
                expect(character).toHaveProperty('personality');
                expect(character).toHaveProperty('speakingStyle');
                expect(character).toHaveProperty('systemPrompt');
                expect(character).toHaveProperty('imageUrl');
                expect(character).toHaveProperty('traits');
            });
        });

        it('should have valid colors in hex format', () => {
            Object.values(characters).forEach((character) => {
                expect(character.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });

        it('should have personality array with at least 3 traits', () => {
            Object.values(characters).forEach((character) => {
                expect(character.personality.length).toBeGreaterThanOrEqual(3);
            });
        });

        it('should have non-empty system prompts', () => {
            Object.values(characters).forEach((character) => {
                expect(character.systemPrompt.length).toBeGreaterThan(100);
                expect(character.systemPrompt).toContain(character.name);
            });
        });
    });

    describe('chatRooms array', () => {
        it('should contain 6 chat rooms (group + 5 individual)', () => {
            expect(chatRooms).toHaveLength(6);
        });

        it('should have group chat as first item', () => {
            expect(chatRooms[0].id).toBe('group');
            expect(chatRooms[0].name).toBe('Nakano Room');
        });

        it('should have all individual character chats', () => {
            const individualChatIds = chatRooms.slice(1).map(room => room.id);
            expect(individualChatIds).toContain('yotsuba');
            expect(individualChatIds).toContain('miku');
            expect(individualChatIds).toContain('nino');
            expect(individualChatIds).toContain('ichika');
            expect(individualChatIds).toContain('itsuki');
        });
    });

    describe('getCharacter function', () => {
        it('should return correct character by ID', () => {
            const yotsuba = getCharacter('yotsuba');
            expect(yotsuba.name).toBe('Yotsuba');
            expect(yotsuba.emoji).toBe('🍀');
        });

        it('should return character with all properties', () => {
            const miku = getCharacter('miku');
            expect(miku.personality).toContain('quiet');
            expect(miku.speakingStyle).toContain('Soft-spoken');
        });
    });

    describe('getAllCharacterIds function', () => {
        it('should return array of all character IDs', () => {
            const ids = getAllCharacterIds();
            expect(ids).toHaveLength(5);
            expect(ids).toEqual(['ichika', 'nino', 'miku', 'yotsuba', 'itsuki']);
        });
    });

    describe('getRandomKaomoji function', () => {
        it('should return a string', () => {
            const kaomoji = getRandomKaomoji();
            expect(typeof kaomoji).toBe('string');
        });

        it('should return non-empty string', () => {
            const kaomoji = getRandomKaomoji();
            expect(kaomoji.length).toBeGreaterThan(0);
        });
    });
});

describe('Character Personas', () => {
    it('Ichika should have mature/actress traits', () => {
        const ichika = getCharacter('ichika');
        expect(ichika.personality).toContain('actress');
        expect(ichika.personality).toContain('mature');
        expect(ichika.systemPrompt.toLowerCase()).toContain('actress');
    });

    it('Nino should have tsundere traits', () => {
        const nino = getCharacter('nino');
        expect(nino.personality).toContain('tsundere');
        expect(nino.systemPrompt.toLowerCase()).toContain('tsundere');
    });

    it('Miku should have history/quiet traits', () => {
        const miku = getCharacter('miku');
        expect(miku.personality).toContain('quiet');
        expect(miku.systemPrompt.toLowerCase()).toContain('history');
        expect(miku.systemPrompt.toLowerCase()).toContain('sengoku');
    });

    it('Yotsuba should have cheerful/athletic traits', () => {
        const yotsuba = getCharacter('yotsuba');
        expect(yotsuba.personality).toContain('cheerful');
        expect(yotsuba.personality).toContain('athletic');
        expect(yotsuba.systemPrompt.toLowerCase()).toContain('energetic');
    });

    it('Itsuki should have studious/food traits', () => {
        const itsuki = getCharacter('itsuki');
        expect(itsuki.personality).toContain('studious');
        expect(itsuki.personality).toContain('food lover');
        expect(itsuki.systemPrompt.toLowerCase()).toContain('food');
    });
});
