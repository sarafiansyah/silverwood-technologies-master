"use client";

import { useRef, useEffect } from "react";
import { Layout, Space } from "antd";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import {
    RocketOutlined,
    StarOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import gsap from "gsap";

import { GradualSpacing } from "@/components/Typography/Animations/GradualSpacing";
import { StaggeredFade } from "@/components/Typography/Animations/StaggeredFade";

import {
    useTextShine,
    gradualLetterVariant,
} from "@/components/Typography/Animations/animationConfig";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
});

const text = "Welcome Mahesa";

export default function Page() {
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const iconsRef = useRef<HTMLDivElement>(null);

    useTextShine(textRef as React.RefObject<HTMLElement>);

    useEffect(() => {
        if (!iconsRef.current) return;

        const icons = iconsRef.current.querySelectorAll(".gsap-icon");

        const tl = gsap.timeline({ repeat: -1 });

        // entrance stagger
        gsap.from(icons, {
            y: 40,
            opacity: 0,
            scale: 0.6,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
        });

        // floating loop
        tl.to(icons, {
            y: -12,
            duration: 1.2,
            stagger: 0.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });

        // slow rotation on each
        gsap.to(icons, {
            rotate: 360,
            duration: 6,
            stagger: 0.5,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
        });

        // pulse glow effect
        gsap.to(icons, {
            scale: 1.25,
            duration: 1.4,
            stagger: 0.2,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
        });
    }, []);

    return (
        <Layout
            className={poppins.className}
            style={{ minHeight: "100vh", background: "#000000", padding: 40 }}
        >
            <Space orientation="vertical" size={24}>
                <GradualSpacing
                    text={text}
                    style={{
                        fontSize: 40,
                        fontWeight: 700,
                        letterSpacing: -4,
                        opacity: 0.8,
                        color: "white",
                    }}
                />

                <StaggeredFade
                    text={text}
                    style={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: "white",
                    }}
                />

                <StaggeredFade
                    text="Subtitles drift into existence"
                    style={{
                        fontSize: 20,
                        opacity: 0.8,
                        color: "white",
                    }}
                />

                {/* GSAP Animated Icons */}
                <div
                    ref={iconsRef}
                    style={{
                        display: "flex",
                        gap: 24,
                        fontSize: 48,
                        color: "white",
                    }}
                >
                    <RocketOutlined className="gsap-icon" />
                    <StarOutlined className="gsap-icon" />
                    <ThunderboltOutlined className="gsap-icon" />
                </div>

                {/* GSAP + Framer Motion Text */}
                <h1
                    ref={textRef}
                    style={{
                        fontSize: 56,
                        fontWeight: 800,
                        background:
                            "linear-gradient(90deg, #fff, #ffffff, #000000, #fff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundSize: "200% auto",
                        perspective: 800,
                    }}
                >
                    {text.split("").map((letter, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={gradualLetterVariant}
                            initial="hidden"
                            animate="show"
                            style={{ display: "inline-block" }}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </h1>
            </Space>
        </Layout>
    );
}
