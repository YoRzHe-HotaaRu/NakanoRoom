/**
 * End-to-End Tests for Nakano Room Chat Application
 */
import { test, expect } from '@playwright/test';

test.describe('Nakano Room Chat Application', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test.describe('Initial Load', () => {
        test('should display the application title', async ({ page }) => {
            await expect(page.getByText('五等分の花嫁')).toBeVisible();
        });

        test('should show all chat room options in sidebar', async ({ page }) => {
            await expect(page.getByText('Nakano Room')).toBeVisible();
            await expect(page.getByText('Yotsuba')).toBeVisible();
            await expect(page.getByText('Miku')).toBeVisible();
            await expect(page.getByText('Nino')).toBeVisible();
            await expect(page.getByText('Ichika')).toBeVisible();
            await expect(page.getByText('Itsuki')).toBeVisible();
        });

        test('should display character emojis', async ({ page }) => {
            await expect(page.getByText('🌸')).toBeVisible();
            await expect(page.getByText('🍀')).toBeVisible();
            await expect(page.getByText('🎧')).toBeVisible();
            await expect(page.getByText('🦋')).toBeVisible();
            await expect(page.getByText('🎭')).toBeVisible();
            await expect(page.getByText('⭐')).toBeVisible();
        });

        test('should have chat input visible', async ({ page }) => {
            await expect(page.getByPlaceholder('Type a message...')).toBeVisible();
        });

        test('should display the clock widget', async ({ page }) => {
            // Clock should show current time format
            await expect(page.locator('text=/\\d{1,2}:\\d{2}/')).toBeVisible();
        });
    });

    test.describe('Chat Selection', () => {
        test('should switch to Yotsuba chat when clicked', async ({ page }) => {
            await page.getByRole('button', { name: /Yotsuba/ }).click();
            await expect(page.getByText('The cheerful, energetic one')).toBeVisible();
        });

        test('should switch to Miku chat when clicked', async ({ page }) => {
            await page.getByRole('button', { name: /Miku/ }).click();
            await expect(page.getByText('The quiet history lover')).toBeVisible();
        });

        test('should switch to Nino chat when clicked', async ({ page }) => {
            await page.getByRole('button', { name: /Nino/ }).click();
            await expect(page.getByText('The tsundere chef')).toBeVisible();
        });

        test('should switch to group chat when clicked', async ({ page }) => {
            // First go to individual chat
            await page.getByRole('button', { name: /Yotsuba/ }).click();
            // Then back to group
            await page.getByRole('button', { name: /Nakano Room/ }).click();
            await expect(page.getByText('Chat with all five sisters!')).toBeVisible();
        });

        test('should show active indicator on selected chat', async ({ page }) => {
            const mikuButton = page.getByRole('button', { name: /Miku/ });
            await mikuButton.click();

            // Check for active styling (the button should have active class)
            await expect(mikuButton).toHaveClass(/active/);
        });
    });

    test.describe('Chat Input', () => {
        test('should allow typing in the input field', async ({ page }) => {
            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Hello, world!');
            await expect(input).toHaveValue('Hello, world!');
        });

        test('should have send button disabled when input is empty', async ({ page }) => {
            const sendButton = page.getByRole('button', { name: 'Send message' });
            await expect(sendButton).toBeDisabled();
        });

        test('should enable send button when input has text', async ({ page }) => {
            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Test message');

            const sendButton = page.getByRole('button', { name: 'Send message' });
            await expect(sendButton).toBeEnabled();
        });

        test('should clear input after sending message', async ({ page }) => {
            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Test message');

            await page.getByRole('button', { name: 'Send message' }).click();
            await expect(input).toHaveValue('');
        });
    });

    test.describe('Message Flow', () => {
        test('should display user message after sending', async ({ page }) => {
            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Hello Yotsuba!');

            await page.getByRole('button', { name: /Yotsuba/ }).click();
            await input.fill('Hi there!');
            await page.getByRole('button', { name: 'Send message' }).click();

            // User message should appear
            await expect(page.getByText('Hi there!')).toBeVisible();
        });

        test('should show typing indicator after sending message', async ({ page }) => {
            await page.getByRole('button', { name: /Miku/ }).click();

            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Tell me about history!');
            await page.getByRole('button', { name: 'Send message' }).click();

            // Typing indicator should appear (has text "typing...")
            await expect(page.getByText(/typing/)).toBeVisible({ timeout: 5000 });
        });

        // Note: This test requires actual API to work
        test.skip('should receive character response after sending message', async ({ page }) => {
            await page.getByRole('button', { name: /Yotsuba/ }).click();

            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Hello!');
            await page.getByRole('button', { name: 'Send message' }).click();

            // Wait for response (this depends on API)
            await expect(page.locator('.message-character')).toBeVisible({ timeout: 30000 });
        });
    });

    test.describe('Character Panel', () => {
        test('should show group display when on group chat', async ({ page }) => {
            await expect(page.getByText('五つ子')).toBeVisible();
            await expect(page.getByText('The Quintuplets')).toBeVisible();
        });

        test('should show character name when on individual chat', async ({ page }) => {
            await page.getByRole('button', { name: /Itsuki/ }).click();
            await expect(page.getByText('五月')).toBeVisible(); // Japanese name
            await expect(page.getByText('Itsuki')).toBeVisible();
        });

        test('should display character traits', async ({ page }) => {
            await page.getByRole('button', { name: /Miku/ }).click();

            // Miku's traits should be visible
            await expect(page.getByText(/history/i)).toBeVisible();
        });
    });

    test.describe('Anime Quote Widget', () => {
        test('should display a quote', async ({ page }) => {
            // At least one quote should be visible
            const quoteElement = page.locator('text=/".+"/');
            await expect(quoteElement).toBeVisible();
        });
    });

    test.describe('Responsive Design', () => {
        test('should be visible on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            // Main elements should still be accessible
            await expect(page.getByPlaceholder('Type a message...')).toBeVisible();
        });
    });

    test.describe('Empty State', () => {
        test('should show empty state message when no messages', async ({ page }) => {
            await expect(page.getByText('No messages yet')).toBeVisible();
            await expect(page.getByText(/Say hello/)).toBeVisible();
        });
    });

    test.describe('Keyboard Interaction', () => {
        test('should send message on Enter key', async ({ page }) => {
            await page.getByRole('button', { name: /Yotsuba/ }).click();

            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Testing Enter key');
            await input.press('Enter');

            // Message should be sent and input cleared
            await expect(input).toHaveValue('');
            await expect(page.getByText('Testing Enter key')).toBeVisible();
        });

        test('should not send message on Shift+Enter', async ({ page }) => {
            const input = page.getByPlaceholder('Type a message...');
            await input.fill('Line 1');
            await input.press('Shift+Enter');

            // Input should still have content (not sent)
            await expect(input).not.toHaveValue('');
        });
    });
});
