"use client";

import { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Image from "next/image";
import {
    Input,
    Card,
    Spin,
    Empty,
    Row,
    Col,
    Tag,
    Button,
    Grid,
    Typography,
    Space,
} from "antd";
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    ReloadOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import {
    parseFilename,
    ParsedMenu,
    DriveImage,
} from "@/lib/foodster/filenameFormat";
import AnimatedModal from "@/components/Modal/Animated";

const { useBreakpoint } = Grid;
const { Text } = Typography;
const { Search } = Input;

// filename parser — the metadata extractor gremlin

function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID").format(n);
}

export default function DriveGallery() {
    const [items, setItems] = useState<ParsedMenu[]>([]);
    const [selectedItem, setSelectedItem] = useState<ParsedMenu | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const headerItem = items.find((i) => i.type === "header");

    const groupedItems = items.reduce<Record<string, ParsedMenu[]>>(
        (acc, item) => {
            const key = item.type?.trim() || "other";

            if (!acc[key]) acc[key] = [];
            acc[key].push(item);

            return acc;
        },
        {},
    );

const sortedGroupEntries = Object.entries(groupedItems)
    .filter(([key]) => key.toLowerCase() !== "header") // hide RESTO group
    .sort(([a], [b]) => {
        const A = a.toLowerCase();
        const B = b.toLowerCase();

        if (A === "foods") return -1; // Foods always first
        if (B === "foods") return 1;

        if (A === "drinks") return 1;  // Drinks after Foods
        if (B === "drinks") return -1;

        return A.localeCompare(B); // everything else alphabetically
    });


    const [loading, setLoading] = useState(true);
    const screens = useBreakpoint();
    const isXs = screens.xs;
    const [result, setResult] = useState("");

    const loadImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get<DriveImage[]>("/api/foodster/resto-01");

            const parsed = res.data.map(parseFilename);

            // optional: sort by price ascending
            parsed.sort((a, b) => a.price - b.price);

            setItems(parsed);

            const groupedItems = items
                .filter((i) => i.type !== "header")
                .reduce<Record<string, ParsedMenu[]>>((acc, item) => {
                    const key = item.type || "other";
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                }, {});
        } catch (err) {
            console.error("Failed loading images", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "40vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!items.length) {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "40vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Empty description="No menu images found in Google Drive" />
            </div>
        );
    }

    const runGeminiSearch = async (raw: string) => {
        setAiLoading(true);
        setAiError(""); // reset error
        setResult(""); // reset old result

        const smartQuery = `jawab dengan singkat dalam satu baris apa isian dan bagaimana rasa ${raw}`;

        try {
            const res = await fetch("/api/generative-ai/gemini-integration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: smartQuery }),
            });

            if (res.ok) {
                // status 200-299
                const data = await res.json();
                setResult(data.text || "AI didn't say anything...");
            } else if (res.status >= 500) {
                // server error
                setAiError(
                    "AI got hungry and dropped the spoon. Try again later.",
                );
            } else {
                // other errors like 400
                setAiError(`Something went wrong (status: ${res.status})`);
            }
        } catch (e) {
            setAiError("Network error or AI got distracted. Try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleCardClick = (item: ParsedMenu) => {
        setSelectedItem(item);
        setModalOpen(true);
        setResult(""); // optional reset so old result doesn’t flash
        runGeminiSearch(item.displayName);
    };

    const openDetail = (item: ParsedMenu) => {
        if (!item.available) return;

        setSelectedItem(item);
        setModalOpen(true);

        // reset AI panel
        setResult("");
        setAiLoading(false);
        setAiError("");
    };

    const handleAiSearch = () => {
        if (!selectedItem) return;
        runGeminiSearch(selectedItem.displayName);
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                {headerItem && (
                    <Card
                        hoverable
                        style={{
                            width: "100%",
                            borderRadius: 16,
                            overflow: "hidden",
                            padding: 0,
                        }}
               styles={{ body: { padding: 0 } }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: 260,
                            }}
                        >
                            <Image
                                src={headerItem.url}
                                alt={headerItem.displayName}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="100vw"
                            />
<Button
  type="text"
  icon={<ReloadOutlined />}
  onClick={loadImages}
  style={{
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    color: "#000000",
    background: "rgb(255, 255, 255)",
    borderRadius: "50%",
    backdropFilter: "blur(6px)",
  }}
/>

                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    padding: 16,
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0.20))",
                                    color: "#fff",
                                }}
                            >
                                <Text style={{ color: "#fff", fontSize: isXs? 16:20 }}>
                                    {headerItem.displayName}
                                </Text>

                                <Space size={8} orientation="horizontal" wrap>
                                    <Space size={6}>
                                        <ShopOutlined />
                                        <Text style={{ color: "#e6e6e6", fontSize: isXs? 14:16}}>
                                            {headerItem.contactNumber}
                                        </Text>
                                    </Space>
                                    <Space size={6}>
                                        <ClockCircleOutlined />
                                        <Text style={{ color: "#e6e6e6",fontSize: isXs? 14:16 }}>
                                            {headerItem.openHours}
                                        </Text>
                                    </Space>
                                </Space>
                                <Space size={0} orientation="vertical">
                                    <Space size={6}>
                                        <EnvironmentOutlined />
                                        <Text style={{ color: "#e6e6e6",fontSize: isXs? 14:16 }}>
                                            {headerItem.address}
                                        </Text>
                                    </Space>
                                </Space>
                            </div>
                        </div>
                    </Card>
                )}

                {sortedGroupEntries.map(([groupName, groupItems]) => (
                    <div key={groupName}>
                        {/* HEADER */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0 8px",
                                marginBottom: 0,
                                marginTop: 20,
                                width: "100%",
                            }}
                        >
                            <Text
                                strong
                                style={{
                                    fontSize: screens.xs ? 14 : 16,
                                    marginRight: 10,
                                    whiteSpace: "nowrap",
                                    textTransform: "uppercase",
                                }}
                            >
                                {groupName}
                            </Text>

                            {screens.xs && (
                                <div
                                    style={{
                                        height: 1,
                                        background: "#c7c7c7",
                                        flex: 1,
                                    }}
                                />
                            )}
                        </div>

                        {/* GRID */}
                        <Row
                            gutter={[12, 12]}
                            style={{ marginTop: 10, marginBottom: 20 }}
                        >
                            {groupItems.map((item) => (
                                <Col
                                    key={item.id}
                                    xs={12}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={6}
                                >
                                    <Card
                                        onClick={() => openDetail(item)}
                                        hoverable
                                        style={{
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            boxShadow:
                                                "0 4px 12px rgba(0,0,0,0.08)",
                                            transition: "all .25s ease",
                                            opacity: item.available ? 1 : 0.65,
                                        }}
                                        bodyStyle={{ padding: isXs ? 10 : 14 }}
                                        cover={
                                            <div
                                                style={{
                                                    cursor: item.available
                                                        ? "pointer"
                                                        : "not-allowed",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Image
                                                    src={item.url}
                                                    alt={item.displayName}
                                                    width={400}
                                                    height={isXs ? 130 : 180}
                                                    style={{
                                                        width: "100%",
                                                        height: isXs
                                                            ? 130
                                                            : 180,
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        }
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: isXs ? 4 : 6,
                                                marginTop:-6
                                            }}
                                        >
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: isXs ? 12 : 15,
                                                }}
                                            >
                                                {item.displayName.length > 15
                                                    ? item.displayName.slice(
                                                          0,
                                                          17,
                                                      ) + "…"
                                                    : item.displayName}
                                            </Text>

                                            <Text
                                                type="success"
                                                style={{
                                                    fontSize: isXs ? 12 : 14,
                                                }}
                                            >
                                                Rp {formatRupiah(item.price)}
                                            </Text>

                                            <Tag
                                                color={
                                                    item.available
                                                        ? "green"
                                                        : "red"
                                                }
                                                style={{
                                                    fontSize: isXs ? 10 : 14,
                                                }}
                                            >
                                                {item.available
                                                    ? "Available"
                                                    : "Empty"}
                                            </Tag>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}

                <div
                    style={{
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 10,
                        marginTop: 20,
                        textAlign: "right",
                        fontSize: 11,
                        fontStyle: "italic",
                        opacity: 0.7,
                    }}
                >
                    Integrated with Rafiansyah Foodster
                </div>
            </Col>
            <AnimatedModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                width={isXs ? 300 : 640}
                title={selectedItem?.displayName}
                
            >
                {selectedItem && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <Image
                            src={selectedItem.url}
                            alt={selectedItem.displayName}
                            width={800}
                            height={500}
                            style={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                                borderRadius: 12,
                            }}
                        />

                        <Text strong style={{ fontSize: 18 }}>
                            Rp {formatRupiah(selectedItem.price)}
                        </Text>

                        <Tag color={selectedItem.available ? "green" : "red"}>
                            {selectedItem.available ? "Available" : "Empty"}
                        </Tag>

                        <Text type="secondary">Type: {selectedItem.type}</Text>

                        <Text type="secondary">Need Details?</Text>

                        {/* BUTTON */}
                        {!aiLoading && !result && (
                            <Button type="primary" onClick={handleAiSearch}>
                                SEARCH AI
                            </Button>
                        )}

                        {/* LOADING */}
                        {aiLoading && (
                            <div style={{ marginTop: 16 }}>
                                <Spin />
                            </div>
                        )}

                        {/* RESULT */}
                        {!aiLoading && result && (
                            <div style={{ marginTop: -10 }}>
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        )}

                        {/* ERROR */}
                        {aiError && (
                            <Text
                                type="danger"
                                style={{ marginTop: 8, display: "block" }}
                            >
                                {aiError}
                            </Text>
                        )}
                    </div>
                )}
            </AnimatedModal>
        </Row>
    );
}
