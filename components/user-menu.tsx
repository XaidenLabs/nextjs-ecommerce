"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, PackageSearch, Palette, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
    name?: string | null;
    email?: string | null;
};

export default function UserMenu({ name, email }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Get initials from name or email
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : email
            ? email[0].toUpperCase()
            : "?";

    return (
        <div ref={ref} className="relative">
            {/* Avatar + chevron trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1.5 focus:outline-none group"
                aria-expanded={open}
            >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold select-none">
                    {initials}
                </div>
                <ChevronDown
                    size={14}
                    className={`text-white transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                            {name || email}
                        </p>
                        {name && (
                            <p className="text-xs text-gray-400 truncate">{email}</p>
                        )}
                    </div>

                    <Link
                        href="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <PackageSearch size={15} className="text-gray-500" />
                        My Orders
                    </Link>

                    <Link
                        href="/design-lab"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Palette size={15} className="text-gray-500" />
                        Design Lab
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={15} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
