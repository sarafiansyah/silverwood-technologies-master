"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    width?: number;
    title?: string;
}

export default function AnimatedModal({
    open,
    onClose,
    children,
    width = 500,
    title,
}: AnimatedModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.45)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingTop: "10vh",
                        zIndex: 1000,
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                            width,
                            maxWidth: "90%",
                            zIndex: 1001,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && <h3 style={{ marginBottom: 16 }}>{title}</h3>}

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
