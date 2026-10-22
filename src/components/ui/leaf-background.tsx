"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// A simple SVG leaf
const NaturalLeaf = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        className={className}
        style={style}
    >
        <path d="M482.5,29.5c-48.4-56.1-155.6-35.9-231.5,40.1C189.6,131,146.4,204.4,136.2,284c-35.5-22.1-70.6-25-88-7.6 c-15.6,15.6-32.9,94,22,148.8c3.1,3.1,6.5,5.9,10,8.5L7.6,506.4l24.7,24.7l71.4-71.4c29.3,27.1,66.8,32.7,96.6,3.1 c17.4-17.4,14.6-52.6-7.5-88C292.4,364.6,365.8,321.4,427,260.1C503,184.1,523.2,76.9,482.5,29.5z M261.2,357.5 c-3.9-8.4-11.4-14.4-20.2-16.1c-15.1-50.5-44.1-94.8-82.9-126c-8-6.4-19.8-5.1-26.2,2.8c-6.4,8-5.1,19.8,2.8,26.2 c33.1,26.7,58,64.2,71.2,107l-26.9,2c-29.3,2-58.2-15.1-71.1-41.9c-29.3-37.4-16.1-90.1-5.1-101.1 c33.7-33.8,111.9-21.7,143.6,10c5.3,5.4,8,13.6,5.3,21.5l-33.1,99.2C218.6,339.7,238.1,343.3,261.2,357.5z M402.2,235.3 c-44.7,44.7-98.8,77.5-156,94.9l46.2-138.5c3.4-10.2-2.1-21.2-12.2-24.6c-10.2-3.4-21.2,2.1-24.6,12.2l-51.4,154 c-2,6-2,12.4,0,18.4c-1.3,0.5-2.7,1.1-4,1.8c-23.1-14.2-42.6-17.8-42.6-17.8c7.4-66.2,42.8-129.5,95.5-182.2 c62.2-62.2,152.1-77.9,191.6-38.4C480.1,150.7,464.4,173.1,402.2,235.3z" />
    </svg>
)

export function LeafBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
    const [leaves, setLeaves] = useState<Array<{ id: number; x: number; xOffset: number; delay: number; duration: number; size: number }>>([]);

    useEffect(() => {
        // Generate random leaves
        const newLeaves = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Random percentage start X
            xOffset: Math.random() * 20 - 10,
            delay: Math.random() * 15, // Random start delay
            duration: 12 + Math.random() * 18, // Float duration between 12s and 30s
            size: 15 + Math.random() * 25, // Size between 15px and 40px
        }));
        // eslint-disable-next-line
        setLeaves(newLeaves);
    }, []);

    if (leaves.length === 0) return <div className={className}>{children}</div>;

    return (
        <div className={`relative ${className || ''}`}>
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-emerald-50/50">
                {/* Light Background gradients - medium to light green & white */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/80 to-green-100" />

                {/* Soft atmospheric blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-emerald-200/40 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[60%] w-[500px] h-[500px] bg-white/60 rounded-full blur-[100px]" />

                {/* Falling leaves */}
                {leaves.map((leaf) => (
                    <motion.div
                        key={leaf.id}
                        className="absolute top-[-10%] text-emerald-600/30"
                        initial={{
                            x: `${leaf.x}vw`,
                            y: "0%",
                            rotate: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: [`${leaf.x}vw`, `${leaf.x + leaf.xOffset}vw`, `${leaf.x}vw`],
                            y: "120vh", // Move past bottom of screen
                            rotate: 360,
                            opacity: [0, 0.7, 0.7, 0],
                        }}
                        transition={{
                            duration: leaf.duration,
                            delay: leaf.delay,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <NaturalLeaf style={{ width: leaf.size, height: leaf.size }} />
                    </motion.div>
                ))}
            </div>
            {children}
        </div>
    );
}
