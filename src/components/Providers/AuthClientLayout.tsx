"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/redux/store";
import { setDarkMode } from "@/store/redux/slices/themeSlice";
import MainLayout from "@/components/Layout/MainLayout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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
    const dispatch = useDispatch();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const excludedRoutes = ["/login", "/auth/loading"];
    const isLoggedIn = user.isAuthenticated || session?.user;

    const currentTheme: ThemeConfig = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorText: isDark ? "#d9d9d9ff" : "#6d6d6dff",
            fontFamily: "Poppins, sans-serif",
        },
    };

    if (status === "loading") return null;
    if (excludedRoutes.includes(pathname)) return <>{children}</>;

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
                            <MainLayout
                                isDark={isDark}
                                setIsDark={(value: boolean) =>
                                    dispatch(setDarkMode(value))
                                }
                            >
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
