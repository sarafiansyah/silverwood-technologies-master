"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/Layout/MainLayout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isDark, setIsDark] = useState(false);

    // Still checking auth → avoid flicker
    if (status === "loading") return null;

    const isAuthenticated = !!session?.user;

    // If authenticated → no layout
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If NOT authenticated → wrap with MainLayout
    return (
        <MainLayout isDark={isDark} setIsDark={setIsDark}>
            {children}
        </MainLayout>
    );
}
