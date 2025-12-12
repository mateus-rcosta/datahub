import { retornaSessaoUsuario } from "@/lib/sessao";
import { redirect } from "next/navigation";

export default async function page () {
    const user = await retornaSessaoUsuario();
    if (!user) return redirect("/auth/login");
    
    redirect("/dashboard");
}