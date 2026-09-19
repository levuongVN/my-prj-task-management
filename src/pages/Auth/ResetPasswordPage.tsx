import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckSquare, Eye, EyeClosed, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../shared/components/Ui/Button";
import Input from "../../shared/components/Ui/Input";
import { resetPassword } from "../../features/auth/services/auth.service";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const invalidLink = !token;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword.trim() || !token) return;

        setIsResetting(true);
        setServerError(null);

        resetPassword({ token, newPassword })
            .then(() => {
                setDone(true);
                toast.success("Password has been reset successfully");
                // Token 1 lần + refresh tokens của user cũng bị thu hồi phía BE,
                // các device khác tự bị đá về login qua flow 401/refresh fail sẵn.
                navigate("/login", { replace: true });
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    setServerError(error.response?.data?.message || "Password reset failed");
                } else {
                    setServerError("Unknown error");
                }
            })
            .finally(() => setIsResetting(false));
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-800 bg-[#050505] p-10 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl border border-white flex items-center justify-center">
                        <CheckSquare size={22} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
                </div>

                {invalidLink ? (
                    /* Thiếu/không có token trên URL — link hỏng */
                    <div className="mt-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Invalid link
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight">
                            This reset link is invalid
                        </h2>

                        <p className="mt-4 text-zinc-400 leading-7">
                            Invalid link, please request a new one.
                        </p>

                        <Link
                            to="/forgot-password"
                            className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
                        >
                            Request a new link
                        </Link>
                    </div>
                ) : done ? (
                    <div className="mt-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            Success
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight">
                            Password reset
                        </h2>

                        <p className="mt-4 text-zinc-400 leading-7">
                            You can now sign in with your new password.
                        </p>

                        <Link
                            to="/login"
                            className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
                        >
                            Go to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mt-10">
                            <h2 className="text-4xl font-bold tracking-tight">
                                Set a new password
                            </h2>

                            <p className="mt-4 text-zinc-400 leading-7">
                                Choose a new password for your TaskFlow account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                                    New password
                                </label>

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    leftIcon={<Lock size={20} className="text-zinc-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <EyeClosed className="text-zinc-400" size={20} />
                                            ) : (
                                                <Eye className="text-zinc-400" size={20} />
                                            )}
                                        </button>
                                    }
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            {serverError && (
                                <p className="text-red-500 text-sm">{serverError}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isResetting || !newPassword.trim()}
                            >
                                {isResetting ? "Resetting..." : "Reset password"}
                            </Button>
                        </form>

                        <p className="mt-6 text-sm text-zinc-500 text-center">
                            Link expired?{" "}
                            <Link
                                to="/forgot-password"
                                className="font-medium text-white hover:underline"
                            >
                                Send a new email
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
