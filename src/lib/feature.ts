import {
    AppstoreOutlined,
    CloudOutlined,
    DatabaseOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export interface FeatureGroup {
    title?: string;
    icon?: ComponentType;
    tagColor: string;
    tagLabel: string;
    items: string[];
}

export const featureGroups: FeatureGroup[] = [
    {
        title: "Features",
        icon: AppstoreOutlined,
        tagColor: "purple",
        tagLabel: "RD Silverwood",
        items: [
            "User login and session",
            "Customizable user profile",
            "Dark & light UI theme",
            "Data management by Redux",
            "Available online via Vercel",
            "No database connections",
        ],
    },
    {
        icon: DatabaseOutlined,
        tagColor: "green",
        tagLabel: "RD Moneypulate",
        items: [
            "Informative Chart variants",
            "Upload and Download data",
        ],
    },
    {
        icon: CloudOutlined,
        tagColor: "blue",
        tagLabel: "RD Viscorion",
        items: [
            "Oil monitoring features",
            "Upload and Download data",
        ],
    },
    {
        icon: SafetyOutlined,
        tagColor: "yellow",
        tagLabel: "RD Chambers",
        items: [
            "Realtime photo display",
            "Google Drive integration",
            "Private & public access",
        ],
    },
];
