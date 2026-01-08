/**
 * Unit tests for group chat logic
 */
import {
    selectGroupChatResponders,
    shouldSendKaomojiOnly,
    generateReaction,
    calculateTypingDelay
} from '@/lib/api/group-chat-logic';
import { CharacterId } from '@/lib/characters';

describe('Group Chat Logic', () => {
    describe('selectGroupChatResponders', () => {
        it('should return 1-3 characters', () => {
            // Run multiple times to test randomness
            for (let i = 0; i < 10; i++) {
                const responders = selectGroupChatResponders('Hello!');
                expect(responders.length).toBeGreaterThanOrEqual(1);
                expect(responders.length).toBeLessThanOrEqual(3);
            }
        });

        it('should return unique characters', () => {
            for (let i = 0; i < 10; i++) {
                const responders = selectGroupChatResponders('Test message');
                const uniqueResponders = [...new Set(responders)];
                expect(uniqueResponders.length).toBe(responders.length);
            }
        });

        it('should weight Miku higher for history-related messages', () => {
            let mikuCount = 0;
            const iterations = 50;

            for (let i = 0; i < iterations; i++) {
                const responders = selectGroupChatResponders('Tell me about Sengoku history');
                if (responders.includes('miku')) {
                    mikuCount++;
                }
            }

            // Miku should appear more often than random chance (1/5 = 20%)
            expect(mikuCount / iterations).toBeGreaterThan(0.3);
        });

        it('should weight Itsuki higher for food-related messages', () => {
            let itsukiCount = 0;
            const iterations = 50;

            for (let i = 0; i < iterations; i++) {
                const responders = selectGroupChatResponders('What should we eat for dinner?');
                if (responders.includes('itsuki')) {
                    itsukiCount++;
                }
            }

            expect(itsukiCount / iterations).toBeGreaterThan(0.3);
        });

        it('should weight Yotsuba higher for help-related messages', () => {
            let yotsubaCount = 0;
            const iterations = 50;

            for (let i = 0; i < iterations; i++) {
                const responders = selectGroupChatResponders('Can someone help me with this?');
                if (responders.includes('yotsuba')) {
                    yotsubaCount++;
                }
            }

            expect(yotsubaCount / iterations).toBeGreaterThan(0.3);
        });

        it('should prioritize mentioned character', () => {
            let ninoCount = 0;
            const iterations = 50;

            for (let i = 0; i < iterations; i++) {
                const responders = selectGroupChatResponders('Hey nino, what do you think?');
                if (responders.includes('nino')) {
                    ninoCount++;
                }
            }

            expect(ninoCount / iterations).toBeGreaterThan(0.5);
        });

        it('should reduce weight for previous responders', () => {
            let sameResponderCount = 0;
            const iterations = 50;

            for (let i = 0; i < iterations; i++) {
                const firstResponders = selectGroupChatResponders('First message');
                const secondResponders = selectGroupChatResponders('Second message', firstResponders);

                // Check if first responders appear in second round
                const overlap = firstResponders.filter(r => secondResponders.includes(r));
                if (overlap.length === firstResponders.length) {
                    sameResponderCount++;
                }
            }

            // Same responders should not always repeat
            expect(sameResponderCount / iterations).toBeLessThan(0.5);
        });
    });

    describe('shouldSendKaomojiOnly', () => {
        it('should return boolean', () => {
            const result = shouldSendKaomojiOnly();
            expect(typeof result).toBe('boolean');
        });

        it('should return true approximately 15% of the time', () => {
            let trueCount = 0;
            const iterations = 1000;

            for (let i = 0; i < iterations; i++) {
                if (shouldSendKaomojiOnly()) {
                    trueCount++;
                }
            }

            const percentage = trueCount / iterations;
            expect(percentage).toBeGreaterThan(0.1);
            expect(percentage).toBeLessThan(0.25);
        });
    });

    describe('generateReaction', () => {
        const allCharacters: CharacterId[] = ['ichika', 'nino', 'miku', 'yotsuba', 'itsuki'];

        it('should return a string for each character', () => {
            allCharacters.forEach((characterId) => {
                const reaction = generateReaction(characterId);
                expect(typeof reaction).toBe('string');
                expect(reaction.length).toBeGreaterThan(0);
            });
        });

        it('should return character-appropriate reactions', () => {
            // Test multiple times for Yotsuba (should be energetic)
            let yayCount = 0;
            for (let i = 0; i < 50; i++) {
                const reaction = generateReaction('yotsuba');
                if (reaction.includes('Yay') || reaction.includes('Woohoo')) {
                    yayCount++;
                }
            }
            expect(yayCount).toBeGreaterThan(0);

            // Test Nino (should have tsundere reactions)
            let tsundereCount = 0;
            for (let i = 0; i < 50; i++) {
                const reaction = generateReaction('nino');
                if (reaction.includes('Hmph') || reaction.includes('Whatever')) {
                    tsundereCount++;
                }
            }
            expect(tsundereCount).toBeGreaterThan(0);
        });
    });

    describe('calculateTypingDelay', () => {
        it('should return base delay for short messages', () => {
            const delay = calculateTypingDelay(0);
            expect(delay).toBe(500); // Base delay
        });

        it('should increase delay with message length', () => {
            const shortDelay = calculateTypingDelay(10);
            const longDelay = calculateTypingDelay(50);
            expect(longDelay).toBeGreaterThan(shortDelay);
        });

        it('should cap at maximum delay', () => {
            const veryLongDelay = calculateTypingDelay(1000);
            expect(veryLongDelay).toBe(3000); // Max delay
        });

        it('should calculate correct delay for medium message', () => {
            const delay = calculateTypingDelay(50);
            // 500 (base) + 50 * 20 = 1500
            expect(delay).toBe(1500);
        });
    });
});
