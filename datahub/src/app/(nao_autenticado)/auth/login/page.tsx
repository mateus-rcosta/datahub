"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginAction } from "./_actions/auth";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { AuthErrorType } from "../../_exception/AuthError";
import { formSchema } from "./_schemas/schema";


const ERROR_MESSAGES = {
    [AuthErrorType.CREDENCIAIS_INVALIDAS]: "E-mail ou senha incorretos",
    [AuthErrorType.ERRO_INTERNO]: "Erro interno do servidor. Tente novamente.",
} as const;

export default function PageLogin() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            senha: "",
        },
    });

    const { execute, isExecuting } = useAction(loginAction, {
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: ({ error }) => {
            if (error.validationErrors) {
                const emailError = error.validationErrors.email?._errors?.[0];

                if (emailError) {
                    form.setError("email", { message: emailError });
                }

                return;
            }

            if (error.serverError) {
                const errorMessage = ERROR_MESSAGES[error.serverError.code as AuthErrorType] || "Erro desconhecido";
                form.setError("root", {
                    type: "manual",
                    message: errorMessage,
                });
            }
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        execute(data);
    };

    return (
        <Card className="rounded-lg shadow-sm hover:shadow-2xl transition-shadow duration-200 px-4 py-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%]">
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
                                            disabled={isExecuting}
                                            {...field}
                                            className="h-12 bg-gray-100/90 text-lg!"
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
                                            disabled={isExecuting}
                                            {...field}
                                            className="h-12 text-lg! bg-gray-100/90"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-red-600 font-semibold text-sm rounded-md">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full text-xl mt-2"
                            size="lg"
                            disabled={isExecuting}
                        >
                            {isExecuting ? (
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