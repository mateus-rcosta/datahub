"use client";

import { useAuth } from "@/features/auth/context/authClientProvider";
import { redirect } from "next/navigation";

export default function page () {
    const payload = useAuth();
    if(payload) {
        redirect("/dashboard");
    }
    
    redirect("/auth/login");
}