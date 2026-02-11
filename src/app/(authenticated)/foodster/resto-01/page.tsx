"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, Spin, Empty, Row, Col, Tag, Button, Grid, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { parseFilename, ParsedMenu, DriveImage } from "@/lib/foodster/filenameFormat";

const { useBreakpoint } = Grid;
const { Text } = Typography;

// filename parser — the metadata extractor gremlin


function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

export default function DriveGallery() {
  const [items, setItems] = useState<ParsedMenu[]>([]);
const foods = items.filter(i =>
  i.type.toLowerCase().includes("food")
);

const drinks = items.filter(i =>
  i.type.toLowerCase().includes("drink")
);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

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
      <div style={{
        width: "100%",
        minHeight: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div style={{
        width: "100%",
        minHeight: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Empty description="No menu images found in Google Drive" />
      </div>
    );
  }
const isXs = screens.xs;
  return (
   <Row gutter={[16, 16]}>
  <Col span={24}>
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: screens.xs ? "12px" : "15px",
              fontWeight: 600,
            }}>
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
        hoverable
        style={{
          borderRadius: 16,
          overflow: "hidden",
         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

          transition: "all .25s ease",
          opacity: item.available ? 1 : 0.65,
        }}
        bodyStyle={{
          padding: isXs ? 10 : 14,
        }}
        cover={
          <div
            style={{
              cursor: item.available ? "pointer" : "not-allowed",
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
        <div style={{ display: "flex", flexDirection: "column", gap: isXs ? 4 : 6 }}>
          <Text strong style={{ fontSize: isXs ? 12 : 15 }}>
            {item.displayName}
          </Text>

          <Text type="success" style={{ fontSize: isXs ? 12 : 14 }}>
            Rp {formatRupiah(item.price)}
          </Text>

          <Tag color={item.available ? "green" : "red"} style={{ fontSize: isXs ? 10 : 14 }}>
            {item.available ? "Available" : "Empty"}
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
        hoverable
        style={{
          borderRadius: 16,
          overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all .25s ease",
          opacity: item.available ? 1 : 0.65,
        }}
        bodyStyle={{
          padding: isXs ? 10 : 14,
        }}
        cover={
          <div
            style={{
              cursor: item.available ? "pointer" : "not-allowed",
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
        <div style={{ display: "flex", flexDirection: "column", gap: isXs ? 4 : 6 }}>
          <Text strong style={{ fontSize: isXs ? 12 : 15 }}>
            {item.displayName}
          </Text>

          <Text type="success" style={{ fontSize: isXs ? 12 : 14 }}>
            Rp {formatRupiah(item.price)}
          </Text>

          <Tag color={item.available ? "green" : "red"} style={{ fontSize: isXs ? 10 : 14 }}>
            {item.available ? "Available" : "Empty"}
          </Tag>
        </div>
      </Card>
    </Col>
  ))}
</Row>


      <div style={{
        borderTop: "1px solid #f0f0f0",
        paddingTop: 10,
        marginTop: 20,
        textAlign: "right",
        fontSize: 11,
        fontStyle: "italic",
        opacity: 0.7,
      }}>
        Integrated with Rafiansyah Foodster
      </div>

    </Card>
  </Col>
</Row>

  );
}
