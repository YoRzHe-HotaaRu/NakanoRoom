# 🌸 Nakano Room - Chat with the Beautiful Quintuplets!

<div align="center">
  <img src="public/Asset/NakanoRoom/NakanoRoomChatPic.jpg" alt="Nakano Room" width="200" style="border-radius: 20px"/>
  
  *Your cozy corner to hang out and chat with the five adorable Nakano sisters!*
</div>

---

Welcome to **Nakano Room** – an AI-powered chat application where you can hang out with the Nakano quintuplets from *The Quintessential Quintuplets* (五等分の花嫁)!

Whether you want to talk about history with Miku, get cooking tips from Nino, or just have fun with Yotsuba's endless energy, this app brings the quintuplets to life with AI-powered conversations.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **Individual Chats** | One-on-one conversations with each sister |
| 🌸 **Group Chat** | Chat with all five sisters at once in the Nakano Room |
| 📱 **Mobile App** | Native Android APK with Capacitor |
| 🎬 **Animated Wallpaper** | Anime OPs playing as background video |
| 🎵 **Background Music** | Listen to OPs with mute toggle |
| 📸 **Image Galleries** | Rotating character slideshows |
| 💬 **Context Menus** | Right-click (desktop) or tap interactions (mobile) |
| ↩️ **Reply Feature** | Quote and reply to any message |
| 😊 **Emoji & Kaomoji** | Quick emoji picker with cute kaomoji |
| @️ **Mentions** | Type `@` to mention specific sisters |

---

## 📸 Screenshots

<div align="center">

### Welcome Screen
<img src="public/Asset/Screenshot/WelcomeScreen.png" alt="Welcome Screen" width="700"/>

### Desktop View - Group Chat
<img src="public/Asset/Screenshot/1.png" alt="Group Chat" width="700"/>

### Individual Character Chats
<table>
<tr>
<td><img src="public/Asset/Screenshot/2.png" alt="Nino" width="350"/></td>
<td><img src="public/Asset/Screenshot/3.png" alt="Miku" width="350"/></td>
</tr>
<tr>
<td><img src="public/Asset/Screenshot/4.png" alt="Yotsuba" width="350"/></td>
<td><img src="public/Asset/Screenshot/5.png" alt="Itsuki" width="350"/></td>
</tr>
</table>

</div>

---

## 🎭 Meet the Nakano Sisters

<table>
<tr>
<td align="center" width="20%">
<img src="public/Asset/ProfilePic/Ichika.jpg" alt="Ichika" width="100" style="border-radius: 50%"/><br/>
<b>🎭 Ichika</b><br/>
<sub>The Eldest Sister</sub>
</td>
<td align="center" width="20%">
<img src="public/Asset/ProfilePic/Nino.png" alt="Nino" width="100" style="border-radius: 50%"/><br/>
<b>🦋 Nino</b><br/>
<sub>The Tsundere Chef</sub>
</td>
<td align="center" width="20%">
<img src="public/Asset/ProfilePic/Miku.png" alt="Miku" width="100" style="border-radius: 50%"/><br/>
<b>🎧 Miku</b><br/>
<sub>The Quiet Historian</sub>
</td>
<td align="center" width="20%">
<img src="public/Asset/ProfilePic/Yotsuba.png" alt="Yotsuba" width="100" style="border-radius: 50%"/><br/>
<b>🍀 Yotsuba</b><br/>
<sub>The Energetic Helper</sub>
</td>
<td align="center" width="20%">
<img src="public/Asset/ProfilePic/Itsuki.jpg" alt="Itsuki" width="100" style="border-radius: 50%"/><br/>
<b>⭐ Itsuki</b><br/>
<sub>The Studious Foodie</sub>
</td>
</tr>
</table>

### Character Details

| Sister | Color | Personality | Signature Trait |
|--------|-------|-------------|-----------------|
| **Ichika** | 💗 Pink | Mature, flirty, caring | Always calls you "sweetie" ♡ |
| **Nino** | 🦋 Coral | Tsundere, passionate, loyal | "It's not like I care or anything!" |
| **Miku** | 💙 Blue | Shy, nerdy, sweet | Can talk about Sengoku warlords for hours |
| **Yotsuba** | 💚 Green | Energetic, selfless, cheerful | Never says no to helping! |
| **Itsuki** | ⭐ Orange | Studious, honest, hungry | Gets VERY excited about meat 🍖 |

