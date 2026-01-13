"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Spin, Empty, Row, Col, Tag, Button, Grid } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

type DriveImage = {
    id: string;
    url: string;
    name: string;
};

const { useBreakpoint } = Grid;

export default function DriveGallery() {
    const [images, setImages] = useState<DriveImage[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const screens = useBreakpoint();

    useEffect(() => {
        fetch("/api/chambers/private-chamber")
            .then((r) => r.json())
            .then((data: DriveImage[]) => {
                setImages(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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

    if (!images.length) {
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
                <Empty description="No images found in Google Drive" />
            </div>
        );
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card
                    title={
                        <Row justify="space-between" align="middle">
                            <Col>
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: screens.xs ? "10px" : "14px",
                                    }}
                                >
                                    Chamber Contents{" "}
                                    <Tag
                                        color="pink"
                                        style={{
                                            gap: 8,
                                            fontSize: screens.xs
                                                ? "10px"
                                                : "12px",
                                        }}
                                    >
                                        SUPER
                                    </Tag>
                                </span>
                            </Col>
                            <Col>
                                <Button
                                    type="text"
                                    icon={<ReloadOutlined />}
                                    onClick={() =>
                                        console.log("Refresh clicked")
                                    }
                                />
                            </Col>
                        </Row>
                    }
                    style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        width: "100%",
                    }}
                    styles={{
                        body: { padding: 16 },
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gap: 16,
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                        }}
                    >
                        {images.map((img) => (
                            <div
                                key={img.id}
                                style={{
                                    cursor: "pointer",
                                    padding: 8, // ← this is the clean “gap”
                                }}
                                onClick={() => window.open(img.url, "_blank")}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.name}
                                    width={500}
                                    height={250}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: 300,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        transition: "transform 0.3s ease", // smooth zoom
                                    }}
                                    className="hover-zoom"
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            paddingTop: 8,
                            textAlign: "right",
                            fontSize: 10,
                            fontStyle: "italic",
                        }}
                    >
                        Integrated with Google Drive
                    </div>
                </Card>
            </Col>
        </Row>
    );
}
