"use client";

import { Card, Table, Typography, Space, Tag } from "antd";

const { Title, Text } = Typography;

type Props = {
    memberTypes: { id: string; type_name: string }[];
    users: any[];
};

export default function UsersView({ memberTypes, users }: Props) {
    return (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            {/* MEMBER TYPES */}
            <Card>
                <Title level={4}>Member Types</Title>

                <Space wrap>
                    {memberTypes.map((type) => (
                        <Tag key={type.id} color="blue">
                            {type.type_name}
                        </Tag>
                    ))}
                </Space>
            </Card>

            {/* USERS */}
            <Card>
                <Title level={4}>Users</Title>

                <Table
                    rowKey="id"
                    dataSource={users}
                    pagination={false}
                    columns={[
                        {
                            title: "Name",
                            render: (_, u) => (
                                <Text strong>
                                    {u.first_name} {u.last_name}
                                </Text>
                            ),
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Total Income",
                            render: (_, u) => {
                                const finance = u.users_finance?.[0];
                                return finance
                                    ? `Rp ${finance.total_income.toLocaleString()}`
                                    : "-";
                            },
                        },
                        {
                            title: "Balance",
                            render: (_, u) => {
                                const finance = u.users_finance?.[0];
                                return finance
                                    ? `Rp ${finance.current_balance.toLocaleString()}`
                                    : "No data";
                            },
                        },
                        {
                            title: "Limits",
                            render: (_, u) => {
                                const limits = u.users_finance?.[0]?.limits;

                                if (!limits?.length) return "-";

                                return (
                                    <Table
                                        size="small"
                                        pagination={false}
                                        dataSource={limits}
                                        rowKey="title"
                                        columns={[
                                            {
                                                title: "Source",
                                                dataIndex: "title",
                                            },
                                            {
                                                title: "Limit",
                                                dataIndex: "value",
                                                render: (v) =>
                                                    `Rp ${v.toLocaleString()}`,
                                            },
                                        ]}
                                    />
                                );
                            },
                        },
                    ]}
                />
            </Card>
        </Space>
    );
}
