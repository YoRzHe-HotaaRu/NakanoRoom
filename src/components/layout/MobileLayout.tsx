'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Image, Film } from 'lucide-react';
import { MobileChatList } from '@/components/mobile/MobileChatList';
import { MobileChatView } from '@/components/mobile/MobileChatView';
import { MobileAlbumList, AlbumId } from '@/components/mobile/MobileAlbumList';
import { MobileGallery } from '@/components/mobile/MobileGallery';
import { MobileStatus } from '@/components/mobile/MobileStatus';
import { VideoBackground } from '@/components/decorations/VideoBackground';
import { ChatId } from '@/lib/characters';

type Tab = 'chats' | 'album' | 'status';

export function MobileLayout() {
    const [activeTab, setActiveTab] = useState<Tab>('chats');
    const [activeChat, setActiveChat] = useState<ChatId | null>(null);
    const [viewingAlbum, setViewingAlbum] = useState<AlbumId | null>(null);

    const tabs = [
        { id: 'chats' as Tab, label: 'Chats', icon: MessageCircle },
        { id: 'album' as Tab, label: 'Album', icon: Image },
        { id: 'status' as Tab, label: 'Status', icon: Film },
    ];

    const renderContent = () => {
        // If viewing a specific chat
        if (activeTab === 'chats' && activeChat) {
            return (
                <MobileChatView
                    chatId={activeChat}
                    onBack={() => setActiveChat(null)}
                />
            );
        }

        // If viewing a specific album
        if (activeTab === 'album' && viewingAlbum) {
            return (
                <MobileGallery
                    characterId={viewingAlbum}
                    onBack={() => setViewingAlbum(null)}
                />
            );
        }

        // Main tab content
        switch (activeTab) {
            case 'chats':
                return <MobileChatList onSelectChat={setActiveChat} />;
            case 'album':
                return <MobileAlbumList onSelectCharacter={setViewingAlbum} />;
            case 'status':
                return <MobileStatus />;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            {/* Video Background */}
            <VideoBackground />

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTab}-${activeChat}-${viewingAlbum}`}
                        className="h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation Bar - hide when in chat or gallery view */}
            {!activeChat && !viewingAlbum && (
                <motion.nav
                    className="relative z-20 glass-panel border-t border-sakura-200/30 safe-area-inset-bottom"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-around py-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${isActive
                                        ? 'text-sakura-600 bg-sakura-100/50'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-xs font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </div>
    );
}
