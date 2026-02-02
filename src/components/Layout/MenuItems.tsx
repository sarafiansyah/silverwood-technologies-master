import {
    AppstoreOutlined,
    UserOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    LockOutlined,
    ExperimentOutlined,
    DollarCircleOutlined,
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
        key: "/profile",
        icon: <UserOutlined />,
        label: "Profile",
        path: "/profile",
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
        key: "moneypulate",
        label: "Finance",
        icon: <DollarCircleOutlined />,
        children: [
            {
                key: "moneypulate1",
                label: "Overview",
                icon: <DollarCircleOutlined />,
                path: "/finance/overview",
            },
            {
                key: "moneypulate2",
                label: "Balance",
                icon: <DollarCircleOutlined />,
                path: "/finance/balance",
            },
            {
                key: "moneypulate3",
                label: "Account",
                icon: <DollarCircleOutlined />,
                path: "/finance/account",
            },
            {
                key: "moneypulate4",
                label: "Heirlooms",
                icon: <DollarCircleOutlined />,
                path: "/finance/heirlooms",
            },
               {
                key: "moneypulate5",
                label: "Transaction",
                icon: <DollarCircleOutlined />,
                path: "/finance/transactions",
            },
        ],
    },
    {
        key: "/users",
        icon: <TeamOutlined />,
        label: "Users",
        path: "/users",
    },

    {
        key: "/about",
        icon: <InfoCircleOutlined />,
        label: "About",
        path: "/public/about",
    },
    {
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Settings",
        path: "/public/settings",
    },
];
