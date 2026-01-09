'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCharacter, CharacterId } from '@/lib/characters';
import Image from 'next/image';

// Import the same image data structure
const characterSlideImages: Record<CharacterId, string[]> = {
    ichika: [
        '/Asset/Ichika/Ichika1.jpg',
        '/Asset/Ichika/Ichika2.jpg',
        '/Asset/Ichika/Ichika3.jpg',
        '/Asset/Ichika/Ichika4.jpg',
        '/Asset/Ichika/Ichika5.jpg',
        '/Asset/Ichika/Ichika6.jpg',
        '/Asset/Ichika/Ichika7.jpg',
        '/Asset/Ichika/Ichika8.jpg',
        '/Asset/Ichika/Ichika9.jpg',
        '/Asset/Ichika/Ichika10.jpg',
        '/Asset/Ichika/Ichika11.jpg',
    ],
    nino: [
        '/Asset/Nino/Nino1.jpg',
        '/Asset/Nino/Nino2.jpg',
        '/Asset/Nino/Nino3.jpg',
        '/Asset/Nino/Nino4.jpg',
        '/Asset/Nino/Nino5.jpg',
        '/Asset/Nino/Nino6.jpg',
        '/Asset/Nino/Nino7.jpg',
        '/Asset/Nino/Nino8.jpg',
        '/Asset/Nino/Nino9.jpg',
        '/Asset/Nino/Nino10.jpg',
    ],
    miku: [
        '/Asset/Miku/Miku1.jpg',
        '/Asset/Miku/Miku2.jpg',
        '/Asset/Miku/Miku3.jpg',
        '/Asset/Miku/Miku4.jpg',
        '/Asset/Miku/Miku5.jpg',
        '/Asset/Miku/Miku6.jpg',
        '/Asset/Miku/Miku7.jpg',
        '/Asset/Miku/Miku8.jpg',
        '/Asset/Miku/Miku9.jpg',
        '/Asset/Miku/Miku10.jpg',
    ],
    yotsuba: [
        '/Asset/Yotsuba/Yotsuba1.jpg',
        '/Asset/Yotsuba/Yotsuba2.jpg',
        '/Asset/Yotsuba/Yotsuba3.jpg',
        '/Asset/Yotsuba/Yotsuba4.jpg',
        '/Asset/Yotsuba/Yotsuba5.jpg',
        '/Asset/Yotsuba/Yotsuba6.jpg',
        '/Asset/Yotsuba/Yotsuba7.jpg',
        '/Asset/Yotsuba/Yotsuba8.jpg',
        '/Asset/Yotsuba/Yotsuba9.jpg',
        '/Asset/Yotsuba/Yotsuba10.jpg',
        '/Asset/Yotsuba/Yotsuba11.jpg',
        '/Asset/Yotsuba/Yotsuba12.jpg',
        '/Asset/Yotsuba/Yotsuba13.jpg',
        '/Asset/Yotsuba/Yotsuba14.jpg',
        '/Asset/Yotsuba/Yotsuba15.jpg',
    ],
    itsuki: [
        '/Asset/Itsuki/Itsuki1.jpg',
        '/Asset/Itsuki/Itsuki2.jpg',
        '/Asset/Itsuki/Itsuki3.jpg',
        '/Asset/Itsuki/Itsuki4.jpg',
        '/Asset/Itsuki/Itsuki5.jpg',
        '/Asset/Itsuki/Itsuki6.jpg',
        '/Asset/Itsuki/Itsuki7.jpg',
        '/Asset/Itsuki/Itsuki8.jpg',
        '/Asset/Itsuki/Itsuki9.jpg',
        '/Asset/Itsuki/Itsuki10.jpg',
        '/Asset/Itsuki/Itsuki11.jpg',
        '/Asset/Itsuki/Itsuki12.jpg',
        '/Asset/Itsuki/Itsuki13.jpg',
        '/Asset/Itsuki/Itsuki14.jpg',
        '/Asset/Itsuki/Itsuki15.jpg',
        '/Asset/Itsuki/Itsuki16.jpg',
    ],
};

interface MobileGalleryProps {
    characterId: CharacterId;
    onBack: () => void;
}

export function MobileGallery({ characterId, onBack }: MobileGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const character = getCharacter(characterId);
    const images = characterSlideImages[characterId] || [];

    const goNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goPrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="h-full flex flex-col bg-black">
            {/* Header */}
            <header className="flex items-center gap-3 p-3 bg-black/80 relative z-10">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full"
                >
                    <ArrowLeft size={22} />
                </button>

                <div
                    className="w-8 h-8 rounded-full overflow-hidden"
                    style={{ border: `2px solid ${character.color}` }}
                >
                    <Image
                        src={character.profilePic}
                        alt={character.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="font-semibold text-white">{character.name}</h2>
                    <p className="text-xs text-white/60">
                        {currentIndex + 1} of {images.length}
                    </p>
                </div>
            </header>

            {/* Gallery */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute inset-0 flex items-center justify-center p-4"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -10000) goNext();
                            else if (swipe > 10000) goPrev();
                        }}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${character.name} ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                    onClick={goPrev}
                    className="absolute left-2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 z-10"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={goNext}
                    className="absolute right-2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 z-10"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-1 p-2 overflow-x-auto bg-black/80">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all ${idx === currentIndex ? 'ring-2 ring-sakura-500 scale-110' : 'opacity-60'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumb ${idx + 1}`}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
