"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDarkMode } from "@/store/redux/slices/themeSlice";
import { useEffect } from "react";
import { RootState } from "@/store/redux/store";
import { setUser } from "@/store/redux/slices/userSlice";
import { Select, Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function TutorialNotification() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    const handleDarkModeToggle = (checked: boolean) => {
        dispatch(setDarkMode(checked));
    };

    const handleSelectChange = (value: number) => {
        dispatch(setUser({ tutorial: value as 0 | 1 }));
    };

    return (
        <div
            style={{
                padding: "16px",
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                rowGap: 16,
                alignItems: "center",
                maxWidth: 400,
            }}
        >
            {/* Tutorial Selector */}
            <label style={{ fontWeight: 500 }}>Tutorial:</label>
            <Select
                value={user.tutorial}
                onChange={handleSelectChange}
                style={{ width: "140px" }}
            >
                <Option value={1}>Enabled</Option>
                <Option value={0}>Disabled</Option>
            </Select>

            {/* Dark Mode Switch */}
            <span style={{ fontWeight: 500 }}>Dark Mode</span>
            <Switch
                style={{ width: "50px" }}
                checked={isDark}
                onChange={handleDarkModeToggle}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
            />
        </div>
    );
}
