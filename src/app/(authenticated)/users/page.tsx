"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Table, Button, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import { users as initialUsers, UserData } from "@/lib/users";

const AnimatedModal = dynamic(
    () => import("@/components/Modal/Animated"),
    { ssr: false, loading: () => null }
);
const AnimatedTable = dynamic(
    () => import("@/components/Table/Motion"),
    { ssr: false, loading: () => null }
);

export default function ManageUsers() {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [open, setOpen] = useState(false);
    const [data] = useState<UserData[]>(initialUsers);

   const columns: ColumnsType<any> = [
    {
        title: "No",
        key: "no",
        width: "8%",  // example percentage
        render: (_: any, __: any, index: number) => index + 1,
    },
    {
        title: "Name",
        key: "name",
        width: "20%",  // example
        sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
        render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "25%", // example
        sorter: (a, b) => a.email.localeCompare(b.email),
        ellipsis: true,
    },
    {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "18%", // example
        ellipsis: true,
    },
    {
        title: "Role",
        dataIndex: "roles",
        key: "roles",
        width: "20%", // example
        render: (roles: string[]) => roles.join(", "),
        filters: [
            { text: "Admin", value: "Admin" },
            { text: "User", value: "User" },
            { text: "Moderator", value: "Moderator" },
        ],
        onFilter: (value: any, record: any) => record.roles.includes(value),
    },
    {
        title: "Action",
        key: "action",
        width: "15%", // or keep 100px if you want fixed
        render: (_, record) => (
            <Button
                type="primary"
                onClick={() => {
                    setSelectedUser(record);
                    setOpen(true);
                }}
            >
                Details
            </Button>
        ),
    },
];


    return (
        <div style={{ padding: 0 }}>
            <AnimatedTable columns={columns} data={data} rowKey="id" />

            <AnimatedModal
                open={open && !!selectedUser}
                onClose={() => setOpen(false)}
                title={`User Details — ${selectedUser?.firstName} ${selectedUser?.lastName}`}
            >
                {selectedUser && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="First Name">
                                {selectedUser.firstName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Name">
                                {selectedUser.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedUser.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone">
                                {selectedUser.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Roles">
                                {selectedUser.roles.join(", ")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Password">
                                {selectedUser.password}
                            </Descriptions.Item>
                        </Descriptions>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 16,
                            }}
                        >
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </>
                )}
            </AnimatedModal>
        </div>
    );
}
