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
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
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

    const foods = items.filter((i) => i.type.toLowerCase().includes("food"));

    const drinks = items.filter((i) => i.type.toLowerCase().includes("drink"));
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
    setResult("");  // reset old result

    const smartQuery = `jawab dengan singkat dalam satu baris apa isian dan bagaimana rasa ${raw}`;

    try {
        const res = await fetch("/api/generative-ai/gemini-integration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: smartQuery }),
        });

        if (res.ok) { // status 200-299
            const data = await res.json();
            setResult(data.text || "AI didn't say anything...");
        } else if (res.status >= 500) { // server error
            setAiError("AI got hungry and dropped the spoon. Try again later.");
        } else { // other errors like 400
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
                <Card
                    title={
                        <Row justify="space-between" align="middle">
                            <Col>
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: screens.xs ? "12px" : "15px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Menu From Drive
                                    <Tag color="magenta">LIVE</Tag>
                                </span>
                            </Col>
                            <Col>
                                <Button
                                    type="text"
                                    icon={<ReloadOutlined />}
                                    onClick={loadImages}
                                />
                            </Col>
                        </Row>
                    }
                    style={{
                        borderRadius: 16,
                        width: "100%",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    }}
                    styles={{
                        body: { padding: 10 },
                    }}
                >
                    {/* FOODS */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px",
                            marginBottom: 12,
                            width: "100%",
                        }}
                    >
                        <Text
                            strong
                            style={{
                                fontSize: screens.xs ? 14 : 16,
                                marginRight: 10,
                                whiteSpace: "nowrap",
                            }}
                        >
                            FOODS
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

                    <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        {foods.map((item) => (
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
                                    bodyStyle={{
                                        padding: isXs ? 10 : 14,
                                    }}
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
                                                    height: isXs ? 130 : 180,
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
                                        }}
                                    >
                                        <Text
                                            strong
                                            style={{ fontSize: isXs ? 12 : 15 }}
                                        >
                                            {item.displayName}
                                        </Text>

                                        <Text
                                            type="success"
                                            style={{ fontSize: isXs ? 12 : 14 }}
                                        >
                                            Rp {formatRupiah(item.price)}
                                        </Text>

                                        <Tag
                                            color={
                                                item.available ? "green" : "red"
                                            }
                                            style={{ fontSize: isXs ? 10 : 14 }}
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

                    {/* DRINKS */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px",
                            marginBottom: 12,
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
                            }}
                        >
                            DRINKS
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

                    <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        {drinks.map((item) => (
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
                                    bodyStyle={{
                                        padding: isXs ? 10 : 14,
                                    }}
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
                                                    height: isXs ? 130 : 180,
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
                                        }}
                                    >
                                        <Text
                                            strong
                                            style={{ fontSize: isXs ? 12 : 15 }}
                                        >
                                            {item.displayName}
                                        </Text>

                                        <Text
                                            type="success"
                                            style={{ fontSize: isXs ? 12 : 14 }}
                                        >
                                            Rp {formatRupiah(item.price)}
                                        </Text>

                                        <Tag
                                            color={
                                                item.available ? "green" : "red"
                                            }
                                            style={{ fontSize: isXs ? 10 : 14 }}
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
                </Card>
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

{!result && !aiLoading && (
    <Button type="primary" onClick={handleAiSearch}>
        SEARCH AI
    </Button>
)}
{aiError && (
    <Text type="danger" style={{ marginTop: 8 }}>
        {aiError}
    </Text>
)}
                    </div>
                )}
            </AnimatedModal>
        </Row>
    );
}
