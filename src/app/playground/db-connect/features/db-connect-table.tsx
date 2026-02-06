"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setUser } from "@/store/redux/slices/userSlice";
import { useBalanceStore } from "@/store/zustand/useBalanceStore";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import {
    Card,
    Table,
    Typography,
    Space,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    App,
} from "antd";

const { Text } = Typography;

type Props = {
    users: any[];
};

export default function UsersView({ users }: Props) {
    const { notification } = App.useApp();

    const supabase = createClient();
    const router = useRouter();
    const dispatch = useDispatch();
    const userEmail = useSelector((s: any) => s.user.email);

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [form] = Form.useForm();

    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    const [addOpen, setAddOpen] = useState(false);
    const [addForm] = Form.useForm();

    const [limitOpen, setLimitOpen] = useState(false);
    const [limitData, setLimitData] = useState<any[]>([]);

    const setTotalIncome = useBalanceStore(s => s.setTotalIncome);
    const setBalance = useBalanceStore(s => s.setBalance);
    const addLimit = useBalanceStore(s => s.addLimit);
    const resetAll = useBalanceStore(s => s.resetAll);

    // ---------- load filtered user ----------
    useEffect(() => {
        if (!userEmail) return;

        const load = async () => {
            const { data, error } = await supabase
                .from("master_users")
                .select(`*, users_finance (*)`)
                .eq("email", userEmail);

            if (error) {
                notification.error({
                    title: "Load Failed",
                    description: error.message,
                });
                return;
            }

            setFilteredUsers(data ?? []);
        };

        load();
    }, [userEmail, supabase, notification]);

    // ---------- restore ----------
    const handleRestoreUser = (u: any) => {
        dispatch(setUser({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            isAuthenticated: true,
        }));

        const finance = u.users_finance?.[0];
        if (finance) {
            resetAll();
            setTotalIncome(finance.total_income);
            setBalance(finance.current_balance);
            finance.limits?.forEach((l: any) =>
                addLimit(l.title, l.value)
            );
        }

        notification.success({
            title: "User Restored",
            description: "Redux + Zustand synced",
        });
    };

    // ---------- limits ----------
    const openLimitsModal = (u: any) => {
        setLimitData(u.users_finance?.[0]?.limits ?? []);
        setLimitOpen(true);
    };

    // ---------- edit ----------
    const openEditModal = (u: any) => {
        const f = u.users_finance?.[0];
        setEditingUser(u);

        form.setFieldsValue({
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            total_income: f?.total_income,
            current_balance: f?.current_balance,
        });

        setOpen(true);
    };

    const handleSave = async () => {
        const v = await form.validateFields();
        if (!editingUser) return;

        const u1 = await supabase
            .from("master_users")
            .update({
                first_name: v.first_name,
                last_name: v.last_name,
                email: v.email,
            })
            .eq("id", editingUser.id);

        if (u1.error) {
            notification.error({ title: u1.error.message });
            return;
        }

        const u2 = await supabase
            .from("users_finance")
            .update({
                total_income: v.total_income,
                current_balance: v.current_balance,
            })
            .eq("user_id", editingUser.id);

        if (u2.error) {
            notification.error({ title: u2.error.message });
            return;
        }

        notification.success({ title: "Saved" });
        setOpen(false);
        setEditingUser(null);
        router.refresh();
    };

    // ---------- add ----------
    const handleAdd = async () => {
        const v = await addForm.validateFields();

        const { data, error } = await supabase
            .from("master_users")
            .insert({
                first_name: v.first_name,
                last_name: v.last_name,
                email: v.email,
                password: v.password,
                member_type: v.member_type ?? null,
                phone_number: v.phone_number ?? null,
                status: "active",
            })
            .select()
            .single();

        if (error) {
            notification.error({ title: error.message });
            return;
        }

        await supabase.from("users_finance").insert({
            user_id: data.id,
            total_income: v.total_income ?? 0,
            current_balance: v.current_balance ?? 0,
            limits: [],
        });

        notification.success({ title: "User Added" });

        setAddOpen(false);
        addForm.resetFields();
        router.refresh();
    };

    // ---------- UI ----------
    return (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            <Card>

                <Button type="primary" onClick={() => setAddOpen(true)}>
                    Add User
                </Button>

                <Table
                    rowKey="id"
                    dataSource={filteredUsers}
                    pagination={false}
                    columns={[
                        {
                            title: "Name",
                            render: (_, u: any) =>
                                <Text strong>{u.first_name} {u.last_name}</Text>,
                        },
                        { title: "Email", dataIndex: "email" },

                        {
                            title: "Income",
                            render: (_, u: any) => {
                                const f = u.users_finance?.[0];
                                return f ? `Rp ${f.total_income.toLocaleString()}` : "-";
                            },
                        },
                        {
                            title: "Balance",
                            render: (_, u: any) => {
                                const f = u.users_finance?.[0];
                                return f ? `Rp ${f.current_balance.toLocaleString()}` : "-";
                            },
                        },
                        {
                            title: "Limits",
                            render: (_, u: any) =>
                                <Button onClick={() => openLimitsModal(u)}>View</Button>,
                        },
                        {
                            title: "Actions",
                            render: (_, u: any) => (
                                <Space>
                                    <Button onClick={() => handleRestoreUser(u)}>Restore</Button>
                                    <Button onClick={() => openEditModal(u)}>Edit</Button>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>

            {/* EDIT */}
            <Modal open={open} title="Edit User" onCancel={() => setOpen(false)} onOk={handleSave}>
                <Form form={form} layout="vertical">
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="total_income" label="Income"><InputNumber style={{ width: "100%" }} /></Form.Item>
                    <Form.Item name="current_balance" label="Balance"><InputNumber style={{ width: "100%" }} /></Form.Item>
                </Form>
            </Modal>

            {/* LIMITS */}
            <Modal open={limitOpen} footer={null} onCancel={() => setLimitOpen(false)}>
                <Table
                    rowKey={(r: any) => r.title}
                    dataSource={limitData}
                    pagination={false}
                    columns={[
                        { title: "Title", dataIndex: "title" },
                        { title: "Value", dataIndex: "value" },
                    ]}
                />
            </Modal>

            {/* ADD */}
            <Modal open={addOpen} title="Add User" onCancel={() => setAddOpen(false)} onOk={handleAdd}>
                <Form form={addForm} layout="vertical">
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password /></Form.Item>
                    <Form.Item name="phone_number" label="Phone"><Input /></Form.Item>
                    <Form.Item name="total_income" label="Income"><InputNumber style={{ width: "100%" }} /></Form.Item>
                    <Form.Item name="current_balance" label="Balance"><InputNumber style={{ width: "100%" }} /></Form.Item>
                </Form>
            </Modal>

        </Space>
    );
}
