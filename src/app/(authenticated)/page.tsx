"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/redux/store";
import { clearUser } from "@/store/redux/slices/userSlice";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user.isAuthenticated) {
            router.replace("/dashboard");
        } else {
            router.replace("/auth/login");
        }
    }, [user.isAuthenticated, router]);

    return null; // nothing to show
}
