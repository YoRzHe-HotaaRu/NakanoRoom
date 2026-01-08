'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function AnimeClock() {
    const [time, setTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 100);
        return () => clearInterval(timer);
    }, []);

    if (!mounted || !time) {
        return (
            <div className="clock-container">
                <div className="clock">
                    <div className="clock-dot" />
                    <ClockNumbers />
                    <DialLines />
                </div>
            </div>
        );
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const date = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = weekdays[time.getDay()];

    // Calculate rotation angles
    const hourDeg = hours * 30 + minutes * (360 / 720);
    const minuteDeg = minutes * 6 + seconds * (360 / 3600);
    const secondDeg = seconds * 6;

    const formattedDate = `${date.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return (
        <motion.div
            className="clock-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="clock">
                {/* Date and Day displays */}
                <div className="clock-info clock-date">{formattedDate}</div>
                <div className="clock-info clock-day">{day}</div>

                {/* Center dot */}
                <div className="clock-dot" />

                {/* Hands */}
                <div
                    className="hour-hand"
                    style={{ transform: `rotate(${hourDeg}deg)` }}
                />
                <div
                    className="minute-hand"
                    style={{ transform: `rotate(${minuteDeg}deg)` }}
                />
                <div
                    className="second-hand"
                    style={{ transform: `rotate(${secondDeg}deg)` }}
                />

                {/* Numbers */}
                <ClockNumbers />

                {/* Dial lines */}
                <DialLines />
            </div>
        </motion.div>
    );
}

function ClockNumbers() {
    return (
        <>
            <span className="clock-num h12">12</span>
            <span className="clock-num h3">3</span>
            <span className="clock-num h6">6</span>
            <span className="clock-num h9">9</span>
        </>
    );
}

function DialLines() {
    return (
        <>
            {Array.from({ length: 60 }, (_, i) => (
                <div
                    key={i}
                    className={`dial-line ${i % 5 === 0 ? 'dial-line-major' : ''}`}
                    style={{ transform: `rotate(${i * 6}deg)` }}
                />
            ))}
        </>
    );
}

// Quote decoration
export function AnimeQuote() {
    const quotes = [
        { text: "I'll always be by your side", author: "Yotsuba" },
        { text: "It's not like I care or anything!", author: "Nino" },
        { text: "History teaches us many things...", author: "Miku" },
        { text: "Leave it to your big sister~", author: "Ichika" },
        { text: "Let's eat together!", author: "Itsuki" },
    ];

    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [quotes.length]);

    const quote = quotes[quoteIndex];

    return (
        <motion.div
            className="text-center"
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-xs text-gray-600 italic mb-1">&quot;{quote.text}&quot;</p>
            <p className="text-[10px] text-sakura-500">— {quote.author}</p>
        </motion.div>
    );
}
