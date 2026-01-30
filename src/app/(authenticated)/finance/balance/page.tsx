"use client";

import { useState, useMemo } from "react";
import { useBalanceStore } from "@/store/zustand/useBalanceStore";
import { useHeirloomStore, Heirloom } from "@/store/zustand/useHeirloomStore";
import {
    Card,
    InputNumber,
    Button,
    Typography,
    Input,
    Row,
    Col,
    Modal,
    Form,
    Grid,
} from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    EditOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import FinanceNavCard from "@/components/Card/FinanceNavCard";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function BalanceTracker() {
    const {
        totalIncome,
        currentBalance,
        limits,
        addIncome,
        addLimit,
        removeLimit,
        resetAll,
        setTotalIncome,
        editLimit,
        setBalance,
    } = useBalanceStore();

    const [amount, setAmount] = useState<number>(0);
    const [limitTitle, setLimitTitle] = useState("");
    const [limitValue, setLimitValue] = useState<number>(0);
    const [showBalance, setShowBalance] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editValue, setEditValue] = useState<number>(totalIncome);
    const [isEditLimitModalOpen, setIsEditLimitModalOpen] = useState(false);
    const [editingLimit, setEditingLimit] = useState<{
        title: string;
        value: number;
    } | null>(null);
    const [editLimitTitle, setEditLimitTitle] = useState("");
    const [editLimitValue, setEditLimitValue] = useState(0);
    const { heirlooms, addHeirloom, editHeirloom, deleteHeirloom } =
        useHeirloomStore();
    const screens = useBreakpoint();

    const formatIDR = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const totalPrice = useMemo(
        () => heirlooms.reduce((sum, item) => sum + item.price, 0),
        [heirlooms],
    );

    const handleEditSave = () => {
        if (!isNaN(editValue) && editValue >= 0) {
            setTotalIncome(editValue);
            setIsEditModalOpen(false);
        }
    };

    const handleLimitEditSave = () => {
        if (!editingLimit) return;
        if (editLimitTitle && editLimitValue >= 0) {
            editLimit(editingLimit.title, editLimitTitle, editLimitValue);
            setIsEditLimitModalOpen(false);
            setEditingLimit(null);
        }
    };

    return (
        <div
            style={{
                width: "100%",
                padding: "2px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {screens.xs && (
                <Row gutter={[24, 24]}>
                    <div style={{ width: "100%", marginBottom: 10 }}>
                        {" "}
                        <FinanceNavCard />
                    </div>
                </Row>
            )}

            <Row gutter={[24, 24]} wrap align="top">
                {/* Balance & Limits */}
                <Col xs={24} md={16}>
                    <Row gutter={[screens.xs ? 8 : 16, screens.xs ? 8 : 16]}>
                        {/*  Initial Balance */}
                        <Col xs={12} sm={12}>
                            <Card
                                title={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            padding: 0,
                                            fontSize: screens.xs ? 10 : 16,
                                        }}
                                    >
                                        <span>Initial Balance</span>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: screens.xs ? 0 : 8,
                                            }}
                                        >
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => {
                                                    setEditValue(totalIncome);
                                                    setIsEditModalOpen(true);
                                                }}
                                            />
                                            <Button
                                                type="text"
                                                icon={
                                                    showBalance ? (
                                                        <EyeInvisibleOutlined />
                                                    ) : (
                                                        <EyeOutlined />
                                                    )
                                                }
                                                onClick={() =>
                                                    setShowBalance(!showBalance)
                                                }
                                            />
                                        </div>
                                    </div>
                                }
                                styles={{
                                    body: { padding: screens.xs ? 10 : 24 },
                                }}
                                variant="borderless"
                                style={{
                                    borderRadius: 12,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Title
                                    level={3}
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #585858ff, #979797ff)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: "bold",
                                        fontSize: screens.xs ? 13 : 30,
                                        transition: "font-size 0.2s ease",
                                    }}
                                >
                                    {showBalance
                                        ? formatIDR(totalIncome)
                                        : "•••••••"}
                                </Title>
                            </Card>
                        </Col>

                        {/* ✅ Final Balance */}
                        <Col xs={12} sm={12}>
                            <Card
                                variant="borderless"
                                title={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            fontSize: screens.xs ? 10 : 16,
                                        }}
                                    >
                                        <span>Final Balance</span>
                                        <Button
                                            type="text"
                                            icon={
                                                showBalance ? (
                                                    <EyeInvisibleOutlined />
                                                ) : (
                                                    <EyeOutlined />
                                                )
                                            }
                                            onClick={() =>
                                                setShowBalance(!showBalance)
                                            }
                                        />
                                    </div>
                                }
                                styles={{
                                    body: { padding: screens.xs ? 10 : 24 },
                                }}
                                style={{
                                    borderRadius: 12,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Title
                                    level={3}
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #0da84dff, #19d90fff)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: "bold",
                                        fontSize: screens.xs ? 13 : 30,
                                        transition: "font-size 0.2s ease",
                                    }}
                                >
                                    {showBalance
                                        ? formatIDR(currentBalance - totalPrice)
                                        : "•••••••"}
                                </Title>
                                {currentBalance - totalPrice < 0 && (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 4,
                                            color: "#ff4d4f",
                                            fontSize: 12,
                                            marginTop: 2,
                                        }}
                                    >
                                        <WarningOutlined />
                                        Your expenses exceed your balance
                                    </span>
                                )}
                            </Card>
                        </Col>

                        <Col xs={8} sm={12} md={8} lg={6}>
                            <Card
                                size="small"
                                variant="borderless"
                                style={{
                                    borderRadius: 10,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    position: "relative",
                                }}
                                styles={{
                                    body: { padding: screens.xs ? 10 : 12 },
                                }}
                            >
                                <Title
                                    style={{
                                        fontSize: screens.xs ? 10 : 18,
                                    }}
                                >
                                    Self Rewards
                                </Title>
                                <Title
                                    style={{
                                        fontSize: screens.xs ? 12 : 18,
                                        background:
                                            "linear-gradient(90deg, #0077ff, #00c6ff 85%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        marginTop: screens.xs ? 0 : 8,
                                    }}
                                >
                                    {formatIDR(totalPrice)}
                                </Title>
                            </Card>
                        </Col>

                        {/* 🎯 Limit Cards */}
                        {limits.map((card, i) => (
                            <Col xs={8} sm={12} md={8} lg={6} key={i}>
                                <Card
                                    size="small"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 10,
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.08)",
                                        position: "relative",
                                    }}
                                    styles={{
                                        body: { padding: screens.xs ? 10 : 12 },
                                    }}
                                    onClick={() => {
                                        setEditingLimit(card);
                                        setEditLimitTitle(card.title);
                                        setEditLimitValue(card.value);
                                        setIsEditLimitModalOpen(true);
                                    }}
                                >
                                    {!screens.xs && (
                                        <>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                size="small"
                                                style={{
                                                    position: "absolute",
                                                    top: 4,
                                                    right: 28,
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingLimit(card);
                                                    setEditLimitTitle(
                                                        card.title,
                                                    );
                                                    setEditLimitValue(
                                                        card.value,
                                                    );
                                                    setIsEditLimitModalOpen(
                                                        true,
                                                    );
                                                }}
                                            />

                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                                size="small"
                                                style={{
                                                    position: "absolute",
                                                    top: 4,
                                                    right: 4,
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeLimit(card.title);
                                                }}
                                            />
                                        </>
                                    )}

                                    <Title
                                        style={{
                                            fontSize: screens.xs ? 10 : 18,
                                        }}
                                    >
                                        {card.title}
                                    </Title>
                                    <Title
                                        style={{
                                            marginTop: screens.xs ? 0 : 8,
                                            fontSize: screens.xs ? 12 : 18,
                                            background:
                                                "linear-gradient(90deg, #ff7a18, #af002d 85%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        {formatIDR(card.value)}
                                    </Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* ⚙️ Controls */}
                <Col xs={24} md={8}>
                    <Card
                        title="Manage Balance"
                        style={{
                            marginBottom: 24,
                            borderRadius: 12,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Form layout="vertical">
                            <Form.Item label="Amount">
                                <InputNumber
                                    min={0}
                                    value={amount}
                                    onChange={(value) =>
                                        setAmount(Number(value))
                                    }
                                    placeholder="Enter amount"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Form>

                        <div style={{ display: "flex", gap: 8 }}>
                            <Button
                                type="primary"
                                block
                                onClick={() => addIncome(amount)}
                            >
                                Add Income
                            </Button>
                            <Button
                                type="dashed"
                                danger
                                block
                                onClick={resetAll}
                            >
                                Reset
                            </Button>
                        </div>
                    </Card>

                    <Card
                        title="Add Limit"
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Form layout="vertical">
                            <Form.Item
                                label="Title"
                                style={{ marginBottom: 8, marginTop: -8 }}
                            >
                                <Input
                                    placeholder="Limit title"
                                    value={limitTitle}
                                    onChange={(e) =>
                                        setLimitTitle(e.target.value)
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label="Amount"
                                style={{ marginBottom: 16 }}
                            >
                                <InputNumber
                                    placeholder="Limit value"
                                    value={limitValue}
                                    onChange={(v) => setLimitValue(Number(v))}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Form>

                        <Button
                            type="primary"
                            block
                            onClick={() => {
                                if (limitTitle && limitValue > 0) {
                                    addLimit(limitTitle, limitValue);
                                    setLimitTitle("");
                                    setLimitValue(0);
                                }
                            }}
                        >
                            Add Limit
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* ✏️ Edit Modal */}
            <Modal
                title="Edit Initial Balance"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEditSave}
                okText="Save"
            >
                <InputNumber
                    min={0}
                    value={editValue}
                    onChange={(v) => setEditValue(Number(v))}
                    style={{ width: "100%" }}
                    placeholder="Enter new balance"
                />
            </Modal>
            <Modal
                title="Edit Limit"
                open={isEditLimitModalOpen}
                onCancel={() => setIsEditLimitModalOpen(false)}
                footer={[
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        disabled={!editingLimit}
                        onClick={() => {
                            if (!editingLimit) return;

                            removeLimit(editingLimit.title);
                            setIsEditLimitModalOpen(false);
                        }}
                    >
                        Delete
                    </Button>,

                    <Button
                        key="cancel"
                        onClick={() => setIsEditLimitModalOpen(false)}
                    >
                        Cancel
                    </Button>,

                    <Button
                        key="save"
                        type="primary"
                        onClick={handleLimitEditSave}
                    >
                        Save
                    </Button>,
                ]}
                okText="Save"
            >
                <Input
                    placeholder="Limit title"
                    value={editLimitTitle}
                    onChange={(e) => setEditLimitTitle(e.target.value)}
                    style={{ marginBottom: 8, width: "100%" }}
                />
                <InputNumber
                    placeholder="Limit value"
                    min={0}
                    value={editLimitValue}
                    onChange={(v) => setEditLimitValue(Number(v))}
                    style={{ width: "100%" }}
                />
            </Modal>
        </div>
    );
}
