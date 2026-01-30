"use client";

import React, { useMemo } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Grid, Modal, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useBalanceStore } from "@/store/zustand/useBalanceStore";
import { useBankStore } from "@/store/zustand/useBankStore";
import { useHeirloomStore } from "@/store/zustand/useHeirloomStore";
import { useRewardHistoryStore } from "@/store/zustand/useRewardHistoryStore";
import { RootState } from "@/store/redux/store";
import { clearUser } from "@/store/redux/userSlice";
import { signOut } from "next-auth/react";
import { MenuItems } from "@/components/Layout/MenuItems";
import Sidebar from "@/components/Layout/Sidebar";
import AppHeader from "@/components/Layout/AppHeader";
import AppFooter from "@/components/Layout/AppFooter";
import { findMenuItemByPath } from "@/components/Layout/Sidebar"; // or move to utils
import { AppstoreOutlined } from "@ant-design/icons";
import { createAppBackup } from '@/utils/backup/appBackup';
import { timestampSave } from '@/utils/timestamp/timestapSave';

const { Content } = Layout;
const { useBreakpoint } = Grid;

type Props = {
    children: React.ReactNode;
    isDark: boolean;
    setIsDark: (value: boolean) => void;
};

export default function MainLayout({ children, isDark, setIsDark }: Props) {
    const pathname = usePathname() || "/";
    const router = useRouter();
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [currentPageTitle, setCurrentPageTitle] = useState(() => {
        const item = findMenuItemByPath(MenuItems, pathname);
        return item?.label || "Dashboard";
    });
    const [currentPageIcon, setCurrentPageIcon] = useState(() => {
        const item = findMenuItemByPath(MenuItems, pathname);
        return item?.icon || <AppstoreOutlined />;
    });

    // Memoize for performance
    // const currentPageTitle = useMemo(() => {
    //     const item = MenuItems.find((item) => item.key === pathname);
    //     return item?.label || "Dashboard";
    // }, [pathname]);

const handleLogout = async () => {
  Modal.confirm({
    title: "Before you go…",
    content: "Do you want to download a backup before logging out?",

    okText: "Logout",
    okType: "danger", // red for destructive action
    cancelText: "Cancel",

    onOk: async () => {
      // Just logout
      dispatch(clearUser());
      useBalanceStore.persist.clearStorage();
      useBankStore.persist.clearStorage();
      useHeirloomStore.persist.clearStorage();
      useRewardHistoryStore.persist.clearStorage();

      await signOut({
        redirect: true,
        callbackUrl: "/auth/login",
      });
    },

    footer: (_, { OkBtn, CancelBtn }) => (
      <>
        {/* Cancel button */}
        <CancelBtn />

        {/* Backup button */}
        <Button
          type="primary"
          onClick={() => {
            downloadBackup();
            message.success("Backup completed successfully!");
          }}
        >
          Backup
        </Button>

        {/* Logout button */}
        <OkBtn />
      </>
    ),
  });
};

    const handleClick = () => {
        setHasClicked(true);
        setCollapsed(!collapsed);
    };

    const downloadBackup = () => {
  const backup = createAppBackup();
  const timestamp = timestampSave();

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `app-backup_${timestamp}.json`;
  a.click();

  URL.revokeObjectURL(url);
};

    return (
        <>
            <Layout style={{ minHeight: screens.xs ? "120vh" : "126vh" }}>
                {/* LEFT SIDE: SIDEBAR + HEADER + CONTENT */}
                <Layout style={{ flex: 1, display: "flex" }}>
                    <Sidebar
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        hasClicked={hasClicked}
                        setHasClicked={setHasClicked}
                        isDark={isDark}
                        pathname={pathname}
                        onClick={handleClick}
                        setCurrentPageTitle={setCurrentPageTitle}
                        setCurrentPageIcon={setCurrentPageIcon}
                    />

                    <Layout
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                        }}
                    >
                        <AppHeader
                            currentPageIcon={currentPageIcon}
                            currentPageTitle={currentPageTitle}
                            isDark={isDark}
                            setIsDark={setIsDark}
                            user={user}
                            handleLogout={handleLogout}
                            router={router}
                        />

                        <Content
                            style={{
                                margin: screens.xs
                                    ? "0px 6px 0px 6px"
                                    : "0px 16px 0px 16px",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    background: isDark ? "#1f1f1f" : "#fff",
                                    padding: 8,
                                    flex: 1,
                                    borderRadius: 12,
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    border: isDark
                                        ? "1px solid #333"
                                        : "1px solid #f0f0f0",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {children}
                            </div>
                        </Content>
                    </Layout>
                </Layout>

                {/* FOOTER ALWAYS AT THE BOTTOM */}
                <AppFooter isDark={isDark} />
            </Layout>
        </>
    );
}
