"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MainLayout from "@/components/Layout/MainLayout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ThemeSwitch from "@/components/Theme/ThemeSwitch";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import type { ThemeConfig } from "antd";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useSelector((state: RootState) => state.user);
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const excludedRoutes = ["/login", "/auth/loading"];

    const [isDark, setIsDark] = useState(false);

    const currentTheme: ThemeConfig = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorText: isDark ? "#d9d9d9ff" : "#6d6d6dff",
            fontFamily: "Poppins, sans-serif",
        },
    };

    if (status === "loading") return null;

    if (excludedRoutes.includes(pathname)) {
        return <>{children}</>;
    }

    const isLoggedIn = user.isAuthenticated || session?.user;

    if (isLoggedIn) {
        return (
            <ConfigProvider theme={currentTheme}>
                <AntdApp>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDark ? "dark" : "light"}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                        >
                            <MainLayout isDark={isDark} setIsDark={setIsDark}>
                                {children}
                            </MainLayout>
                        </motion.div>
                    </AnimatePresence>
                </AntdApp>
            </ConfigProvider>
        );
    }

    return <>{children}</>;
}
