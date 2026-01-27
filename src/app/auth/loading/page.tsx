"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/redux/userSlice";
import { useRouter } from "next/navigation";

export default function AuthLoading() {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();

            if (sessionData?.user) {
                dispatch(setUser(sessionData.user));
                router.replace("/"); // clean transition
            } else {
                router.replace("/auth/login"); // fallback
            }
        };

        loadUser();
    }, [dispatch, router]);

    return <></>;
}
