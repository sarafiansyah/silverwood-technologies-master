"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Layout, Avatar, Dropdown, Typography, Grid, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ThemeSwitch from "@/components/Theme/ThemeSwitch";
import { useSession } from "next-auth/react";

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface AppHeaderProps {
    currentPageTitle: string;
        currentPageIcon: any;
    isDark: boolean;
    setIsDark: (value: boolean) => void;
    user: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        roles?: string[];
    }; // Replace with your actual user type if available
    handleLogout: () => void;
    router: any; // Replace with proper router type if available
}

export default function AppHeader({
    currentPageTitle,
     currentPageIcon,
    isDark,
    setIsDark,
    user,
    handleLogout,
    router,
}: AppHeaderProps) {
    const userInitial = useMemo(() => {
        return user.firstName?.charAt(0)?.toUpperCase() || "?";
    }, [user.firstName]);

    const userDisplayName = useMemo(() => {
        return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }, [user.firstName, user.lastName]);

    const userFirstNameOnly = useMemo(() => {
        return user.firstName?.trim() || "User";
    }, [user.firstName]);

    const userEmail = useMemo(() => {
        return user.email || "";
    }, [user.email]);

    const userPhone = useMemo(() => {
        return user.phoneNumber || "";
    }, [user.phoneNumber]);

    const userRolesDisplay = useMemo(() => {
        return (
            user.roles
                ?.map(
                    (role: string) =>
                        role.charAt(0).toUpperCase() + role.slice(1)
                )
                .join(", ") || ""
        );
    }, [user.roles]);

    const screens = useBreakpoint();
    const isMobile = screens.xs;

    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    return (
        <div
            style={{
                background: isDark ? "#141414" : "#fff",
                borderRadius: 12,
                border: isDark ? "1px solid #333333ff" : "1px solid #f0f0f0",
                boxShadow: isDark
                    ? "0 4px 16px rgba(0,0,0,0.36)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                margin: screens.xs ? "8px 6px 6px 6px" : "12px 12px 12px 12px",
                overflow: "hidden",
            }}
        >
            <Header
                style={{
                    padding: "0 2px",
                    margin: "0 12px",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: screens.xs ? "48px" : "64px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <span style={{fontSize:"20px",color:"#6C7CF5"}}>{currentPageIcon}</span>
                    <Title
                        level={screens.xs ? 5 : 4}
                        style={{
                            margin: 0,
                            color:"#6C7CF5",
                            textTransform: "capitalize",
                            fontSize: screens.xs ? "13px" : "18px",
                            lineHeight: screens.xs ? "20px" : "26px",
                            whiteSpace: screens.xs ? "normal" : "nowrap",
                        }}
                    >
                        {currentPageTitle}
                    </Title>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    {!isAuthenticated ? (
                        <Button
                            type="primary"
                            onClick={() => router.push("/auth/login")}
                            style={{
                                borderRadius: 8,
                                padding: "0 16px",
                                height: 36,
                                fontSize: 14,
                            }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Dropdown
                            placement="bottomRight"
                            menu={{
                                items: [
                                    {
                                        type: "group",
                                        label: (
                                            <div
                                                style={{
                                                    padding: isMobile
                                                        ? "4px 0px"
                                                        : "8px 0px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        gap: 6,
                                                    }}
                                                >
                                                    <Avatar
                                                        size={
                                                            isMobile ? 28 : 36
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                "#b5b5b5ff",
                                                            color: "#fff",
                                                            fontSize: isMobile
                                                                ? 16
                                                                : 22,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {userInitial !== "?" ? (
                                                            userInitial
                                                        ) : (
                                                            <UserOutlined />
                                                        )}
                                                    </Avatar>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            justifyContent:
                                                                "center",
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    isMobile
                                                                        ? "8px"
                                                                        : "12px",
                                                                fontWeight: 600,
                                                                margin: 0,
                                                                lineHeight: 1.2,
                                                                display:
                                                                    "block",
                                                                opacity: 0.7,
                                                            }}
                                                        >
                                                            {userDisplayName}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    isMobile
                                                                        ? "8px"
                                                                        : "10px",
                                                                fontWeight: 400,
                                                                lineHeight: 1.2,
                                                                display:
                                                                    "block",
                                                                opacity: 0.7,
                                                            }}
                                                        >
                                                            {userEmail}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    isMobile
                                                                        ? "8px"
                                                                        : "10px",
                                                                fontWeight: 400,
                                                                lineHeight: 1.2,
                                                                display:
                                                                    "block",
                                                                opacity: 0.7,
                                                            }}
                                                        >
                                                            {userPhone}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },

                                    { type: "divider" },

                                    {
                                        key: "profile",
                                        label: (
                                            <a
                                                onClick={() =>
                                                    router.push("/profile")
                                                }
                                                style={{
                                                    fontSize: isMobile
                                                        ? 12
                                                        : 14,
                                                    padding: 0,
                                                }}
                                            >
                                                Profile
                                            </a>
                                        ),
                                    },
                                    {
                                        key: "logout",
                                        label: (
                                            <a
                                                onClick={handleLogout}
                                                style={{
                                                    fontSize: isMobile
                                                        ? 12
                                                        : 14,
                                                    padding: 0,
                                                }}
                                            >
                                                Sign out
                                            </a>
                                        ),
                                    },

                                    { type: "divider" },

                                    {
                                        key: "theme",
                                        label: (
                                            <ThemeSwitch
                                                isDark={isDark}
                                                setIsDark={setIsDark}
                                            />
                                        ),
                                    },
                                ],
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: isMobile ? 4 : 8,
                                    cursor: "pointer",
                                }}
                            >
                                <Avatar
                                    size={isMobile ? 28 : 36}
                                    style={{
                                        backgroundColor: "#b5b5b5ff",
                                        color: "#fff",
                                        fontSize: isMobile ? 16 : 22,
                                        textAlign: "center",
                                    }}
                                >
                                    {userInitial !== "?" ? (
                                        userInitial
                                    ) : (
                                        <UserOutlined />
                                    )}
                                </Avatar>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: isMobile
                                                ? "10px"
                                                : "14px",
                                            fontWeight: 600,
                                            margin: 0,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {isMobile
                                            ? userFirstNameOnly
                                            : userDisplayName}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: isMobile ? "8px" : "12px",
                                            fontWeight: 400,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {userRolesDisplay}
                                    </Text>
                                </div>
                            </div>
                        </Dropdown>
                    )}
                </div>
            </Header>
        </div>
    );
}
