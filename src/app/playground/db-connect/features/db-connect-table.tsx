"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/redux/slices/userSlice";
import { useBalanceStore } from "@/store/zustand/useBalanceStore";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import {
  Card,
  Table,
  Typography,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  notification,
} from "antd";

const { Title, Text } = Typography;

type Props = {
  memberTypes: { id: string; type_name: string }[];
  users: any[];
};

export default function UsersView({ memberTypes, users }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  // ---------- Zustand ----------
  const setTotalIncome = useBalanceStore((s) => s.setTotalIncome);
  const setBalance = useBalanceStore((s) => s.setBalance);
  const addLimit = useBalanceStore((s) => s.addLimit);
  const resetAll = useBalanceStore((s) => s.resetAll);

  const handleLoadFinance = (u: any) => {
    const finance = u.users_finance?.[0];
    if (!finance) return;

    resetAll();
    setTotalIncome(finance.total_income);
    setBalance(finance.current_balance);

    finance.limits?.forEach((l: any) => {
      addLimit(l.title, l.value);
    });

    notification.success({
      message: "Finance Loaded",
      description: "Balance data pushed to local store.",
    });
  };

  // ---------- Redux ----------
  const handleSelectUser = (u: any) => {
    dispatch(
      setUser({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        memberType: u.member_type_id,
        isAuthenticated: true,
      }),
    );

    notification.success({
      message: "Active User Set",
      description: `${u.first_name} is now active in Redux state.`,
    });
  };

  // ---------- Modal open ----------
  const openEditModal = (u: any) => {
    const finance = u.users_finance?.[0];

    setEditingUser(u);
    form.setFieldsValue({
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      total_income: finance?.total_income,
      current_balance: finance?.current_balance,
    });

    setOpen(true);
  };

  // ---------- Save edits + refresh ----------
  const handleSave = async () => {
    const values = await form.validateFields();
    if (!editingUser) return;

    const userRes = await supabase
      .from("master_users")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
      })
      .eq("id", editingUser.id);

    if (userRes.error) {
      notification.error({
        message: "Update Failed",
        description: userRes.error.message,
      });
      return;
    }

    const finRes = await supabase
      .from("users_finance")
      .update({
        total_income: values.total_income,
        current_balance: values.current_balance,
      })
      .eq("user_id", editingUser.id);

    if (finRes.error) {
      notification.error({
        message: "Finance Update Failed",
        description: finRes.error.message,
      });
      return;
    }

    notification.success({
      message: "Saved",
      description: "User and finance data updated successfully.",
    });

    setOpen(false);
    setEditingUser(null);

    // 🔄 refresh server component data
    router.refresh();
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
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

      <Card>
        <Title level={4}>Users</Title>

        <Table
          rowKey="id"
          dataSource={users}
          pagination={false}
          columns={[
            {
              title: "Name",
              render: (_, u: any) => (
                <Text strong>
                  {u.first_name} {u.last_name}
                </Text>
              ),
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
                return f
                  ? `Rp ${f.current_balance.toLocaleString()}`
                  : "-";
              },
            },
            {
              title: "Actions",
              render: (_, u: any) => (
                <Space>
                  <Button onClick={() => handleSelectUser(u)}>
                    Set Active
                  </Button>
                  <Button onClick={() => handleLoadFinance(u)}>
                    Push Finance
                  </Button>
                  <Button onClick={() => openEditModal(u)}>
                    Edit
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={open}
        title="Edit User"
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText="Save"
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

          <Form.Item name="total_income" label="Total Income">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="current_balance" label="Current Balance">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
