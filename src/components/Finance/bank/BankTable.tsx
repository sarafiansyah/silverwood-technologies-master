// components/BankTable.tsx
import React from "react";
import { Table, Space, Button, Popconfirm, Typography, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Bank } from "@/types/bank";

const { useBreakpoint } = Grid;

type Props = {
    banks: Bank[];
    onAdd10k: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function BankTable({ banks, onAdd10k, onDelete }: Props) {
    const columns: ColumnsType<Bank> = [
        {
            title: "No.",
            key: "index",
            width: "6%",
            render: (_: any, __: Bank, index: number) => index + 1,
        },
        {
            title: "Bank",
            dataIndex: "name",
            key: "name",
            width: "16%",
            render: (v: string, r: Bank) => (
                <div>
                    <Typography.Text strong>{v}</Typography.Text>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        {r.account}
                    </div>
                </div>
            ),
        },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
            align: "center",
            width: "6%",
        },
        {
            title: "Balance (IDR)",
            dataIndex: "balance",
            key: "balance",
            align: "right",
            width: "16%",
            render: (v: number) =>
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(v),
        },
        {
            title: "Updated",
            dataIndex: "updatedAt",
            key: "updatedAt",
            align: "center",
            width: "16%",
            render: (t: string | undefined) => {
                if (!t) return "—";

                const d = new Date(t);

                const hh = String(d.getHours()).padStart(2, "0");
                const mm = String(d.getMinutes()).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const MM = String(d.getMonth() + 1).padStart(2, "0");
                const yyyy = d.getFullYear();

                return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
            },
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: "16%",
            render: (_: any, record: Bank) => (
                <Space>
                    <Button size="small" onClick={() => onAdd10k(record.id)}>
                        +10k
                    </Button>
                    <Popconfirm
                        title="Remove bank?"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button danger size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const screens = useBreakpoint();

    return (
        <Table
            rowKey="id"
            dataSource={banks}
            columns={columns}
            size="small"
            pagination={false}
            components={
                screens.xs
                    ? {
                          header: {
                              cell: (props: any) => (
                                  <th
                                      {...props}
                                      style={{
                                          padding: "4px 6px",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                          borderColor: "#e8e8e8",
                                      }}
                                  />
                              ),
                          },
                          body: {
                              cell: (props: any) => (
                                  <td
                                      {...props}
                                      style={{
                                          padding: "2px 6px",
                                          fontSize: "10px",
                                          borderColor: "#e8e8e8",
                                      }}
                                  />
                              ),
                          },
                      }
                    : undefined
            }
        />
    );
}
