"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/redux/slices/userSlice";
import { useBalanceStore } from "@/store/zustand/useBalanceStore";
import { createClient } from "@/utils/supabase/client";

import {
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Space,
    Descriptions,
    notification,
    Tabs,
    App,
    Table,
} from "antd";

import type { ColumnsType } from "antd/es/table";
import { users as initialUsers } from "@/lib/users";

const AnimatedModal = dynamic(() => import("@/components/Modal/Animated"), {
    ssr: false,
});
const AnimatedTable = dynamic(() => import("@/components/Table/Motion"), {
    ssr: false,
});

// ---------- mapper ----------
function mapSupabaseUser(u: any) {
    const f = u.users_finance?.[0];
    return {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phoneNumber: u.phone_number,
        roles: u.roles ?? [],
        password: u.password,
        totalIncome: f?.total_income ?? 0,
        balance: f?.current_balance ?? 0,
        limits: f?.limits ?? [],
        source: "supabase",
    };
}

export default function ManageUsersOnePage() {
    const supabase = createClient();
    const dispatch = useDispatch();
    const { modal } = App.useApp();

    const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [form] = Form.useForm();

    const [addOpen, setAddOpen] = useState(false);
    const [addForm] = Form.useForm();

    const [limitOpen, setLimitOpen] = useState(false);
    const [limitData, setLimitData] = useState<any[]>([]);

    const setTotalIncome = useBalanceStore((s) => s.setTotalIncome);
    const setBalance = useBalanceStore((s) => s.setBalance);
    const addLimit = useBalanceStore((s) => s.addLimit);
    const resetAll = useBalanceStore((s) => s.resetAll);

    // ---------- load supabase ----------
 
    const loadSupabase = async () => {
        try {
            const { data, error } = await supabase
                .from("master_users")
                .select(`*, users_finance (*)`);

            if (error) {
                notification.error({ message: error.message });
                return;
            }

            setRemoteUsers((data ?? []).map(mapSupabaseUser));
        } catch (err: any) {
            console.error("Error loading users:", err);
            notification.error({ message: "Failed to load users." });
        }
    };


    useEffect(() => {
        loadSupabase();
    }, []);

    // ---------- separated datasets ----------
    const localData = useMemo(
        () => initialUsers.map((u) => ({ ...u, source: "local" })),
        [],
    );

    const supabaseData = useMemo(
        () => remoteUsers.map((u) => ({ ...u, source: "supabase" })),
        [remoteUsers],
    );

    // ---------- restore ----------
    const handleRestore = (u: any) => {
        try {
            dispatch(
                setUser({
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    isAuthenticated: true,
                })
            );

            if (u.source === "supabase") {
                resetAll();
                setTotalIncome(u.totalIncome);
                setBalance(u.balance);
                u.limits?.forEach((l: any) => addLimit(l.title, l.value));
            }

            notification.success({ message: "User restored to stores" });
        } catch (err: any) {
            console.error("Error restoring user:", err);
            notification.error({ message: "Failed to restore user." });
        }
    };

    // ---------- edit ----------
    const openEdit = (u: any) => {
        if (u.source !== "supabase") return;

        setEditingUser(u);
        form.setFieldsValue({
            first_name: u.firstName,
            last_name: u.lastName,
            email: u.email,
            total_income: u.totalIncome,
            current_balance: u.balance,
        });
        setEditOpen(true);
    };

  const handleSave = async () => {
        try {
            if (!editingUser) return;
            const v = await form.validateFields();

            const { error: userError } = await supabase
                .from("master_users")
                .update({
                    first_name: v.first_name,
                    last_name: v.last_name,
                    email: v.email,
                })
                .eq("id", editingUser.id);

            if (userError) throw userError;

            const { error: financeError } = await supabase
                .from("users_finance")
                .update({
                    total_income: v.total_income,
                    current_balance: v.current_balance,
                })
                .eq("user_id", editingUser.id);

            if (financeError) throw financeError;

            notification.success({ message: "Updated" });
            setEditOpen(false);
            loadSupabase();
        } catch (err: any) {
            console.error("Error saving user:", err);
            notification.error({ message: err.message || "Failed to update user." });
        }
    };

    const handleAdd = async () => {
        try {
            const v = await addForm.validateFields();

            const { data, error } = await supabase
                .from("master_users")
                .insert({
                    first_name: v.first_name,
                    last_name: v.last_name,
                    email: v.email,
                    password: v.password,
                    phone_number: v.phone_number,
                })
                .select()
                .single();

            if (error) throw error;

            const { error: financeError } = await supabase.from("users_finance").insert({
                user_id: data.id,
                total_income: v.total_income ?? 0,
                current_balance: v.current_balance ?? 0,
                limits: [],
            });

            if (financeError) throw financeError;

            notification.success({ message: "User added" });
            setAddOpen(false);
            addForm.resetFields();
            loadSupabase();
        } catch (err: any) {
            console.error("Error adding user:", err);
            notification.error({ message: err.message || "Failed to add user." });
        }
    };

    const handleDelete = async (u: any) => {
        try {
            modal.confirm({
                title: `Are you sure you want to delete ${u.firstName}?`,
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: async () => {
                    try {
                        await supabase.from("users_finance").delete().eq("user_id", u.id);
                        await supabase.from("master_users").delete().eq("id", u.id);
                        notification.success({ message: "User deleted" });
                        loadSupabase();
                    } catch (err: any) {
                        console.error("Error deleting user:", err);
                        notification.error({ message: "Failed to delete user." });
                    }
                },
            });
        } catch (err: any) {
            console.error("Error triggering delete modal:", err);
            notification.error({ message: "Failed to delete user." });
        }
    };

    // ---------- columns ----------
    const columns: ColumnsType<any> = [
        { title: "No", render: (_, __, i) => i + 1, width: 60 },
        {
            title: "Name",
            render: (_, r) => `${r.firstName} ${r.lastName}`,
        },
        { title: "Email", dataIndex: "email" },
        { title: "Phone", dataIndex: "phoneNumber" },
        {
            title: "Roles",
            render: (r) => (r.roles ?? []).join(", "),
        },
        {
            title: "Income",
            render: (_, r) =>
                r.source === "supabase"
                    ? `Rp ${Number(r.totalIncome ?? 0).toLocaleString()}`
                    : "-",
        },
        {
            title: "Balance",
            render: (_, r) =>
                r.source === "supabase"
                    ? `Rp ${Number(r.balance ?? 0).toLocaleString()}`
                    : "-",
        },
        {
            title: "Action",
            render: (_, r) => (
                <Space>
                    <Button
                        onClick={() => {
                            setSelectedUser(r);
                            setDetailOpen(true);
                        }}
                    >
                        Details
                    </Button>

                    <Button onClick={() => handleRestore(r)}>Restore</Button>

                    {r.source === "supabase" && (
                        <>
                            <Button onClick={() => openEdit(r)}>Edit</Button>

                            <Button
                                onClick={() => {
                                    setLimitData(r.limits ?? []);
                                    setLimitOpen(true);
                                }}
                            >
                                Limits
                            </Button>
                            <Button danger onClick={() => handleDelete(r)}>
                                Delete
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => setAddOpen(true)}>
                    Add Supabase User
                </Button>
            </Space>

            <Tabs
                items={[
                    {
                        key: "local",
                        label: "Local Users",
                        children: (
                                <Table
                                size="small"
                                bordered
                rowKey="id"
                columns={columns}
                dataSource={localData}
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 5 }}
                  style={{ fontSize: '10px' }} // reduce table font size
  components={{
    body: {
      row: (props) => (
        <tr {...props} style={{ height: '20px' }} /> // set row height
      ),
    },
  }}
              />
                        ),
                    },
                    {
                        key: "supabase",
                        label: "Supabase Users",
                        children: (
                               <Table
                rowKey="id"
                columns={columns}
                dataSource={supabaseData}
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 5 }}
              />
                        ),
                    },
                ]}
            />

            {/* ---------- details ---------- */}
            <AnimatedModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                title="User Details"
            >
                {selectedUser && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Name">
                            {selectedUser.firstName} {selectedUser.lastName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {selectedUser.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Roles">
                            {(selectedUser.roles ?? []).join(", ")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Source">
                            {selectedUser.source}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </AnimatedModal>

            {/* ---------- edit ---------- */}
            <Modal
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                onOk={handleSave}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="total_income" label="Income">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="current_balance" label="Balance">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ---------- limits ---------- */}
            <Modal
                open={limitOpen}
                footer={null}
                onCancel={() => setLimitOpen(false)}
            >
                <AnimatedTable
                    rowKey="title"
                    data={limitData}
                    columns={[
                        { title: "Title", dataIndex: "title" },
                        { title: "Value", dataIndex: "value" },
                    ]}
                />
            </Modal>

            {/* ---------- add ---------- */}
            <Modal
                open={addOpen}
                onCancel={() => setAddOpen(false)}
                onOk={handleAdd}
            >
                <Form form={addForm} layout="vertical">
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="phone_number" label="Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item name="total_income" label="Income">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="current_balance" label="Balance">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
