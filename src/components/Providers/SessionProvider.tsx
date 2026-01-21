"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { ConfigProvider, App as AntdApp } from "antd";

export default function SessionProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <ReduxProvider store={store}>
                <AntdApp>{children}</AntdApp>
            </ReduxProvider>
        </SessionProvider>
    );
}
