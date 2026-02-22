"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MobileNav = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <button
                className="md:hidden text-2xl ml-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="fixed top-16 lg:top-[12vh] left-0 w-full bg-black border-t border-gray-700 md:hidden z-50">
                    <ul className="flex flex-col items-center space-y-4 py-6 text-sm">
                        <li>
                            <Link
                                href="/"
                                className="hover:text-gray-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                New Arrivals
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shop/Men T-Shirts"
                                className="hover:text-gray-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Men
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shop/Women Tops"
                                className="hover:text-gray-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Women
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shop/Shirts & Jerseys"
                                className="hover:text-gray-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Collections
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default MobileNav;
