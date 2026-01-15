"use client"; // Required for client-side components in Next.js App Router

import React from "react";
import { Layout, Card, Table, Statistic, Row, Col,Grid, Tag, Typography  } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarOutlined, ExperimentOutlined, LockOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux"

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
          {change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(change)}%
        </span>
      ),
    },
  ];

  const screens = useBreakpoint();
const firstName = useSelector(
  (state: RootState) => state.user.firstName
);

const lastName = useSelector(
  (state: RootState) => state.user.lastName
);

  return (
    <>
<Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
  <Col span={24}>
<Card
  hoverable
  style={{
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    background: "linear-gradient(135deg, #6C7CF5 0%, #8FA6FF 100%)",
    boxShadow: "0 10px 24px rgba(108, 124, 245, 0.35)",
   
    color: "#fff",
  }}
  styles={{
    body: {
      padding: "16px",
      height: screens.xs ? 130 : 160,
      minHeight: screens.xs ? "auto" : 100,
    },
  }}
>
  {/* Soft background icon */}
  <UserOutlined
    style={{
      position: "absolute",
      right: screens.xs ? 8 : 8,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: screens.xs ? 96 : 96,
      opacity: 0.18,
      color: "#ffffff",
      pointerEvents: "none",
    }}
  />

  {/* Content */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap: screens.xs ? 4 : 6,
    }}
  >
    <span
      style={{
        fontSize: screens.xs ? 16 : 20,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
     Welcome{firstName ? ` ${firstName}` : ""}!
    </span>

    <span
      style={{
        fontSize: screens.xs ? 10 : 15,
        lineHeight: 1.4,
        opacity: 0.9,
        maxWidth: "80%",
      }}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    </span>
  </div>
</Card>

  </Col>
</Row>
<div style={{ padding: "4px 10px", display: "flex", alignItems: "center", gap: 8 }}>
  <Title style={{ color: "#787878", fontSize: "14px", fontWeight: 500, margin: 0 }}>
    Integrated Modules
  </Title>
  <div
    style={{
      flex: 1,              // line fills remaining space
      height: "1px",        // line thickness
      backgroundColor: "#d9d9d9", // line color
    }}
  />
</div>

  
<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
<Col xs={12} md={6}>
 <Card
  hoverable
  style={{
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  }}
  styles={{
    body: {
      padding: "10px 12px",
      minHeight: screens.xs ? 0 : 90,
    },
  }}
>
  {/* Background Icon */}
  <ExperimentOutlined
    style={{
      position: "absolute",
      right: screens.xs ? 8 : 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: screens.xs ? 48 : 72,
      opacity: 0.5,
      color: "#6C7CF5",
      pointerEvents: "none",
    }}
  />

  {/* Content */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap:  screens.xs? 2 : 4,
    }}
  >
    <span
      style={{
        fontSize: screens.xs? 10 : 12,
        fontWeight: 500,
        opacity: 0.7,
        lineHeight: 1.2,
      }}
    >
      Rafiansyah
    </span>

    <span
      style={{
        fontSize:  screens.xs? 15 : 22,
        fontWeight: 600,
        lineHeight: 1.2,
             color: "#6C7CF5",
      }}
    >
      Viscorion
    </span>

    <Tag
      color="green"
      style={{
        fontSize: 10,
        lineHeight: "18px",
        padding: "0 6px",
        width: "fit-content",
        marginTop: 10,
      }}
    >
      ONLINE
    </Tag>
  </div>
</Card>

</Col>

  <Col xs={12} md={6}>
  <Card
  hoverable
  style={{
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  }}
  styles={{
    body: {
      padding: "10px 12px",
      minHeight: screens.xs ? 0 : 90,
    },
  }}
>
  {/* Background Icon */}
  <LockOutlined
    style={{
      position: "absolute",
      right: screens.xs ? 8 : 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: screens.xs ? 48 : 72,
      opacity: 0.5,
      color: "#6C7CF5",
      pointerEvents: "none",
    }}
  />

  {/* Content */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap:  screens.xs? 2 : 4,
    }}
  >
    <span
      style={{
        fontSize: screens.xs? 10 : 12,
        fontWeight: 500,
        opacity: 0.7,
        lineHeight: 1.2,
      }}
    >
      Rafiansyah
    </span>

    <span
      style={{
        fontSize:  screens.xs? 15 : 22,
        fontWeight: 600,
        lineHeight: 1.2,
        color:"#6C7CF5"
      }}
    >
      Chambers
    </span>

    <Tag
      color="green"
      style={{
        fontSize: 10,
        lineHeight: "18px",
        padding: "0 6px",
        width: "fit-content",
        marginTop: 10,
      }}
    >
      ONLINE
    </Tag>
  </div>
</Card>
  </Col>

  <Col xs={12} md={6}>
 <Card
  hoverable
  style={{
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  }}
  styles={{
    body: {
      padding: "10px 12px",
      minHeight: screens.xs ? 0 : 90,
    },
  }}
>
  {/* Background Icon */}
  <DollarOutlined
    style={{
      position: "absolute",
      right: screens.xs ? 8 : 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: screens.xs ? 48 : 72,
      opacity: 0.2,
      color: "#7370c5",
      pointerEvents: "none",
    }}
  />

  {/* Content */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap:  screens.xs? 2 : 4,
    }}
  >
    <span
      style={{
        fontSize: screens.xs? 10 : 12,
        fontWeight: 500,
        opacity: 0.7,
        lineHeight: 1.2,
      }}
    >
      Rafiansyah
    </span>

    <span
      style={{
        fontSize:  screens.xs? 15 : 22,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      Moneypulate
    </span>

    <Tag
      color="red"
      style={{
        fontSize: 10,
        lineHeight: "18px",
        padding: "0 6px",
        width: "fit-content",
        marginTop: 10,
      }}
    >
      OFFLINE
    </Tag>
  </div>
</Card>
  </Col>

  <Col xs={12} md={6}>
 <Card
  hoverable
  style={{
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  }}
  styles={{
    body: {
      padding: "10px 12px",
      minHeight: screens.xs ? 0 : 90,
    },
  }}
>
  {/* Background Icon */}
  <DeploymentUnitOutlined
    style={{
      position: "absolute",
      right: screens.xs ? 8 : 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: screens.xs ? 48 : 72,
      opacity: 0.5,
      color: "#999",
      pointerEvents: "none",
    }}
  />

  {/* Content */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap:  screens.xs? 2 : 4,
    }}
  >
    <span
      style={{
        fontSize: screens.xs? 10 : 12,
        fontWeight: 500,
        opacity: 0.7,
        lineHeight: 1.2,
      }}
    >
      Rafiansyah
    </span>

    <span
      style={{
        fontSize:  screens.xs? 15 : 22,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      Gallery
    </span>

    <Tag
      color="red"
      style={{
        fontSize: 10,
        lineHeight: "18px",
        padding: "0 6px",
        width: "fit-content",
        marginTop: 10,
      }}
    >
      OFFLINE
    </Tag>
  </div>
</Card>
  </Col>
</Row>

    </>
  );
};

export default MainLayout;
