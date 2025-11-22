// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, type LoginCredentials } from "../api/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginCredentials>({
        taiKhoan: "",
        matKhau: "",
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            alert(`Xin chào, ${user.hoTen}!`);
            navigate("/");
        },
        onError: (err: any) => {
            alert(`Login failed: ${err?.response?.data?.content || err.message}`);
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="border rounded p-6 w-full max-w-sm shadow"
            >
                <h1 className="text-xl font-bold mb-4">Login</h1>

                <label className="block mb-2 text-sm">
                    Tài khoản
                    <input
                        name="taiKhoan"
                        value={form.taiKhoan}
                        onChange={handleChange}
                        className="border rounded w-full px-2 py-1 mt-1"
                    />
                </label>

                <label className="block mb-4 text-sm">
                    Mật khẩu
                    <input
                        type="password"
                        name="matKhau"
                        value={form.matKhau}
                        onChange={handleChange}
                        className="border rounded w-full px-2 py-1 mt-1"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
                >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
