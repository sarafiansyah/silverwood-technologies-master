"use client";

import React from "react";
import { Row, Col, Card, Statistic, Divider, Typography, Grid } from "antd";
import { useBankStore } from "@/store/zustand/useBankStore";
import BankTable from "@/components/Finance/bank/BankTable";
import AddBankForm from "@/components/Finance/bank/AddBankForm";
import FinanceNavCard from "@/components/Card/FinanceNavCard";

const { useBreakpoint } = Grid;

export default function BankBalancesPage() {
    const banks = useBankStore((s) => s.banks);
    const addBank = useBankStore((s) => s.addBank);
    const updateBank = useBankStore((s) => s.updateBank);
    const removeBank = useBankStore((s) => s.removeBank);
    const totalBalance = useBankStore((s) => s.totalBalance);
    const screens = useBreakpoint();
    // Prevent hydration mismatch
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => setReady(true), []);

    const handleAdd = (vals: {
        name: string;
        account: string;
        currency: string;
        balance: number;
    }) => {
        addBank({
            name: vals.name,
            account: vals.account,
            currency: vals.currency,
            balance: vals.balance,
        });
    };

    const handleAdd10k = (id: string) => {
        const target = banks.find((b) => b.id === id);
        if (!target) return;

        updateBank(id, {
            balance: Math.round((target.balance + 10000) * 100) / 100,
        });
    };

    return (
        <div style={{ padding: "2px 12px" }}>
            {screens.xs && (
                <Row gutter={[24, 24]}>
                    <div style={{ width: "100%", marginBottom: 10 }}>
                        <FinanceNavCard />
                    </div>
                </Row>
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card size="small">
                        <BankTable
                            banks={banks}
                            onAdd10k={handleAdd10k}
                            onDelete={removeBank}
                        />

                        <Divider />

                        <AddBankForm onAdd={handleAdd} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card size="small">
                        <Statistic
                            title="Total (IDR)"
                            value={ready ? totalBalance() : 0}
                            precision={2}
                            valueStyle={{ fontSize: 22 }}
                        />

                        <Divider />

                        <Typography.Paragraph style={{ marginTop: 12 }}>
                            Notes:
                            <ul>
                                <li>
                                    Balances are normalized using client-side
                                    logic.
                                </li>
                                <li>
                                    Values only calculated after hydration to
                                    avoid SSR mismatch.
                                </li>
                            </ul>
                        </Typography.Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
