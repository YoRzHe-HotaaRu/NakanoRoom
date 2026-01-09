'use client';

import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface ContextMenuItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
}

interface ContextMenuProps {
    items: ContextMenuItem[];
    children: ReactNode;
}

export function ContextMenu({ items, children }: ContextMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    // Client-side only mount check for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu when clicking outside or scrolling
    useEffect(() => {
        if (!isOpen) return;

        const handleClose = () => setIsOpen(false);

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
        };
    }, [isOpen]);

    // Calculate safe position within viewport
    const calculatePosition = useCallback((clientX: number, clientY: number) => {
        const menuWidth = 160;
        const menuHeight = items.length * 40 + 16;

        let x = clientX;
        let y = clientY;

        // Keep menu within viewport
        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth - 8;
        }
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 8;
        }
        if (x < 8) x = 8;
        if (y < 8) y = 8;

        return { x, y };
    }, [items.length]);

    // Right-click handler (desktop)
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const pos = calculatePosition(e.clientX, e.clientY);
        setPosition(pos);
        setIsOpen(true);
    };

    // Long press handlers (mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        longPressTimer.current = setTimeout(() => {
            // Vibrate on mobile if supported
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            const pos = calculatePosition(startX, startY);
            setPosition(pos);
            setIsOpen(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleTouchMove = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleItemClick = (e: React.MouseEvent, item: ContextMenuItem) => {
        e.preventDefault();
        e.stopPropagation();
        item.onClick();
        setIsOpen(false);
    };

    const menuContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    className="fixed z-[9999] min-w-[140px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden py-1"
                    style={{ left: position.x, top: position.y }}
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    transition={{ duration: 0.12 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700'
                                }`}
                            onClick={(e) => handleItemClick(e, item)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                style={{ display: 'contents' }}
            >
                {children}
            </div>

            {/* Render menu in portal to avoid positioning issues */}
            {mounted && createPortal(menuContent, document.body)}
        </>
    );
}

