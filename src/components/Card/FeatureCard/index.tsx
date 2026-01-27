import {
    AppstoreOutlined,
    CloudOutlined,
    DatabaseOutlined,
    HomeOutlined,
    SafetyOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import { Divider, Grid, Space, Tag, Typography } from "antd";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const FeatureCard = () => {
    const screens = useBreakpoint();

    return (
        <div
            style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    borderRadius: 16,
                    maxWidth: screens.xs ? 640 : 1200,
                    fontSize: screens.xs ? 12 : 16,
                    padding: screens.xs ? 16 : 24, // 👈 Card padding replacement
                    background: "#fff", // 👈 Card background
                }}
            >
                {/* Application */}
                <Title style={{ fontSize: screens.xs ? 14 : 18 }}>
                    <AppstoreOutlined /> Features
                </Title>
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        marginTop: 16,
                        display: "grid",
                        gridTemplateColumns: screens.xs
                            ? "150px 1fr"
                            : "280px 1fr",
                        rowGap: 6,
                    }}
                >
                    <li>Name</li>
                    <li>RD Silverwood</li>

                    <li>Type</li>
                    <li>Web Application</li>

                    <li>Developed</li>
                    <li>Nov 10, 2025</li>

                    <li>Framework</li>
                    <li>Next.js</li>

                    <li>Runtime</li>
                    <li>React {process.env.NEXT_PUBLIC_REACT_VERSION}</li>

                    <li>Language</li>
                    <li>TypeScript</li>
                </ul>

                <Divider
                    style={{
                        margin: "20px 0px",
                        minWidth: 0,
                        borderTop: "2px solid rgba(172, 172, 172, 0.35)", // 👈 visible AF
                    }}
                />

                {/* Frontend */}
                <Title style={{ fontSize: screens.xs ? 14 : 18 }}>
                    <HomeOutlined /> Frontend Stack
                </Title>
                <Space wrap>
                    <Tag color="blue">Next.js</Tag>
                    <Tag color="cyan">React</Tag>
                    <Tag color="geekblue">AntD</Tag>
                    <Tag color="purple">Framer</Tag>
                </Space>
                <div style={{ marginTop: 8 }}>
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            display: "grid",
                            gridTemplateColumns: screens.xs
                                ? "150px 1fr"
                                : "280px 1fr",
                            rowGap: 6,
                        }}
                    >
                        <li>Framework</li>
                        <li>
                            Next.js {process.env.NEXT_PUBLIC_NEXT_VERSION}{" "}
                            <Tag
                                color="red"
                                variant="outlined"
                                style={{
                                    fontSize: 10,
                                    padding: "0px 6px",
                                }}
                            >
                                APP
                            </Tag>
                        </li>

                        <li>UI Styling</li>
                        <li>Ant Design</li>

                        <li>Visualizations</li>
                        <li>Ant Charts</li>

                        <li>Animations</li>
                        <li>Framer Motion</li>
                    </ul>
                </div>

                <Divider
                    style={{
                        margin: "20px 0px",
                        minWidth: 0,
                        borderTop: "2px solid rgba(172, 172, 172, 0.35)", // 👈 visible AF
                    }}
                />

                {/* State Management */}
                <Title style={{ fontSize: screens.xs ? 14 : 18 }}>
                    <ShopOutlined /> State Management
                </Title>
                <Space wrap>
                    <Tag color="green">Redux</Tag>
                    <Tag color="gold">Zustand</Tag>
                </Space>
                <div style={{ marginTop: 8 }}>
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            display: "grid",
                            gridTemplateColumns: screens.xs
                                ? "150px 1fr"
                                : "280px 1fr",
                            rowGap: 6,
                        }}
                    >
                        <li>Global State</li>
                        <li>Redux Toolkit</li>

                        <li>Modular State</li>
                        <li>Zustand</li>

                        <li>Persistence</li>
                        <li>localStorage</li>
                    </ul>
                </div>

                <Divider
                    style={{
                        margin: "20px 0px",
                        minWidth: 0,
                        borderTop: "2px solid rgba(172, 172, 172, 0.35)", // 👈 visible AF
                    }}
                />

                {/* Data & Reports */}
                <Title style={{ fontSize: screens.xs ? 14 : 18 }}>
                    <DatabaseOutlined /> Data & Reporting
                </Title>
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gridTemplateColumns: screens.xs
                            ? "150px 1fr"
                            : "280px 1fr",
                        rowGap: 6,
                    }}
                >
                    <li>Excel Export</li>
                    <li>xlsx</li>

                    <li>PDF Export</li>
                    <li>jsPDF</li>

                    <li>HTML Capture</li>
                    <li>html2canvas</li>

                    <li>File Download</li>
                    <li>file-saver</li>
                </ul>

                <Divider
                    style={{
                        margin: "20px 0px",
                        minWidth: 0,
                        borderTop: "2px solid rgba(172, 172, 172, 0.35)", // 👈 visible AF
                    }}
                />

                {/* External Services */}
                <Title style={{ fontSize: screens.xs ? 14 : 18 }}>
                    <CloudOutlined /> External Services
                </Title>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Google APIs Integration</li>
                    <li>RESTful API Compatible</li>
                </ul>
            </div>
        </div>
    );
};

export default FeatureCard;
