"use client";

import { GithubOutlined, InstagramOutlined, LinkedinOutlined, MessageOutlined, XOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Button, Grid, Card } from "antd";
import Image from "next/image";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const team = [
  {
    name: "Mahesa Rafiansyah",
    title: "CEO Founder",
    image: "/assets/images/members/rd01.png",
  },
  {
    name: "Stephanie Aurelianna",
    title: "President",
    image: "/assets/images/members/rd02.png",
  },
  {
    name: "Bryan Kusuma",
    title: "Vice President",
    image: "/assets/images/members/rd03.png",
  },
  {
    name: "Michelle Gervacia",
    title: "Head of Finance",
    image: "/assets/images/members/rd04.png",
  },
];

export default function AboutPage() {
    const screens = useBreakpoint();
    const isMobile = screens.xs;

    return (
        <>
        <div style={{ padding: isMobile ? "16px 16px" : "80px 64px", minHeight:"70vh" }}>
            <Row
                align="middle"
                gutter={[isMobile ? 0 : 32, isMobile ? 0 : 32]}
                style={{ minHeight: isMobile ? "60vh" : "70vh" }}
            >
                {/* LEFT: TEXT */}
                <Col xs={24} md={12} order={isMobile ? 2 : 1}>
                    <Title level={isMobile ? 3 : 2}>About Our Product</Title>

                    <Paragraph style={{ fontSize: isMobile ? 14 : 16 }}>
                        We build thoughtful digital experiences where design
                        meets performance. Every detail is intentional, every
                        interaction meaningful. No bloat, no nonsense—just
                        elegant engineering.
                    </Paragraph>

                    <Button type="primary" size={isMobile ? "middle" : "large"}>
                        Learn More
                    </Button>
                </Col>

                {/* RIGHT: IMAGE */}
                <Col
                    xs={24}
                    md={12}
                    order={isMobile ? 1 : 2}
                    style={{ textAlign: "center" }}
                >
                    <Image
                        src="/assets/images/about/ab01-blk.png"
                        alt="About illustration"
                        width={600}
                        height={600}
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                        }}
                        priority
                    />
                </Col>
            </Row>
            
        </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
 
      }}
    >
      {/* LEFT LINE */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: "rgba(0,0,0,0.15)",
        }}
      />

      {/* TITLE */}
      <Title
              style={{
          margin: 0,
          fontSize: isMobile? 18 : 30,
          whiteSpace: "nowrap",
        }}
      >
      OUR TEAM
      </Title>

      {/* RIGHT LINE */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: "rgba(0,0,0,0.15)",
        }}
      />
    </div>
   <div style={{ padding: isMobile ? "16px 8px" : "40px 36px" }}> <Row gutter={[isMobile? 6 : 12, isMobile? 6 : 12]}>
      {team.map((member, index) => (
        <Col
          key={index}
          xs={12}     // 3 cards per row on XS
          sm={12}
          md={8}
          lg={6}
          xl={6}     // 4 per row on XL
        >
          <div
            style={{
              position: "relative",
              height: isMobile? 210: 450,
              borderRadius: 16,
              overflow: "hidden",
              backgroundImage: `url(${member.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* DARK OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15))",
              }}
            />

     {/* CONTENT */}
<div
  style={{
    position: "absolute",
    bottom: isMobile? 0 : 20,
    left: isMobile? 0 : 12,
    right: 0,
    zIndex: 2,
    padding: "6px",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 0, // 👈 controls vertical tightness
    }}
  >
    <Title
      style={{
          fontSize: isMobile? 10 : 20,
        color: "#fff",
        margin: 0, // 🔥 kill default spacing
        lineHeight: "12px",
      }}
    >
      {member.name}
    </Title>

    <Text
      style={{
      fontSize: isMobile? 10 : 18,
        color: "rgba(255,255,255,0.75)",
        lineHeight: isMobile? "12px": undefined,
        margin: 0,
      }}
    >
      {member.title}
    </Text>

    <div
      style={{
        display: "flex",
        gap: 4, // 👈 tighter icon spacing
        marginTop: 4,
      }}
    >
     <InstagramOutlined style={{color: "#fff", fontSize: isMobile? "12px": "20px"}} />
     <XOutlined style={{color: "#fff", fontSize: isMobile? "12px": "20px"}} />
          <LinkedinOutlined style={{color: "#fff", fontSize: isMobile? "12px": "20px"}} />
          <Text style={{color: "#fff", fontSize: isMobile? "12px": "20px"}}>AI</Text>
    </div>
  </div>
</div>

          </div>
        </Col>
      ))}
    </Row></div>



    </>
    );
}
