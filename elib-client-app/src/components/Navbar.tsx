"use client";
import Link from "next/link";
import React from "react";
import { FaBook } from "react-icons/fa";
export default function Navbar() {
    const navLinks = [
        {
            labe: "Home",
            link: "/",
        },
        {
            labe: "About",
            link: "/about",
        },
        {
            labe: "Contact",
            link: "/contact",
        },
    ];
    return (
        <main className="shadow-md relative z-[100] bg-gray-100">
            <div className="max-w-7xl mx-auto ">
                <nav className=" flex justify-between items-center py-5   md:mx-10 lg:mx-6">
                    <section className="flex items-center gap-4">
                        <Link
                            href={"/"}
                            className="text-4xl   font-mono flex items-center gap-2 md:gap-2"
                        >
                            <FaBook className="w-6 h-6 fill-green-600" />
                            <div className="text-xl font-bold lg:text-2xl">
                                E<span className="text-green-600">Book</span>
                            </div>
                        </Link>
                    </section>
                    <div className="flex items-center gap-10">
                        {navLinks.map((d, i) => (
                            <Link
                                key={i}
                                className="hidden lg:block text-gray-600 uppercase text-xl hover:text-[#004073]"
                                href={d.link}
                            >
                                {d.labe}
                            </Link>
                        ))}
                    </div>
                    <section className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="text-2xl   px-4 py-2 font-mono flex items-center gap-2 md:gap-2"
                        >
                            <div className="text-xl font-bold lg:text-2xl">
                                log<span className="text-green-600">In</span>
                            </div>
                        </Link>
                        <Link
                            href="/"
                            className="text-2xl   px-4 py-2 font-mono flex items-center gap-2 md:gap-2"
                        >
                            <div className="text-xl font-bold lg:text-2xl">
                                singn<span className="text-blue-600">In</span>
                            </div>
                        </Link>
                    </section>
                </nav>
                <hr />
            </div>
        </main>
    );
}
