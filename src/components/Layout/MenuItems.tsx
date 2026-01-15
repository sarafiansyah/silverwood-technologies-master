import {
    AppstoreOutlined,
    UserOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    LockOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";

export interface MenuItemType {
    key: string;
    icon?: React.ReactNode;
    label: string;
    path?: string;
    children?: MenuItemType[];
}

export const MenuItems: MenuItemType[] = [
    {
        key: "/",
        icon: <AppstoreOutlined />,
        label: "Dashboard",
        path: "/",
    },
    {
        key: "/users",
        icon: <UserOutlined />,
        label: "User Management",
        path: "/users",
    },
    {
        key: "chambers",
        label: "Chambers",
        icon: <LockOutlined />,
        children: [
            {
                key: "secret1",
                label: "Master Chamber",
                icon: <LockOutlined />,
                path: "/chambers/master-chamber",
            },
            {
                key: "secret2",
                label: "Super Chamber",
                icon: <LockOutlined />,
                path: "/chambers/super-chamber",
            },
            {
                key: "secret3",
                label: "Private Chamber",
                icon: <LockOutlined />,
                path: "/public/chambers/private-chamber",
            },
            {
                key: "secret4",
                label: "Public Chamber",
                icon: <LockOutlined />,
                path: "/public/chambers/public-chamber",
            },
        ],
    },
    {
        key: "viscorion",
        label: "Oil Monitoring",
        icon: <ExperimentOutlined />,
        children: [
            {
                key: "viscorion1",
                label: "Oil Changes",
                icon: <ExperimentOutlined />,
                path: "/public/oil-monitoring/oil-changes",
            },
            {
                key: "viscorion2",
                label: "Oil Details",
                icon: <ExperimentOutlined />,
                path: "/public/oil-monitoring/oil-details",
            },
        ],
    },
    {
        key: "/structural",
        icon: <TeamOutlined />,
        label: "Structural",
        path: "/structural",
    },

    {
        key: "/about",
        icon: <InfoCircleOutlined />,
        label: "About",
        path: "/about",
    },
    {
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Settings",
        path: "/settings",
    },
];
