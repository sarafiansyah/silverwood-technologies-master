"use client";

import { useSelector, useDispatch } from "react-redux";
import { setDarkMode } from "@/store/redux/slices/themeSlice";
import { setUser } from "@/store/redux/slices/userSlice";
import { RootState } from "@/store/redux/store";
import { Select, Switch, Button, message, Upload, Grid, Divider } from "antd";
import {
    MoonOutlined,
    SunOutlined,
    DownloadOutlined,
    UploadOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import { createAppBackup, restoreAppBackup } from "@/utils/backup/appBackup";
import { timestampSave } from "@/utils/timestamp/timestapSave";
import type { UploadProps } from "antd";

const { Option } = Select;
const { useBreakpoint } = Grid;

export default function TutorialNotification() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const screens = useBreakpoint();

    const handleDarkModeToggle = (checked: boolean) => {
        dispatch(setDarkMode(checked));
    };

    const handleSelectChange = (value: number) => {
        dispatch(setUser({ tutorial: value as 0 | 1 }));
    };

    const handleDownloadBackup = () => {
        const backup = createAppBackup();
        const timestamp = timestampSave();

        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `app-backup_${timestamp}.json`;
        a.click();

        URL.revokeObjectURL(url);

        message.success("Backup downloaded successfully!");
    };

    // Restore Upload Props
    const uploadProps: UploadProps = {
        accept: ".json",
        showUploadList: false,
        beforeUpload: (file) => {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const backup = JSON.parse(reader.result as string);
                    restoreAppBackup(backup);
                    message.success("Backup restored successfully!");
                    window.location.reload(); // rehydrate Zustand stores
                } catch (err) {
                    message.error("Invalid backup file");
                }
            };

            reader.readAsText(file);
            return false; // prevent auto upload
        },
    };

return (
  <div
    style={{
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      width: "100%",
    
    }}
  >
    {/* Tutorial Selector */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 120,
          maxWidth: 200,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExperimentOutlined style={{ color: "#1677ff", fontSize: 18 }} />
          <span style={{ fontWeight: 600 }}>Tutorial</span>
        </div>
        <span style={{ fontSize: 11, color: "#888" }}>
          Manage tutorial notifications
        </span>
      </div>
      <Select
        value={user.tutorial}
        onChange={handleSelectChange}
        style={{
          minWidth: 100,
          maxWidth: screens.xs ? 100 : 120,
          flex: 1,
          fontSize: screens.xs ? 12 : 14,
          height: 28,
        }}
        dropdownRender={(menu) => <div style={{ fontSize: 12 }}>{menu}</div>}
      >
        <Option value={1}>Enabled</Option>
        <Option value={0}>Disabled</Option>
      </Select>
    </div>

<Divider
  style={{
    margin: 0, // tighter spacing
    borderTop: `1px solid ${isDark ? "#444" : "#d9d9d9"}`, // colored divider
  }}
/>

    {/* Dark Mode Switch */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 120, maxWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MoonOutlined style={{ color: "#fadb14", fontSize: 18 }} />
          <span style={{ fontWeight: 600 }}>Dark Mode</span>
        </div>
        <span style={{ fontSize: 11, color: "#888" }}>Toggle between light & dark theme</span>
      </div>
      <Switch
        checked={isDark}
        onChange={handleDarkModeToggle}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        style={{ flexShrink: 0 }}
      />
    </div>

    <Divider
  style={{
    margin: 0, // tighter spacing
    borderTop: `1px solid ${isDark ? "#444" : "#d9d9d9"}`, // colored divider
  }}
/>

    {/* Backup Data */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 120, maxWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <DownloadOutlined style={{ color: "#52c41a", fontSize: 18 }} />
          <span style={{ fontWeight: 600 }}>Backup Data</span>
        </div>
        <span style={{ fontSize: 11, color: "#888" }}>Save your profile data</span>
      </div>
      <Button
        size="middle"
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownloadBackup}
        style={{ flexShrink: 0, fontSize: screens.xs ? 10 : 14, padding: 8 }}
      >
        Download
      </Button>
    </div>

    <Divider
  style={{
    margin: 0, // tighter spacing
    borderTop: `1px solid ${isDark ? "#444" : "#d9d9d9"}`, // colored divider
  }}
/>

    {/* Restore Backup */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 120, maxWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UploadOutlined style={{ color: "#ffa023", fontSize: 18 }} />
          <span style={{ fontWeight: 600 }}>Restore Backup</span>
        </div>
        <span style={{ fontSize: 11, color: "#888" }}>Restore your saved profile data</span>
      </div>
      <Upload {...uploadProps}>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          style={{ flexShrink: 0, fontSize: screens.xs ? 10 : 14, padding: 8 }}
        >
          Upload
        </Button>
      </Upload>
    </div>
  </div>
);

}
