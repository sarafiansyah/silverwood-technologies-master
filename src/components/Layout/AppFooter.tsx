"use client";

import React from "react";
import { Layout, Space, Typography, Grid } from "antd";
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    MailOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Footer } = Layout;
const { useBreakpoint } = Grid;
const { Text, Link } = Typography;

interface AppFooterProps {
    isDark: boolean;
}

export default function AppFooter({ isDark }: AppFooterProps) {
    const screens = useBreakpoint();

    return (
        <Footer
            style={{
                margin: screens.xs? "6px 6px 6px 6px" : "12px 12px 12px 12px",
                background: isDark ? "#141414" : "#fff",
                color: isDark ? "#aaa" : "#555",
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: isDark ? "1px solid #333" : "1px solid #f0f0f0",
                padding: screens.xs ? "12px 12px" : "12px 18px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: screens.xs ? "row" : "row",
                    justifyContent: "space-between",
                    alignItems: screens.xs ? "flex-start" : "center",
                    gap: screens.xs ? 0 : 0,
                }}
            >
                {/* LEFT: Logo + Description */}
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    {screens.xs ? null : (
                        <Image
                            src="/assets/logo/rd_silverwood.svg"
                            alt="Logo"
                            width={86}
                            height={24}
                        />
                    )}
                    <Text
                        style={{
                            display: "block",
                            textAlign: "center",
                            color: isDark ? "#777" : "#888",
                            fontSize: 12,
                            marginTop: 2,
                        }}
                    >
                        © {new Date().getFullYear()} Rafiansyah Silverwood.
                    </Text>
                </div>

                {/* RIGHT TOP: Social Icons */}
                <Space size="middle" style={{}}>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GithubOutlined
                            style={{
                                fontSize: 20,
                                color: isDark ? "#aaa" : "#555",
                            }}
                        />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <TwitterOutlined
                            style={{
                                fontSize: 20,
                                color: isDark ? "#aaa" : "#555",
                            }}
                        />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <LinkedinOutlined
                            style={{
                                fontSize: 20,
                                color: isDark ? "#aaa" : "#555",
                            }}
                        />
                    </a>
                    <a href="mailto:contact@silverwood.com">
                        <MailOutlined
                            style={{
                                fontSize: 20,
                                color: isDark ? "#aaa" : "#555",
                            }}
                        />
                    </a>
                </Space>
            </div>
        </Footer>
    );
}
