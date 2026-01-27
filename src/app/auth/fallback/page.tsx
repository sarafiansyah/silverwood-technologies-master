"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Alert, Button, Input, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/redux/userSlice";
import Image from "next/image";

const { Title } = Typography;

type LoginForm = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { control, handleSubmit } = useForm<LoginForm>();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Detect refresh and redirect
    useEffect(() => {
        const navEntry = performance.getEntriesByType(
            "navigation",
        )[0] as PerformanceNavigationTiming;
        if (navEntry?.type === "reload") {
            router.replace("/auth/login");
        }
    }, [router]);

    // flip to form after 1.5s
    useEffect(() => {
        const timeout = setTimeout(() => setShowForm(true), 1500);
        return () => clearTimeout(timeout);
    }, []);

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);

        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/auth/loading",
        });

        if (res?.ok) {
            message.success("Welcome back!");
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            dispatch(setUser(sessionData.user));
            router.push("/");
        } else {
            setLoading(false);
            message.error("Invalid email or password");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f5f5f5",
                perspective: 1000,
            }}
        >
            <div
                style={{
                    width: 380,
                    minHeight: 460,
                    backgroundColor: "#fff",
                    padding: 32,
                    borderRadius: 16,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backfaceVisibility: "hidden",
                }}
            >
                <Image
                    src="/assets/logo/rd_silverwood_trans.svg"
                    alt="Logo"
                    width={180}
                    height={50}
                    style={{ objectFit: "contain", marginBottom: 20 }}
                />

                <Title
                    level={4}
                    style={{ textAlign: "center", marginBottom: 32 }}
                >
                    Silverwood Access
                </Title>

                <div style={{ margin: 10 }}>
                    <Alert
                        message="Invalid Username or Password. Please Check your login details."
                        type="error"
                        showIcon
                        closable
                    />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        width: "100%",
                    }}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Email"
                                size="large"
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                placeholder="Password"
                                size="large"
                            />
                        )}
                    />

                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        block
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
