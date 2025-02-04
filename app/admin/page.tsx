"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === "kashafnoor@gmail.com" && password === "kashaf123abc") {
            localStorage.setItem("isLoggedIn", "true");
            router.push("/admin/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-yellow-200 to-yellow-500">
            <form onSubmit={handleLogin} className="bg-yellow-300 p-8 rounded-2xl shadow-xl w-96 border border-yellow-600 transform transition duration-500 hover:scale-105">
                <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-900 drop-shadow-md">Admin Login</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full p-3 mb-4 border border-yellow-600 rounded-lg bg-yellow-100 text-yellow-900 placeholder-yellow-700 focus:ring-2 focus:ring-yellow-500"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 mb-6 border border-yellow-600 rounded-lg bg-yellow-100 text-yellow-900 placeholder-yellow-700 focus:ring-2 focus:ring-yellow-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-yellow-600 text-yellow-100 p-3 rounded-lg font-bold text-lg shadow-md hover:bg-yellow-700 transition duration-300"
                >
                    Login
                </button>
            </form>
        </div>
    );
}