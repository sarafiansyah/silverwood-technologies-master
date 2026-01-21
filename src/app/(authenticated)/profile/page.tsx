"use client"; // Required for client-side components in Next.js App Router

import React from "react";
import {
    Layout,
    Card,
    Table,
    Statistic,
    Row,
    Col,
    Grid,
    Tag,
    Typography,
    Avatar,
    Button,
} from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserOutlined,
    DollarOutlined,
    ExperimentOutlined,
    LockOutlined,
    DeploymentUnitOutlined,
    InstagramOutlined,
    TwitterOutlined,
    GithubOutlined,
    FacebookOutlined,
    MessageOutlined,
    RetweetOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import DashboardCard from "@/components/Card/DashboardCard";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const { useBreakpoint } = Grid;

// Define types for data
interface DashboardData {
    key: string;
    name: string;
    value: number;
    change: number;
}

const MainLayout: React.FC = () => {
    // Sample data for the table
    const data: DashboardData[] = [
        { key: "1", name: "Sales", value: 1200, change: 10 },
        { key: "2", name: "Users", value: 850, change: -5 },
        { key: "3", name: "Revenue", value: 4500, change: 15 },
    ];

    // Table columns
    const columns: ColumnsType<DashboardData> = [
        {
            title: "Metric",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "Change (%)",
            dataIndex: "change",
            key: "change",
            render: (change: number) => (
                <span style={{ color: change > 0 ? "green" : "red" }}>
                    {change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                    {Math.abs(change)}%
                </span>
            ),
        },
    ];

    const screens = useBreakpoint();
    const firstName = useSelector((state: RootState) => state.user.firstName);
    const lastName = useSelector((state: RootState) => state.user.lastName);
    const userDataDetails = useSelector((state: RootState) => state.user);
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [flipped, setFlipped] = useState(false);

    return (
        <>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Col>
                    <div
                        style={{
                            perspective: 1000,
                            width: screens.xs ? 300 : "100vw", // small on XS, full width otherwise
                            height: screens.xs ? 460 : 650, // small on XS, full height otherwise
                            maxWidth: screens.xs ? "100%" : "80%", // optional: limit max width on large screens
                            margin: screens.xs ? 0 : "0 auto", // center horizontally when full width
                        }}
                    >
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                transformStyle: "preserve-3d",
                                borderRadius: 16,
                                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                cursor: "pointer",
                            }}
                        >
                            {/* Front */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backfaceVisibility: "hidden",
                                    backgroundColor: "#fff",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Top gradient */}
                                <div
                                    style={{
                                        height: 190,
                                           backgroundImage: `url("/assets/images/background/bg-profile.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-end",
                                        position: "relative",
                                    }}
                                >
                                    {/* Flip Button - top right corner */}
                                    <Button
                                        size="small"
                                        onClick={() => setFlipped(!flipped)}
                                        style={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            zIndex: 10,
                                            gap: 2,
                                            fontSize: 10,
                                            padding:"0 8px",
                                        }}
                                    >
                                        <RetweetOutlined /> FLIP
                                    </Button>

                                    {/* Half-circle separator */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: -10,
                                            width: "100%",
                                            height: 40,
                                            background: "#fff",
                                            borderTopLeftRadius: "20% 20px",
                                            borderTopRightRadius: "20% 20px",
                                        }}
                                    />

                                    {/* Avatar */}
                                    <Avatar
                                        size={80}
                                        src="/assets/images/avatar/00.png"
                                        style={{
                                            position: "relative",
                                          
                                            zIndex: 2,
                                        }}
                                    />
                                </div>

                                {/* Name & Role */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        marginTop: 6,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            margin: 0,
                                            fontSize: screens.xs ? 14 : 20,
                                        }}
                                    >
                                        {firstName
                                            ? `${firstName} ${lastName}`
                                            : ""}
                                    </Title>
                                    <Text
                                        style={{
                                            fontSize: screens.xs ? 12 : 16,
                                        }}
                                    >
                                        {userDataDetails.roles
                                            ? `${userDataDetails.roles}`
                                            : ""}
                                    </Text>
                                </div>

                                {/* Details */}
                                {/* Details */}
                                <div
                                    style={{
                                        padding: "16px 24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: screens.xs ? 8 : 16, // spacing between items
                                    }}
                                >
                                    {[
                                        ["Email", userDataDetails.email],
                                        [
                                            "Phone Number",
                                            userDataDetails.phoneNumber,
                                        ],
                                        [
                                            "Date Joined",
                                            userDataDetails.dateJoined,
                                        ],
                                        [
                                            "Member Type",
                                            userDataDetails.memberType,
                                        ],
                                        ["Status", userDataDetails.status],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            style={{
                                                display: "flex",
                                                flexDirection: screens.xs
                                                    ? "row"
                                                    : "column", // row if xs, column otherwise
                                                justifyContent: screens.xs
                                                    ? "space-between"
                                                    : "flex-start",
                                                alignItems: screens.xs
                                                    ? "center"
                                                    : "flex-start",
                                                gap: screens.xs ? 4 : 2, // small gap between label/value
                                            }}
                                        >
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: screens.xs
                                                        ? 12
                                                        : 14,
                                                }}
                                            >
                                                {label}
                                            </Text>
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: screens.xs
                                                        ? 12
                                                        : 16,
                                                }}
                                            >
                                                {value || ""}
                                            </Text>
                                        </div>
                                    ))}
                                    {/* Social Media */}
                                    {/* Social Media Icons */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 12,
                                            marginTop: 8,
                                        }}
                                    >
                                        {userDataDetails.instagram && (
                                            <Button
                                                type="text"
                                                icon={<InstagramOutlined />}
                                                href={`https://instagram.com/${userDataDetails.instagram}`}
                                                target="_blank"
                                                style={{
                                                    fontSize: 18,
                                                    padding: 4,
                                                }}
                                            />
                                        )}
                                        {userDataDetails.twitter && (
                                            <Button
                                                type="text"
                                                icon={<TwitterOutlined />}
                                                href={`https://twitter.com/${userDataDetails.twitter}`}
                                                target="_blank"
                                                style={{
                                                    fontSize: 18,
                                                    padding: 4,
                                                }}
                                            />
                                        )}
                                        {userDataDetails.github && (
                                            <Button
                                                type="text"
                                                icon={<GithubOutlined />}
                                                href={`https://github.com/${userDataDetails.github}`}
                                                target="_blank"
                                                style={{
                                                    fontSize: 18,
                                                    padding: 4,
                                                }}
                                            />
                                        )}
                                        {userDataDetails.facebook && (
                                            <Button
                                                type="text"
                                                icon={<FacebookOutlined />}
                                                href={`https://facebook.com/${userDataDetails.facebook}`}
                                                target="_blank"
                                                style={{
                                                    fontSize: 18,
                                                    padding: 4,
                                                }}
                                            />
                                        )}
                                        {userDataDetails.threads && (
                                            <Button
                                                type="text"
                                                icon={<MessageOutlined />}
                                                href={`https://threads.net/${userDataDetails.threads}`}
                                                target="_blank"
                                                style={{
                                                    fontSize: 18,
                                                    padding: 4,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Back */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                    borderRadius: 16,
                                    background:
                                        "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 16,
                                }}
                            >
                                {/* Flip Button - top right corner */}
                                <Button
                                    size="small"
                                    onClick={() => setFlipped(!flipped)}
                                    style={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            zIndex: 10,
                                            gap: 2,
                                            fontSize: 10,
                                            padding:"0 8px",
                                        }}
                                >
                                    <RetweetOutlined /> FLIP
                                </Button>

                                <Image
                                    src="/assets/logo/rd_silverwood02.svg"
                                    alt="Logo"
                                    width={180}
                                    height={180}
                                    style={{
                                        objectFit: "contain",
                                        marginBottom: 24,
                                    }}
                                />

                                {/* Barcode-style name */}
                                <Text
                                    style={{
                                        fontFamily:
                                            "'Libre Barcode 39', system-ui",
                                        fontSize: 32, // adjust for barcode size
                                        color: "#000",
                                        textAlign: "center",
                                        userSelect: "none",
                                    }}
                                >
                                    {firstName ? `*${firstName}` : ""}
                                </Text>
                            </div>
                        </motion.div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default MainLayout;
