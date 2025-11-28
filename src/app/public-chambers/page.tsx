"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Spin, Empty, Row, Col } from "antd";

type DriveImage = {
    id: string;
    url: string;
    name: string;
};

export default function DriveGallery() {
    const [images, setImages] = useState<DriveImage[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/chambers/public-chamber")
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
            <Col xs={24} sm={24} md={20} lg={18} xl={16}>
                <Card
                    title="Google Drive Images"
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
                </Card>
            </Col>
        </Row>
    );
}
