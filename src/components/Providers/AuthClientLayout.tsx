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
import { SILVERWOOD_EXCLUDED_LAYOUT_ROUTES } from "@/constants/silverwood-excluded-routes";
import { clearUser } from "@/store/redux/slices/userSlice";
import { useEffect } from "react";

export default function ClientConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const isLoggedIn = status === "authenticated";

    useEffect(() => {
        if (status === "unauthenticated") {
            dispatch(clearUser());
        }
    }, [status, dispatch]);

    const currentTheme: ThemeConfig = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorText: isDark ? "#d9d9d9ff" : "#6d6d6dff",
            fontFamily: "Poppins, sans-serif",
        },
    };

    const isExcluded = SILVERWOOD_EXCLUDED_LAYOUT_ROUTES.some((route) =>
        pathname.startsWith(route),
    );

    if (status === "loading") return null;

    return (
        <ConfigProvider theme={currentTheme}>
            <AntdApp>
                {isExcluded || !isLoggedIn ? (
                    children
                ) : (
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
                )}
            </AntdApp>
        </ConfigProvider>
    );

    return <>{children}</>;
}
