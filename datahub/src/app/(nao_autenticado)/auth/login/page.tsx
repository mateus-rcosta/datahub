"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { formSchema } from "./_schemas/schema";
import { loginAction } from "./_actions/auth";
import { Loader2 } from "lucide-react";

export default function PageLogin() {
    const [erro, setErro] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            senha: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErro("");

        try {
            await loginAction(data.email, data.senha);
            router.push("/dashboard");
        } catch (error: any) {
            setErro(error.message || "Erro ao fazer login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white rounded-lg shadow-sm hover:shadow-2xl transition-shadow duration-200 px-4 py-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%]">
            <CardHeader className="flex flex-col items-center mb-2">
                <Image src="/logo/logo.svg" alt="Logo" width={100} height={100} priority />
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md">E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="E-mail"
                                            type="email"
                                            autoComplete="email"
                                            disabled={isLoading}
                                            {...field}
                                            className="h-12 bg-gray-100/90 !text-lg"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md">Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Senha"
                                            type="password"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            {...field}
                                            className="h-12 !text-lg bg-gray-100/90"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {erro && (
                            <span className="text-secondary font-semibold text-lg">{erro}</span>
                        )}

                        <Button type="submit" className="bg-primary hover:bg-primary/90 w-full text-xl mt-2" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}