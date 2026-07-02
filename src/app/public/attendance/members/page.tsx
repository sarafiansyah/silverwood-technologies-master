"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    message,
} from "antd";
import axios from "axios";

const { Title } = Typography;

interface Employee {
    id: string;
    name: string;
    department: string;
    position: string;
}

export default function Home() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Employee | null>(null);

    const [form] = Form.useForm();

    const loadEmployees = async () => {
        setLoading(true);

        try {
            const res = await axios.get("/api/attendance");
            setEmployees(res.data);
        } catch {
            message.error("Failed to load employees");
        }

        setLoading(false);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const onAdd = () => {
        setEditing(null);
        form.resetFields();
        setOpen(true);
    };

    const onEdit = (employee: Employee) => {
        setEditing(employee);
        form.setFieldsValue(employee);
        setOpen(true);
    };

    const onDelete = async (id: string) => {
        try {
            await axios.delete(`/api/attendance?id=${id}`);

            message.success("Employee deleted");
            loadEmployees();
        } catch {
            message.error("Delete failed");
        }
    };

    const onFinish = async (values: Employee) => {
        try {
            if (editing) {
                await axios.put("/api/employees", {
                    ...values,
                    id: editing.id,
                });

                message.success("Employee updated");
            } else {
                await axios.post("/api/attendance", values);

                message.success("Employee added");
            }

            setOpen(false);
            form.resetFields();
            loadEmployees();
        } catch {
            message.error("Save failed");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Department",
            dataIndex: "department",
        },
        {
            title: "Position",
            dataIndex: "position",
        },
        {
            title: "Action",
            render: (_: unknown, record: Employee) => (
                <Space>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete employee?"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: "40px auto",
                padding: 20,
            }}
        >
            <Space
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                <Title level={2}>Attendance Employee</Title>

                <Button type="primary" onClick={onAdd}>
                    Add Employee
                </Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={employees}
            />

            <Modal
                open={open}
                title={editing ? "Edit Employee" : "Add Employee"}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    {!editing && (
                        <Form.Item
                            label="Employee ID"
                            name="id"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="EMP001" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        {editing ? "Update Employee" : "Add Employee"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}
