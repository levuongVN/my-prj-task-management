import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CheckSquare, Mail } from "lucide-react";
import axios from "axios";
import Button from "../../shared/components/Ui/Button";
import Input from "../../shared/components/Ui/Input";
import { forgotPassword } from "../../features/auth/services/auth.service";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>({
        defaultValues: { email: "" },
    });

    const [isSending, setIsSending] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const onSubmit = (data: { email: string }) => {
        setIsSending(true);
        setServerError(null);

        forgotPassword({ email: data.email })
            .then(() => {
                // BE luôn trả 200 (kể cả email không tồn tại — chống dò account)
                // → chỉ hiển thị thông báo chung chung, không đoán theo email
                setSubmitted(true);
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    setServerError(error.response?.data?.message || "Something went wrong");
                } else {
                    setServerError("Unknown error");
                }
            })
            .finally(() => setIsSending(false));
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

                {submitted ? (
                    <div className="mt-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            Email sent
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight">
                            Check your inbox
                        </h2>

                        <p className="mt-4 text-zinc-400 leading-7">
                            If that email exists, a password reset link has been sent.
                            The link is valid for 15 minutes and can be used once.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-8 h-12 w-full rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
                        >
                            Back to sign in
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mt-10">
                            <h2 className="text-4xl font-bold tracking-tight">
                                Forgot password?
                            </h2>

                            <p className="mt-4 text-zinc-400 leading-7">
                                Enter your email and we will send you a password reset link.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-8 space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                                    Email
                                </label>

                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    icon={
                                        <Mail
                                            className="text-zinc-400"
                                            size={20}
                                        />
                                    }
                                    error={errors.email?.message}
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                />
                            </div>

                            {serverError && (
                                <p className="text-red-500 text-sm">
                                    {serverError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSending}
                            >
                                {isSending ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>

                        <p className="mt-6 text-sm text-zinc-500 text-center">
                            Remembered your password?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-white hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
