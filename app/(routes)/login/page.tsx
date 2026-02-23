"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
    const router = useRouter();
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const loginUser = async (e: any) => {
        e.preventDefault();
        signIn("credentials", {
            ...data,
            redirect: false,
        })
            .then((callback) => {
                if (callback?.error) {
                    toast.error(callback.error);
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Welcome back.");
                    router.push("/");
                    router.refresh();
                }
            });
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 py-20 lg:px-8">
            <div className="w-full max-w-[400px]">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl italic tracking-tight lowercase">
                        Login
                    </h2>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gray-400">
                        Access your bluepetals account
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={loginUser}>
                    <div className="space-y-6">
                        <div className="group relative border-b border-gray-200 focus-within:border-black transition-colors">
                            <label
                                htmlFor="email"
                                className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="block w-full bg-transparent py-4 text-sm focus:outline-none placeholder:text-gray-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="group relative border-b border-gray-200 focus-within:border-black transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500"
                                >
                                    Password
                                </label>
                                <button type="button" className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-black transition-colors">
                                    Forgot?
                                </button>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="block w-full bg-transparent py-4 text-sm focus:outline-none placeholder:text-gray-200"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-6">
                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-zinc-800 rounded-none h-14 text-[11px] uppercase tracking-[0.3em] font-bold transition-all"
                        >
                            Sign In
                        </Button>

                        <div className="flex flex-col items-center gap-4 text-[11px] uppercase tracking-[0.1em]">
                            <span className="text-gray-400">Don&apos;t have an account?</span>
                            <Link
                                href="/register"
                                className="font-bold border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
                            >
                                Join us
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
