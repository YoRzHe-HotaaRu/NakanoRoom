# Nakano Room 🌸✨

A beautiful, anime-themed chat application featuring the Nakano quintuplets from **The Quintessential Quintuplets** as AI chat companions.

![Quintessential Quintuplets](https://img.shields.io/badge/Anime-Quintessential%20Quintuplets-pink)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tests](https://img.shields.io/badge/Tests-51%20Passing-green)

## ✨ Features

- **Group Chat "Nakano Room" 🌸✨** - Chat with all five sisters at once! Multiple characters respond to your messages
- **Individual Character Chats** - Have private conversations with each sister
- **Authentic Personas** - Each character responds true to their anime personality
- **Beautiful Anime UI** - Cherry blossom theme with glassmorphism, animations, and decorations
- **Real-time Typing Indicators** - See when characters are responding
- **Message Persistence** - Chat history saved in localStorage
- **Responsive Design** - Works on desktop and mobile

## 🎭 Meet the Sisters

| Character | Emoji | Personality |
|-----------|-------|-------------|
| **Ichika** | 🎭 | Mature, flirty actress with big sister energy |
| **Nino** | 🦋 | Classic tsundere chef, protective of family |
| **Miku** | 🎧 | Quiet history nerd, loves Sengoku period |
| **Yotsuba** | 🍀 | Cheerful, athletic, always helping others |
| **Itsuki** | ⭐ | Studious food lover, wants to be a teacher |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or cd to project directory
cd NakanoRoom

# Install dependencies
npm install

# Create environment file (already included)
# Verify .env.local exists with API credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

## 🧪 Testing

```bash
# Run unit tests (51 tests)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires running dev server)
npm run test:e2e
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/chat/     # Chat API endpoint
│   └── page.tsx      # Main page
├── components/
│   ├── chat/         # Chat UI components
│   ├── character/    # Character panel
│   ├── decorations/  # Clock, quotes
│   └── layout/       # Main layout
├── lib/
│   ├── api/          # ZenMux client
│   └── characters.ts # Character definitions
├── store/            # Zustand store
└── __tests__/        # Unit tests
```

## 🔧 Configuration

The app uses ZenMux API (OpenAI-compatible). Environment variables in `.env.local`:

```env
ZENMUX_API_KEY=your-api-key
ZENMUX_BASE_URL=https://zenmux.ai/api/v1
ZENMUX_MODEL=x-ai/grok-4.1-fast
```

## 🎨 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom anime theme
- **Animations:** Motion (Framer Motion v12)
- **State:** Zustand with localStorage persistence
- **Testing:** Jest + React Testing Library + Playwright
- **LLM:** ZenMux API (Grok-4.1-fast)

## 📝 License

MIT - Made with 💖 for anime fans

---
*五等分の花嫁 © Negi Haruba. This is a fan project.*