---

## 🧠 How the AI Magic Works

Nakano Room isn't just a simple chatbot – it's an intelligent multi-character AI system where each sister has her own personality, and they're all aware of each other!

### 📖 The Concept: You Are the Tutor

Just like in the anime, **you play the role of the tutor** (like Fuutarou Uesugi). Each sister knows you're their tutor and has her own feelings toward you!

```
      You (The Tutor)
            │
    ┌───────┼───────┐
    │       │       │
    ▼       ▼       ▼
 Ichika  Nino   Miku
 (flirty) (tsundere) (shy)
            │
    ┌───────┴───────┐
    ▼               ▼
 Yotsuba         Itsuki
 (supportive)    (studious)
```

---

## 🏗️ System Architecture

### High-Level Flow

```mermaid
flowchart LR
    User[👤 User Message] --> Frontend[🖥️ Next.js Frontend]
    Frontend --> API[📡 API Route]
    API --> Router{Individual or Group?}
    Router -->|Individual| Single[🎭 Single Character AI]
    Router -->|Group| Multi[👥 Multi-Character System]
    Single --> LLM[🤖 LLM API]
    Multi --> LLM
    LLM --> Response[💬 Character Responses]
    Response --> Frontend
```

### Individual Chat Flow
When you chat one-on-one with a sister, she responds with her unique personality.

```mermaid
sequenceDiagram
    participant You
    participant Miku
    participant AI as LLM API
    
    You->>Miku: "What's your favorite historical period?"
    Miku->>AI: [Miku's personality + Your message]
    AI->>Miku: Generate shy, history-focused response
    Miku->>You: "...The Sengoku period... Takeda Shingen was amazing..."
```

---

## 👥 Group Chat: The Nakano Room

The most exciting feature! When you chat in the group, **all five sisters respond**, and they're aware of what each other said!

### How Group Chat Works

```mermaid
flowchart TD
    subgraph Step1["1️⃣ Your Message Arrives"]
        User[/"Hey everyone, what's for dinner?"/]
    end
    
    subgraph Step2["2️⃣ Detect Who's Addressed"]
        Detect["🔍 Scan for names mentioned"]
        Detect --> Result["Nobody specific = everyone responds!"]
    end
    
    subgraph Step3["3️⃣ Sisters Respond In Order"]
        Y["🍀 Yotsuba responds first (most energetic)"]
        Y --> N["🦋 Nino responds (sees Yotsuba's answer)"]
        N --> I1["🎭 Ichika responds (sees both)"]
        I1 --> I2["⭐ Itsuki responds (food topic!)"]
        I2 --> M["🎧 Miku responds last (quiet)"]
    end
    
    Step1 --> Step2 --> Step3
```

### Sequential Response System

Each sister sees what her sisters said before her, creating natural conversations:

| Order | Sister | She Can See |
|-------|--------|-------------|
| 1st | Yotsuba | Just your message |
| 2nd | Nino | Your message + Yotsuba's reply |
| 3rd | Ichika | Your message + Yotsuba + Nino |
| 4th | Itsuki | Your message + all 3 sisters |
| 5th | Miku | Your message + all 4 sisters |

---

## 🎯 Context Awareness System

A smart system that prevents sisters from "stealing" responses meant for others!

### The Problem We Solved

Without context awareness:
```
You: "That's amazing, Itsuki!!"
Yotsuba: "Thank you so much!" ❌ (Wrong! Itsuki was praised)
```

With context awareness:
```
You: "That's amazing, Itsuki!!"
Itsuki: "Thank you! I worked hard on this!" ✅
Yotsuba: "Way to go, Itsuki!!" ✅ (Cheers for her sister)
```

### How It Works

