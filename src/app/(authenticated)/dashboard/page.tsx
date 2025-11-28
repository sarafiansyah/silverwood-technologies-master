"use client"; // Required for client-side components in Next.js App Router

import React from "react";
import { Layout, Card, Table, Statistic, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Header, Content, Footer, Sider } = Layout;

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

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>

      <Layout>
             {/* Content */}
        <Content style={{ margin: "16px" }}>
          {/* Metrics Cards */}
          <Row gutter={16} style={{ marginBottom: "16px" }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1128}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Revenue"
                  value={9324}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sales"
                  value={456}
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Growth"
                  value={78}
                  suffix="%"
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Data Table */}
          <Card title="Recent Data">
            <Table<DashboardData>
              columns={columns}
              dataSource={data}
              pagination={false}
              size="small"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
