"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
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

  // flip to form after 1.5s
  useEffect(() => {
    const timeout = setTimeout(() => setShowForm(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

     await signIn("credentials", {
      email: data.email,
      password: data.password,
        callbackUrl: "/auth/loading",
    });

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
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            <Image
              src="/assets/logo/rd_silverwood02.svg"
              alt="Logo"
              width={200}
              height={200}
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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

            <Title level={4} style={{ textAlign: "center", marginBottom: 32 }}>
              Silverwood Access
            </Title>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Email" size="large" />}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input.Password {...field} placeholder="Password" size="large" />}
              />
              <Button htmlType="submit" type="primary" size="large" block loading={loading}>
                Login
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