```mermaid
flowchart LR
    subgraph Detection["🔍 Name Detection"]
        Msg["'Great job Itsuki!'"] --> Parser["Scan for names"]
        Parser --> Found["Found: Itsuki"]
    end
    
    subgraph Context["📋 Context Injection"]
        Found --> Context1["Itsuki: 'You're talking to ME!'"]
        Found --> Context2["Others: 'They're talking to Itsuki, not you'"]
    end
    
    subgraph Response["💬 Smart Responses"]
        Context1 --> R1["Itsuki thanks you directly"]
        Context2 --> R2["Others congratulate Itsuki"]
    end
```

### The Awareness Rules

Each sister follows these rules:
1. ✅ **If addressed directly** → Respond to the message
2. ✅ **If another sister is addressed** → React appropriately (tease, cheer, etc.)
3. ❌ **Never steal compliments** meant for another sister
4. ❌ **Never answer questions** directed at another sister

---

## 🔄 Response Order Logic

The sisters respond in a specific personality-based order:

```
Most Energetic ─────────────────────► Most Quiet

🍀 Yotsuba → 🦋 Nino → 🎭 Ichika → ⭐ Itsuki → 🎧 Miku
   (1st)       (2nd)      (3rd)       (4th)      (5th)
```

This creates natural conversations where:
- **Yotsuba** jumps in first with enthusiasm
- **Nino** reacts (often tsundere-style)
- **Ichika** adds her mature perspective
- **Itsuki** contributes thoughtfully
- **Miku** quietly adds her thoughts last

---

## 🎨 Tech Stack Overview

```mermaid
graph TD
    subgraph Frontend["🖥️ Frontend"]
        Next["Next.js 16"]
        React["React 19"]
        Tailwind["Tailwind CSS v4"]
        Motion["Motion.dev"]
        Zustand["Zustand State"]
    end
    
    subgraph Backend["⚙️ Backend"]
        API["Next.js API Routes"]
        LLM["ZenMux/OpenAI API"]
        Prompts["Character Prompts"]
    end
    
    subgraph Mobile["📱 Mobile"]
        Capacitor["Capacitor"]
        Android["Android APK"]
    end
    
    Frontend --> Backend
    Frontend --> Mobile
```

---

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- An LLM API key (ZenMux, OpenAI, etc.)
- For Android: Android Studio (for building APK)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/NakanoRoom.git
cd NakanoRoom

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Environment Variables

Create a `.env.local` file:

```env
ZENMUX_API_KEY=your_api_key_here
ZENMUX_BASE_URL=https://zenmux.ai/api/v1

# Optional: Per-character API keys
ICHIKA_API_KEY=your_key
NINO_API_KEY=your_key
MIKU_API_KEY=your_key
YOTSUBA_API_KEY=your_key
ITSUKI_API_KEY=your_key
```

### Run Locally

```bash
# Development mode
npm run dev

# Open http://localhost:3000
```

---

## 📱 Building Android APK

This project uses **Capacitor** to build native Android apps.

### Quick Build

```bash
# Build web assets and sync to Android
npm run mobile:build

# Open in Android Studio
npx cap open android
```

### In Android Studio
1. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Command Line Build (Optional)
```bash
cd android
./gradlew assembleDebug
```

---

## 🎮 Usage Guide

### Desktop
- **Right-click** on message bubbles to reply
- **Right-click** on sidebar chats to clear chat
- Type `@` to mention a sister
- Click emoji button for emoji picker

### Mobile
- Tap the **⋮** button on chat list for Clear Chat
- Tap the **↩️** button on messages to reply
- Tap emoji button for quick emoji access

---

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Add your environment variables in Vercel dashboard.

---

## 💕 Credits

- **The Quintessential Quintuplets** (五等分の花嫁) - Original anime/manga by Negi Haruba
- Built with **Next.js 16**, **Tailwind CSS v4**, **Motion.dev**, and **Zustand**
- Native mobile with **Capacitor**
- Powered by LLM APIs for AI conversations

---

## 📝 License

This is a fan project made with love for the Nakano sisters! 🌸

*Not affiliated with the official Quintessential Quintuplets franchise.*

---

<div align="center">
  
Made with 💖 by fans, for fans.

<img src="public/Asset/NakanoRoom/NakanoRoom.jpg" alt="All Sisters" width="400"/>

</div>
