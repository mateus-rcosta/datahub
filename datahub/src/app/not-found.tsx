
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function page () {
    const user = await verifySession();
    if (!user) return redirect("/auth/login");
    
    redirect("/dashboard");
}