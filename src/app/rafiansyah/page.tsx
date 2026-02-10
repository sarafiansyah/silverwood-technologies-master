"use client";

import { useRef } from "react";
import { useGsapFadeUp } from "@/hooks/gsap/useFadeUpEntrance";

export default function AboutDetails() {
    const ref = useRef<HTMLDivElement>(null);

    useGsapFadeUp(ref as React.RefObject<HTMLElement>, {
        selector: ".about-line",
        y: 18,
        blur: 6,
        stagger: 0.2,
        duration: 1.4,
    });

    return (
        <div
            ref={ref}
            style={{ background: "#fff", color: "#000", padding: 60 }}
        >
            <h1 className="about-line">About</h1>
            <p className="about-line">Reusable motion logic.</p>
            <p className="about-line">Configurable behavior.</p>
            <p className="about-line">Single hook, many entrances.</p>
        </div>
    );
}
